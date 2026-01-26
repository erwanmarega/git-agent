import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { exec } from "child_process";
import { promisify } from "util";
import { GitAnalyzer } from "../core/git-analyzer";
import { AIService } from "../core/ai-service";
import { ChangeAnalyzer } from "../core/change-analyzer";
import { SuggestionsEngine } from "../core/suggestions";
import { BranchSuggester } from "../core/branch-suggester";
import { PRManager } from "../core/pr-manager";
import { ReviewerSuggester } from "../core/reviewer-suggester";
import { JiraManager } from "../core/jira-manager";

const execAsync = promisify(exec);

async function handlePostCommitActions(
  gitAnalyzer: GitAnalyzer
): Promise<void> {
  const currentBranch = await gitAnalyzer.getCurrentBranch();
  const hasRemote = await gitAnalyzer.hasRemote();

  if (!hasRemote) {
    console.log(chalk.yellow("\n No remote repository configured."));
    console.log(
      chalk.gray("Tip: Add a remote with: git remote add origin <url>")
    );
    return;
  }

  console.log(chalk.cyan("\n Next steps:"));
  console.log(`  1) Push to remote (origin/${currentBranch})`);
  console.log("  2) Stay local");

  const { pushChoice } = await inquirer.prompt([
    {
      type: "input",
      name: "pushChoice",
      message: "Your choice (1-2):",
      validate: (input: string) => {
        if (!["1", "2"].includes(input.trim())) {
          return "Please enter 1 or 2";
        }
        return true;
      },
    },
  ]);

  if (pushChoice.trim() === "1") {
    const branchRemote = await gitAnalyzer.getBranchRemote(currentBranch);
    const needsUpstream = !branchRemote;

    const spinner = ora("Pushing to remote...").start();

    try {
      await gitAnalyzer.push(currentBranch, needsUpstream);

      if (needsUpstream) {
        spinner.succeed(
          chalk.green(`✓ Pushed to origin/${currentBranch} (upstream set)`)
        );
      } else {
        spinner.succeed(chalk.green(`✓ Pushed to origin/${currentBranch}`));
      }

      const commitMessage = await gitAnalyzer.getLastCommitMessage();
      const ticketId = await handleJiraIntegration(
        currentBranch,
        commitMessage
      );

      const changedFiles = await gitAnalyzer.getStagedChanges();
      await handlePRCreation(
        gitAnalyzer,
        currentBranch,
        changedFiles.files,
        ticketId
      );
    } catch (error) {
      spinner.fail("Push failed");
      if (error instanceof Error) {
        console.error(chalk.red(`\n Error: ${error.message}`));
        console.log(
          chalk.yellow(
            "\nTip: Make sure you have access to the remote repository"
          )
        );
      }
    }
  } else {
    console.log(
      chalk.gray("\n Staying local. You can push later with: git push")
    );
  }
}

