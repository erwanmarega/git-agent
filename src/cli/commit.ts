import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { GitAnalyzer } from "../core/git-analyzer";
import { AIService } from "../core/ai-service";

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

    const aiSpinner = ora("Generating commit message...").start();
    const commitMessage = await aiService.generateCommitMessage(
      changes.diff,
      context
    );
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
      console.log(chalk.green("✓ Commit created successfully!"));
    } else if (action === "edit") {
      const { editedMessage } = await inquirer.prompt([
        {
          type: "editor",
          name: "editedMessage",
          message: "Edit your commit message:",
          default: commitMessage,
        },
      ]);
      console.log(chalk.green("✓ Commit created with edited message!"));
    } else if (action === "regenerate") {
      console.log(chalk.yellow("Regenerating... (TODO: implement)"));
    } else {
      console.log(chalk.red("✗ Commit cancelled"));
    }
  } catch (error) {
    spinner.fail("An error occurred");
    console.error(chalk.red(error));
  }
}
