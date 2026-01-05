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

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [
        { name: "✓ Accept and commit", value: "accept" },
        { name: "✎ Edit message", value: "edit" },
        { name: "↻ Regenerate", value: "regenerate" },
        { name: "✗ Cancel", value: "cancel" },
      ],
    },
  ]);

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
    const changes = await gitAnalyzer.getStagedChanges();

    if (!changes.hasChanges) {
      spinner.fail("No staged changes found.");
      console.log(
        chalk.yellow('\nTip: Use "git add" to stage your changes first.')
      );
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