async function handlePRCreation(
  gitAnalyzer: GitAnalyzer,
  currentBranch: string,
  files: string[] = [],
  jiraTicketId?: string | null
): Promise<void> {
  const prManager = new PRManager();

  const isGitHubCLI = await prManager.isGitHubCLIInstalled();

  if (!isGitHubCLI) {
    console.log(
      chalk.yellow(
        "\n GitHub CLI (gh) not installed. Install it to create PRs automatically."
      )
    );
    console.log(chalk.gray("Visit: https://cli.github.com/"));
    return;
  }

  const isGitHub = await prManager.isGitHubRepo();

  if (!isGitHub) {
    console.log(
      chalk.gray("\n Not a GitHub repository. Skipping PR creation.")
    );
    return;
  }

  const isMainBranch = await gitAnalyzer.isMainBranch();
  if (isMainBranch) {
    return;
  }

  console.log(chalk.cyan("\n Create a Pull Request?"));
  console.log("  1) Yes, create PR");
  console.log("  2) No, skip");

  const { prChoice } = await inquirer.prompt([
    {
      type: "input",
      name: "prChoice",
      message: "Your choice (1-2):",
      validate: (input: string) => {
        if (!["1", "2"].includes(input.trim())) {
          return "Please enter 1 or 2";
        }
        return true;
      },
    },
  ]);

  if (prChoice.trim() === "2") {
    console.log(
      chalk.gray("\n Skipped. You can create a PR later with: gh pr create")
    );
    return;
  }

  const spinner = ora("Preparing PR...").start();

  try {
    const commits = await prManager.getCommitsSinceMain();
    const mainBranch = await prManager.getMainBranchName();

    const title = prManager.generatePRTitle(commits);
    const body = prManager.generatePRBody(commits);

    spinner.stop();

    console.log(chalk.green("\n Generated PR information:\n"));
    console.log(chalk.cyan("Title:"));
    console.log(chalk.white(`  ${title}\n`));
    console.log(chalk.cyan("Description:"));
    console.log(
      chalk.gray(
        body
          .split("\n")
          .map((l) => `  ${l}`)
          .join("\n")
      )
    );
    console.log();

    console.log(chalk.cyan("Options:"));
    console.log("  1) Create PR with this information");
    console.log("  2) Edit title");
    console.log("  3) Cancel");

    const { confirmChoice } = await inquirer.prompt([
      {
        type: "input",
        name: "confirmChoice",
        message: "Your choice (1-3):",
        validate: (input: string) => {
          if (!["1", "2", "3"].includes(input.trim())) {
            return "Please enter 1, 2, or 3";
          }
          return true;
        },
      },
    ]);

    let finalTitle = title;

    if (confirmChoice.trim() === "2") {
      const { editedTitle } = await inquirer.prompt([
        {
          type: "input",
          name: "editedTitle",
          message: "Enter PR title:",
          default: title,
        },
      ]);
      finalTitle = editedTitle;
    } else if (confirmChoice.trim() === "3") {
      console.log(chalk.yellow("\n✗ PR creation cancelled"));
      return;
    }

    let selectedReviewers: string[] = [];

    if (files.length > 0) {
      const reviewerSuggester = new ReviewerSuggester();
      const reviewSpinner = ora("Finding potential reviewers...").start();

      try {
        const reviewerSuggestions = await reviewerSuggester.suggestReviewers(
          files
        );

        reviewSpinner.stop();

        if (reviewerSuggestions.length > 0) {
          console.log(
            chalk.cyan("\n💡 Suggested reviewers based on file history:\n")
          );

          reviewerSuggestions.forEach((r, i) => {
            console.log(
              chalk.gray(
                `  ${i + 1}) ${r.username} (${r.commits} commit${
                  r.commits > 1 ? "s" : ""
                }) - ${r.lastCommitDate}`
              )
            );
          });

          console.log(chalk.cyan("\nDo you want to add reviewers?"));
          console.log("  1) Select from suggestions");
          console.log("  2) Skip reviewers");

          const { reviewerChoice } = await inquirer.prompt([
            {
              type: "input",
              name: "reviewerChoice",
              message: "Your choice (1-2):",
              validate: (input: string) => {
                if (!["1", "2"].includes(input.trim())) {
                  return "Please enter 1 or 2";
                }
                return true;
              },
            },
          ]);

          if (reviewerChoice.trim() === "1") {
            const { reviewerIndices } = await inquirer.prompt([
              {
                type: "input",
                name: "reviewerIndices",
                message: "Enter reviewer numbers (comma-separated, e.g., 1,3):",
                validate: (input: string) => {
                  if (!input.trim()) {
                    return true;
                  }
                  const indices = input.split(",").map((s) => s.trim());
                  for (const idx of indices) {
                    const num = parseInt(idx);
                    if (
                      isNaN(num) ||
                      num < 1 ||
                      num > reviewerSuggestions.length
                    ) {
                      return `Please enter numbers between 1 and ${reviewerSuggestions.length}`;
                    }
                  }
                  return true;
                },
              },
            ]);

            if (reviewerIndices.trim()) {
              const indices = reviewerIndices
                .split(",")
                .map((s: string) => parseInt(s.trim()) - 1);
              selectedReviewers = indices.map(
                (i: number) => reviewerSuggestions[i].username
              );

              console.log(
                chalk.green(
                  `\n✓ Selected reviewers: ${selectedReviewers.join(", ")}`
                )
              );
            }
          }
        } else {
          reviewSpinner.succeed("No reviewer suggestions found");
        }
      } catch (error) {
        reviewSpinner.fail("Failed to get reviewer suggestions");
        console.log(chalk.gray("Continuing without reviewers..."));
      }
    }

    const createSpinner = ora("Creating Pull Request...").start();

    try {
      const prUrl = await prManager.createPR(
        finalTitle,
        body,
        mainBranch,
        selectedReviewers
      );
      createSpinner.succeed(chalk.green("✓ Pull Request created!"));
      console.log(chalk.cyan(`\n View PR: ${prUrl}`));

      if (jiraTicketId) {
        const jiraSpinner = ora(
          `Linking PR to Jira ticket ${jiraTicketId}...`
        ).start();

        try {
          const jiraManager = new JiraManager();

          const prNumberMatch = prUrl.match(/\/pull\/(\d+)/);
          const prNumber = prNumberMatch
            ? parseInt(prNumberMatch[1])
            : undefined;

          await jiraManager.linkPR({
            issueKey: jiraTicketId,
            prUrl,
            prTitle: finalTitle,
            prNumber,
          });

          await jiraManager.transitionOnPR(jiraTicketId);

          jiraSpinner.succeed(
            chalk.green(`✓ PR linked to Jira ticket ${jiraTicketId}`)
          );
        } catch (error) {
          jiraSpinner.warn("Could not link PR to Jira");
        }
      }
    } catch (error) {
      createSpinner.fail("Failed to create PR");
      if (error instanceof Error) {
        console.error(chalk.red(`\n Error: ${error.message}`));
      }
    }
  } catch (error) {
    spinner.fail("Failed to prepare PR");
    if (error instanceof Error) {
      console.error(chalk.red(`\n Error: ${error.message}`));
    }
  }
}

