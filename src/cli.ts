#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import { commitCommand } from "./cli/commit";
import { initCommand } from "./cli/init";
import { learnCommand } from "./cli/learn";

const program = new Command();

program
  .name("git-agent")
  .description("AI-powered Git assistant")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize Git Agent configuration")
  .action(initCommand);

program
  .command("commit")
  .description("Interactive commit with AI assistance")
  .action(commitCommand);

program
  .command("learn")
  .description("Learn commit style from repository history")
  .option("-c, --commits <number>", "Number of commits to analyze", "100")
  .option("-a, --author <email>", "Analyze commits from specific author")
  .option("-r, --reset", "Reset learned style")
  .action((options) => {
    learnCommand({
      commits: parseInt(options.commits),
      author: options.author,
      reset: options.reset
    });
  });

program.parse();
