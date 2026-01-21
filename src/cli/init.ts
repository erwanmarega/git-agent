import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import * as fs from "fs";
import * as path from "path";
import { JiraManager } from "../core/jira-manager";

export async function initCommand() {
  console.log(chalk.blue.bold("\n Git Agent - Setup\n"));

  const envPath = path.join(process.cwd(), ".env");
  const envExists = fs.existsSync(envPath);

  if (envExists) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: ".env file already exists. Do you want to reconfigure?",
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow("\n Configuration cancelled"));
      return;
    }
  }

  console.log(chalk.gray("\nLet's configure Git Agent for your project.\n"));

  const { apiKey } = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Enter your Anthropic API key:",
      validate: (input: string) => {
        if (!input || input.trim().length === 0) {
          return "API key is required";
        }
        if (!input.startsWith("sk-ant-")) {
          return "Invalid API key format. Should start with 'sk-ant-'";
        }
        return true;
      },
    },
  ]);

  const { model } = await inquirer.prompt([
    {
      type: "list",
      name: "model",
      message: "Which model do you want to use?",
      choices: [
        {
          name: "Claude Sonnet 4 (Recommended - Best balance)",
          value: "claude-sonnet-4-20250514",
        },
        {
          name: "Claude Opus 4.5 (Most powerful, slower)",
          value: "claude-opus-4-5-20251101",
        },
        {
          name: "Claude Haiku (Faster, more economical)",
          value: "claude-3-5-haiku-20241022",
        },
      ],
      default: "claude-sonnet-4-20250514",
    },
  ]);

  console.log(chalk.gray("\n"));
  const { configureJira } = await inquirer.prompt([
    {
      type: "confirm",
      name: "configureJira",
      message: "Do you want to configure Jira integration? (optional)",
      default: false,
    },
  ]);

  let jiraConfig = "";

  if (configureJira) {
    const jiraAnswers = await inquirer.prompt([
      {
        type: "input",
        name: "baseUrl",
        message: "Jira base URL (e.g., https://yourcompany.atlassian.net):",
        validate: (input: string) => {
          if (!input.startsWith("http")) {
            return "URL must start with http:// or https://";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "email",
        message: "Jira email:",
        validate: (input: string) => {
          if (!input.includes("@")) {
            return "Please enter a valid email";
          }
          return true;
        },
      },
      {
        type: "password",
        name: "apiToken",
        message:
          "Jira API token (from https://id.atlassian.com/manage/api-tokens):",
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return "API token is required";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "projectKey",
        message: "Default Jira project key (e.g., PROJ):",
        default: "",
      },
    ]);

    const validateSpinner = ora("Validating Jira connection...").start();

    try {
      const jiraManager = new JiraManager({
        baseUrl: jiraAnswers.baseUrl,
        email: jiraAnswers.email,
        apiToken: jiraAnswers.apiToken,
        projectKey: jiraAnswers.projectKey,
      });

      const isValid = await jiraManager.validateConnection();

      if (isValid) {
        validateSpinner.succeed(chalk.green("✓ Jira connection validated"));
      } else {
        validateSpinner.fail("Jira connection failed");
        console.log(
          chalk.yellow(
            "Continuing anyway - you can fix credentials later in .env"
          )
        );
      }
    } catch (error) {
      validateSpinner.fail("Could not validate Jira connection");
      console.log(
        chalk.yellow("Continuing anyway - you can fix credentials later in .env")
      );
    }

    jiraConfig = `
# Jira Integration
JIRA_BASE_URL=${jiraAnswers.baseUrl}
JIRA_EMAIL=${jiraAnswers.email}
JIRA_API_TOKEN=${jiraAnswers.apiToken}
JIRA_PROJECT_KEY=${jiraAnswers.projectKey}
`;
  }

  const envContent = `# Anthropic API Key (required for AI features)
# Get your key at: https://console.anthropic.com/
ANTHROPIC_API_KEY=${apiKey}

# Model to use
ANTHROPIC_MODEL=${model}
${jiraConfig}`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log(chalk.green("\n ✓ Configuration saved successfully!"));
    console.log(chalk.gray(`\nConfiguration file: ${envPath}`));
    console.log(chalk.gray(`Model: ${model}\n`));

    console.log(chalk.blue("Next steps:"));
    console.log(chalk.gray("  1. Stage your changes: git add ."));
    console.log(chalk.gray("  2. Create a commit: npm run dev commit\n"));
  } catch (error) {
    console.error(
      chalk.red("\n Failed to save configuration:"),
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
  }
}