async function handleJiraIntegration(
  currentBranch: string,
  commitMessage: string,
  commitSha?: string
): Promise<string | null> {
  const jiraConfigured =
    process.env.JIRA_BASE_URL &&
    process.env.JIRA_EMAIL &&
    process.env.JIRA_API_TOKEN;

  if (!jiraConfigured) {
    return null;
  }

  try {
    const jiraManager = new JiraManager();
    const extraction = jiraManager.extractTicketFromBranch(currentBranch);

    if (!extraction.ticketId) {
      console.log(chalk.cyan("\n No Jira ticket found in branch name."));
      console.log("Options:");
      console.log("  1) Create new Jira ticket");
      console.log("  2) Link to existing ticket (manual)");
      console.log("  3) Skip Jira integration");

      const { jiraChoice } = await inquirer.prompt([
        {
          type: "input",
          name: "jiraChoice",
          message: "Your choice (1-3):",
          validate: (input: string) => {
            if (!["1", "2", "3"].includes(input.trim())) {
              return "Please enter 1, 2, or 3";
            }
            return true;
          },
        },
      ]);

      if (jiraChoice.trim() === "3") {
        return null;
      }

      if (jiraChoice.trim() === "2") {
        const { manualTicketId } = await inquirer.prompt([
          {
            type: "input",
            name: "manualTicketId",
            message: "Enter Jira ticket ID (e.g., DP-1):",
            validate: (input: string) => {
              if (!input || input.trim().length === 0) {
                return "Ticket ID is required";
              }
              if (!/^[A-Z]+-\d+$/i.test(input.trim())) {
                return "Invalid format. Use format like DP-1, PROJ-123, etc.";
              }
              return true;
            },
          },
        ]);

        extraction.ticketId = manualTicketId.trim().toUpperCase();
      } else {
        const { ticketSummary } = await inquirer.prompt([
          {
            type: "input",
            name: "ticketSummary",
            message: "Enter ticket summary:",
            default: commitMessage.split("\n")[0],
          },
        ]);

        const spinner = ora("Creating Jira ticket...").start();
        const newTicketKey = await jiraManager.createIssue(
          ticketSummary,
          `Branch: ${currentBranch}\nCommit: ${commitMessage}`
        );

        if (newTicketKey) {
          spinner.succeed(
            chalk.green(`✓ Jira ticket created: ${newTicketKey}`)
          );
          extraction.ticketId = newTicketKey;
        } else {
          spinner.fail("Failed to create Jira ticket");
          return null;
        }
      }
    }

    const ticketId = extraction.ticketId;
    if (!ticketId) {
      return null;
    }

    const spinner = ora(`Updating Jira ticket ${ticketId}...`).start();

    const issue = await jiraManager.getIssue(ticketId);
    if (!issue) {
      spinner.fail(`Jira ticket ${ticketId} not found`);
      console.log(chalk.yellow("Continuing without Jira integration..."));
      return null;
    }

    spinner.text = `Linking commit to ${ticketId}...`;

    let sha = commitSha;
    if (!sha) {
      const { stdout } = await execAsync("git rev-parse HEAD");
      sha = stdout.trim();
    }

    let commitUrl: string | undefined;
    try {
      const { stdout } = await execAsync("git config --get remote.origin.url");
      const remoteUrl = stdout.trim();
      if (remoteUrl.includes("github.com")) {
        const match = remoteUrl.match(/github\.com[:/](.+?)(\.git)?$/);
        if (match) {
          const repo = match[1].replace(".git", "");
          commitUrl = `https://github.com/${repo}/commit/${sha}`;
        }
      }
    } catch {}

    const linked = await jiraManager.linkCommit({
      issueKey: ticketId,
      commitSha: sha,
      commitMessage,
      commitUrl,
      branch: currentBranch,
    });

    if (!linked) {
      spinner.warn(`Could not link commit to ${ticketId}`);
      return ticketId;
    }

    const currentStatus = issue.fields.status.name;
    if (
      currentStatus.toLowerCase() === "to do" ||
      currentStatus.toLowerCase() === "open" ||
      currentStatus.toLowerCase() === "backlog"
    ) {
      spinner.text = `Transitioning ${ticketId} to In Progress...`;
      const transitioned = await jiraManager.transitionOnCommit(ticketId);

      if (transitioned) {
        spinner.succeed(
          chalk.green(
            `✓ Jira ticket ${ticketId} updated and moved to In Progress`
          )
        );
      } else {
        spinner.succeed(chalk.green(`✓ Commit linked to ${ticketId}`));
      }
    } else {
      spinner.succeed(chalk.green(`✓ Commit linked to ${ticketId}`));
    }

    return ticketId;
  } catch (error) {
    console.log(chalk.yellow("\n⚠ Warning: Jira integration failed"));
    if (error instanceof Error) {
      console.log(chalk.gray(`  ${error.message}`));
    }
    console.log(chalk.gray("Continuing without Jira..."));
    return null;
  }
}

