import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { GitAnalyzer } from "../core/git-analyzer";
import { AIService } from "../core/ai-service";

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

export async function commitCommand() {
  console.log(chalk.blue.bold("\n Git Agent - Interactive Commit\n"));

  const gitAnalyzer = new GitAnalyzer();
  const aiService = new AIService();

  const spinner = ora("Analyzing your changes...").start();

  try {
    // Check for unstaged changes
    const status = await gitAnalyzer.getStatus();
    const hasUnstagedChanges = status.modified.length > 0 || status.not_added.length > 0;

    let changes = await gitAnalyzer.getStagedChanges();

    // If no staged changes but there are unstaged changes, ask to stage them
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
