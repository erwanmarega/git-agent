import inquirer from "inquirer";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

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

  const envContent = `# Anthropic API Key (required for AI features)
# Get your key at: https://console.anthropic.com/
ANTHROPIC_API_KEY=${apiKey}

# Model to use
ANTHROPIC_MODEL=${model}
`;

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