async function handleBranchCreation(
  gitAnalyzer: GitAnalyzer,
  files: string[],
  diff: string
): Promise<void> {
  const isOnMainBranch = await gitAnalyzer.isMainBranch();
  const currentBranch = await gitAnalyzer.getCurrentBranch();

  if (!isOnMainBranch) {
    return;
  }

  console.log(
    chalk.yellow(
      `\n⚠️  You are on the '${currentBranch}' branch.\nIt's recommended to create a feature branch for your changes.\n`
    )
  );

  const branchSuggester = new BranchSuggester();
  const suggestions = branchSuggester.generateMultipleSuggestions(files, diff);

  console.log(chalk.cyan("Suggested branch names:"));
  suggestions.forEach((suggestion, i) => {
    console.log(chalk.gray(`  ${i + 1}) ${suggestion}`));
  });
  console.log(chalk.gray(`  ${suggestions.length + 1}) Enter custom name`));
  console.log(
    chalk.gray(`  ${suggestions.length + 2}) Stay on ${currentBranch}`)
  );

  const { branchChoice } = await inquirer.prompt([
    {
      type: "input",
      name: "branchChoice",
      message: `Your choice (1-${suggestions.length + 2}):`,
      validate: (input: string) => {
        const num = parseInt(input.trim());
        if (isNaN(num) || num < 1 || num > suggestions.length + 2) {
          return `Please enter a number between 1 and ${
            suggestions.length + 2
          }`;
        }
        return true;
      },
    },
  ]);

  const choiceNum = parseInt(branchChoice.trim());

  if (choiceNum <= suggestions.length) {
    const branchName = suggestions[choiceNum - 1];
    const spinner = ora(`Creating branch '${branchName}'...`).start();

    try {
      await gitAnalyzer.createBranch(branchName);
      spinner.succeed(
        chalk.green(`✓ Created and switched to branch '${branchName}'`)
      );
    } catch (error) {
      spinner.fail("Failed to create branch");
      if (error instanceof Error) {
        console.error(chalk.red(`\n❌ Error: ${error.message}`));
      }
      throw error;
    }
  } else if (choiceNum === suggestions.length + 1) {
    const { customBranchName } = await inquirer.prompt([
      {
        type: "input",
        name: "customBranchName",
        message: "Enter branch name:",
        validate: (input: string) => {
          if (!input.trim()) {
            return "Branch name cannot be empty";
          }
          if (!/^[a-zA-Z0-9/_-]+$/.test(input.trim())) {
            return "Invalid branch name. Use only letters, numbers, /, - and _";
          }
          return true;
        },
      },
    ]);

    const spinner = ora(`Creating branch '${customBranchName}'...`).start();

    try {
      await gitAnalyzer.createBranch(customBranchName);
      spinner.succeed(
        chalk.green(`✓ Created and switched to branch '${customBranchName}'`)
      );
    } catch (error) {
      spinner.fail("Failed to create branch");
      if (error instanceof Error) {
        console.error(chalk.red(`\n❌ Error: ${error.message}`));
      }
      throw error;
    }
  } else {
    console.log(
      chalk.yellow(
        `\n⚠️  Staying on '${currentBranch}'. Be careful when committing!`
      )
    );
  }
}

