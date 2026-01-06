import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { GitAnalyzer } from "../core/git-analyzer";
import { AIService } from "../core/ai-service";
import { ChangeAnalyzer } from "../core/change-analyzer";

async function handleCommitFlow(
  gitAnalyzer: GitAnalyzer,
  aiService: AIService,
  diff: string,
  context: string
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
    } else {
      console.log(chalk.red("✗ Empty commit message, cancelled"));
    }
  } else if (action === "regenerate") {
    console.log(chalk.yellow("\n Regenerating...\n"));
    await handleCommitFlow(gitAnalyzer, aiService, diff, context);
  } else {
    console.log(chalk.red("✗ Commit cancelled"));
  }
}

async function handleMultipleCommits(
  gitAnalyzer: GitAnalyzer,
  aiService: AIService,
  groups: Array<{ label: string; scope: string; files: string[]; category: string }>
): Promise<void> {
  console.log(chalk.green(`\n Creating ${groups.length} separate commits...\n`));

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    console.log(chalk.blue(`\n[${i + 1}/${groups.length}] ${group.label}`));

    // Unstage tout
    await gitAnalyzer.unstageAll();

    // Stage uniquement les fichiers de ce groupe
    for (const file of group.files) {
      await gitAnalyzer.stageFile(file);
    }

    // Récupérer le diff de ce groupe
    const groupChanges = await gitAnalyzer.getStagedChanges();

    // Demander du contexte optionnel
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

    // Générer et créer le commit
    await handleCommitFlow(gitAnalyzer, aiService, groupChanges.diff, context);
  }

  console.log(chalk.green(`\n All ${groups.length} commits created successfully! \n`));
}

export async function commitCommand() {
  console.log(chalk.blue.bold("\n Git Agent - Interactive Commit\n"));

  const gitAnalyzer = new GitAnalyzer();
  const aiService = new AIService();

  const spinner = ora("Analyzing your changes...").start();

  try {
    const status = await gitAnalyzer.getStatus();
    const hasUnstagedChanges = status.modified.length > 0 || status.not_added.length > 0;

    let changes = await gitAnalyzer.getStagedChanges();

    if (!changes.hasChanges && hasUnstagedChanges) {
      spinner.stop();

      console.log(chalk.yellow("\nNo staged changes found, but you have modified files:"));
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
        console.log(chalk.yellow('\nPlease stage your changes with "git add" and try again.'));
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

    // Analyse intelligente des changements
    const changeAnalyzer = new ChangeAnalyzer();
    const analysis = changeAnalyzer.analyzeFiles(changes.files);

    // Afficher les suggestions si présentes
    if (analysis.suggestions.length > 0) {
      console.log(chalk.yellow("\n Suggestions:"));
      analysis.suggestions.forEach((suggestion) => {
        console.log(chalk.gray(`  - ${suggestion}`));
      });
    }

    // Si multiple scopes détectés, proposer le split
    if (analysis.hasMultipleScopes && analysis.groups.length > 1) {
      console.log(chalk.cyan("\n I detected changes in multiple areas:\n"));

      analysis.groups.forEach((group, index) => {
        console.log(chalk.blue(`${index + 1}. ${group.label} (${group.files.length} file${group.files.length > 1 ? 's' : ''})`));
        group.files.forEach((file) => {
          console.log(chalk.gray(`   - ${file}`));
        });
        console.log();
      });

      console.log(chalk.yellow("Recommendation: These changes touch different areas."));
      console.log(chalk.yellow("It would be better to create separate commits.\n"));

      console.log("Options:");
      console.log(`  1) Create ${analysis.groups.length} separate commits (recommended)`);
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
        // Créer des commits séparés
        await handleMultipleCommits(gitAnalyzer, aiService, analysis.groups);
        return;
      }
      // Sinon continuer avec un seul commit
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