async function handleCommitFlow(
  gitAnalyzer: GitAnalyzer,
  aiService: AIService,
  diff: string,
  context: string,
  skipPostActions: boolean = false
): Promise<void> {
  const aiSpinner = ora("Generating commit message...").start();
  const commitMessage = await aiService.generateCommitMessage(diff, context);
  aiSpinner.succeed();

  console.log(chalk.green("\n✨ Suggested commit message:\n"));
  console.log(chalk.white(commitMessage));
  console.log();

  console.log(chalk.cyan("\nOptions:"));
  console.log("  1) Accept and commit");
  console.log("  2) Edit message");
  console.log("  3) Regenerate");
  console.log("  4) Cancel");

  const { choice } = await inquirer.prompt([
    {
      type: "input",
      name: "choice",
      message: "Your choice (1-4):",
      validate: (input: string) => {
        if (!["1", "2", "3", "4"].includes(input.trim())) {
          return "Please enter 1, 2, 3, or 4";
        }
        return true;
      },
    },
  ]);

  const actionMap: { [key: string]: string } = {
    "1": "accept",
    "2": "edit",
    "3": "regenerate",
    "4": "cancel",
  };

  const action = actionMap[choice.trim()];

  if (action === "accept") {
    const spinner = ora("Creating commit...").start();
    await gitAnalyzer.createCommit(commitMessage);
    spinner.succeed(chalk.green("✓ Commit created successfully!"));
    console.log(chalk.gray(`\nCommit message: ${commitMessage}`));

    await handlePostCommitActions(gitAnalyzer);
  } else if (action === "edit") {
    const { editedMessage } = await inquirer.prompt([
      {
        type: "editor",
        name: "editedMessage",
        message: "Edit your commit message:",
        default: commitMessage,
      },
    ]);

    if (editedMessage.trim()) {
      const spinner = ora("Creating commit...").start();
      await gitAnalyzer.createCommit(editedMessage);
      spinner.succeed(chalk.green("✓ Commit created with edited message!"));
      console.log(chalk.gray(`\nCommit message: ${editedMessage}`));

      await handlePostCommitActions(gitAnalyzer);
    } else {
      console.log(chalk.red("✗ Empty commit message, cancelled"));
    }
  } else if (action === "regenerate") {
    console.log(chalk.yellow("\n Regenerating...\n"));
    await handleCommitFlow(
      gitAnalyzer,
      aiService,
      diff,
      context,
      skipPostActions
    );
  } else {
    console.log(chalk.red("✗ Commit cancelled"));
  }
}

async function handleMultipleCommits(
  gitAnalyzer: GitAnalyzer,
  aiService: AIService,
  groups: Array<{
    label: string;
    scope: string;
    files: string[];
    category: string;
  }>
): Promise<void> {
  console.log(
    chalk.green(`\n Creating ${groups.length} separate commits...\n`)
  );

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    console.log(chalk.blue(`\n[${i + 1}/${groups.length}] ${group.label}`));

    await gitAnalyzer.unstageAll();

    for (const file of group.files) {
      await gitAnalyzer.stageFile(file);
    }

    const groupChanges = await gitAnalyzer.getStagedChanges();

    const { hasContext } = await inquirer.prompt([
      {
        type: "confirm",
        name: "hasContext",
        message: `Add context for ${group.label}?`,
        default: false,
      },
    ]);

    let context = "";
    if (hasContext) {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "context",
          message: "What are you working on?",
          default: "",
        },
      ]);
      context = answer.context;
    }

    await handleCommitFlow(
      gitAnalyzer,
      aiService,
      groupChanges.diff,
      context,
      true
    );
  }

  console.log(
    chalk.green(`\n All ${groups.length} commits created successfully! \n`)
  );

  await handlePostCommitActions(gitAnalyzer);
}

function displayWelcome(): void {
  console.clear();
  console.log();
  console.log(chalk.magenta.bold("   ██████╗ ██╗████████╗     █████╗  ██████╗ ███████╗███╗   ██╗████████╗"));
  console.log(chalk.magenta.bold("  ██╔════╝ ██║╚══██╔══╝    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝"));
  console.log(chalk.magenta.bold("  ██║  ███╗██║   ██║       ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   "));
  console.log(chalk.magenta.bold("  ██║   ██║██║   ██║       ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   "));
  console.log(chalk.magenta.bold("  ╚██████╔╝██║   ██║       ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   "));
  console.log(chalk.magenta.bold("   ╚═════╝ ╚═╝   ╚═╝       ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   "));
  console.log();
  console.log(chalk.gray("  Assistant IA pour des commits intelligents"));
  console.log();
}

export async function commitCommand() {
  displayWelcome();

  const gitAnalyzer = new GitAnalyzer();
  const aiService = new AIService();

  const spinner = ora("Analyzing your changes...").start();

  try {
    const status = await gitAnalyzer.getStatus();
    const hasUnstagedChanges =
      status.modified.length > 0 || status.not_added.length > 0;

    let changes = await gitAnalyzer.getStagedChanges();

    if (!changes.hasChanges && hasUnstagedChanges) {
      spinner.stop();

      console.log(
        chalk.yellow("\nNo staged changes found, but you have modified files:")
      );
      [...status.modified, ...status.not_added].slice(0, 10).forEach((file) => {
        console.log(chalk.gray(`  - ${file}`));
      });

      const { stageAll } = await inquirer.prompt([
        {
          type: "confirm",
          name: "stageAll",
          message: "Do you want to stage all changes? (git add .)",
          default: true,
        },
      ]);

      if (stageAll) {
        const stageSpinner = ora("Staging all changes...").start();
        await gitAnalyzer.stageAll();
        stageSpinner.succeed("All changes staged");
        changes = await gitAnalyzer.getStagedChanges();
      } else {
        console.log(
          chalk.yellow(
            '\nPlease stage your changes with "git add" and try again.'
          )
        );
        return;
      }

      spinner.start("Analyzing your changes...");
    }

    if (!changes.hasChanges) {
      spinner.fail("No changes to commit.");
      return;
    }

    spinner.succeed("Changes analyzed");

    console.log(chalk.blue("\n Staged files:"));
    changes.files.forEach((file) => {
      console.log(chalk.gray(`  - ${file}`));
    });

    await handleBranchCreation(gitAnalyzer, changes.files, changes.diff);

    const changeAnalyzer = new ChangeAnalyzer();
    const analysis = changeAnalyzer.analyzeFiles(changes.files);

    const suggestionsEngine = new SuggestionsEngine();
    const securityAnalysis = suggestionsEngine.analyze(
      changes.files,
      changes.diff
    );

    if (securityAnalysis.hasHighSeverity) {
      console.log(chalk.red.bold("\n SECURITY ALERT!\n"));

      securityAnalysis.secrets.forEach((secret) => {
        if (secret.severity === "high") {
          console.log(chalk.red(`  ${secret.message}`));
          console.log(chalk.gray(`     File: ${secret.file}`));
          console.log(chalk.yellow(`     ${secret.suggestion}\n`));
        }
      });

      console.log(
        chalk.red(
          "These files contain sensitive information that should NOT be committed!\n"
        )
      );

      console.log("Options:");
      console.log("  1) Remove sensitive files from commit (recommended)");
      console.log("  2) Continue anyway (NOT recommended)");
      console.log("  3) Cancel");

      const { securityChoice } = await inquirer.prompt([
        {
          type: "input",
          name: "securityChoice",
          message: "Your choice (1-3):",
          validate: (input: string) => {
            if (!["1", "2", "3"].includes(input.trim())) {
              return "Please enter 1, 2, or 3";
            }
            return true;
          },
        },
      ]);

      if (securityChoice.trim() === "1") {
        const sensitiveFiles = securityAnalysis.secrets
          .filter((s) => s.severity === "high" && s.type === "sensitive_file")
          .map((s) => s.file);

        for (const file of sensitiveFiles) {
          await gitAnalyzer.unstageFile(file);
          console.log(chalk.yellow(`  Removed: ${file}`));
        }

        changes = await gitAnalyzer.getStagedChanges();

        if (!changes.hasChanges) {
          console.log(
            chalk.yellow(
              "\nNo changes left to commit after removing sensitive files."
            )
          );
          return;
        }

        console.log(chalk.green("\n Sensitive files removed. Continuing...\n"));
      } else if (securityChoice.trim() === "3") {
        console.log(chalk.red("✗ Commit cancelled"));
        return;
      } else {
        console.log(
          chalk.yellow("\n WARNING: Proceeding with sensitive files...\n")
        );
      }
    }

    if (securityAnalysis.todos.length > 0) {
      console.log(chalk.cyan("\n TODOs/FIXMEs added:\n"));
      securityAnalysis.todos.slice(0, 5).forEach((todo) => {
        console.log(chalk.gray(`  [${todo.type}] ${todo.message}`));
        console.log(chalk.gray(`     ${todo.file}\n`));
      });

      if (securityAnalysis.todos.length > 5) {
        console.log(
          chalk.gray(`  ... and ${securityAnalysis.todos.length - 5} more\n`)
        );
      }
    }

    if (analysis.suggestions.length > 0) {
      console.log(chalk.yellow("\n Code Quality Suggestions:"));
      analysis.suggestions.forEach((suggestion) => {
        console.log(chalk.gray(`  - ${suggestion}`));
      });
    }

    if (analysis.hasMultipleScopes && analysis.groups.length > 1) {
      console.log(chalk.cyan("\n I detected changes in multiple areas:\n"));

      analysis.groups.forEach((group, index) => {
        console.log(
          chalk.blue(
            `${index + 1}. ${group.label} (${group.files.length} file${
              group.files.length > 1 ? "s" : ""
            })`
          )
        );
        group.files.forEach((file) => {
          console.log(chalk.gray(`   - ${file}`));
        });
        console.log();
      });

      console.log(
        chalk.yellow("Recommendation: These changes touch different areas.")
      );
      console.log(
        chalk.yellow("It would be better to create separate commits.\n")
      );

      console.log("Options:");
      console.log(
        `  1) Create ${analysis.groups.length} separate commits (recommended)`
      );
      console.log("  2) Create 1 single commit for everything");

      const { splitChoice } = await inquirer.prompt([
        {
          type: "input",
          name: "splitChoice",
          message: "Your choice (1-2):",
          validate: (input: string) => {
            if (!["1", "2"].includes(input.trim())) {
              return "Please enter 1 or 2";
            }
            return true;
          },
        },
      ]);

      if (splitChoice.trim() === "1") {
        await handleMultipleCommits(gitAnalyzer, aiService, analysis.groups);
        return;
      }
    }

    const { hasContext } = await inquirer.prompt([
      {
        type: "confirm",
        name: "hasContext",
        message: "Do you want to add context about these changes?",
        default: false,
      },
    ]);

    let context = "";
    if (hasContext) {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "context",
          message: "What are you working on?",
          default: "",
        },
      ]);
      context = answer.context;
    }

    await handleCommitFlow(gitAnalyzer, aiService, changes.diff, context);
  } catch (error) {
    spinner.fail("An error occurred");
    if (error instanceof Error) {
      console.error(chalk.red(`\n Error: ${error.message}`));
    } else {
      console.error(chalk.red("\n An unknown error occurred"));
    }
    process.exit(1);
  }
}
