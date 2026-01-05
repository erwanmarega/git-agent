import { Command } from "commander";
import { commitCommand } from "./cli/commit";
import { initCommand } from "./cli/init";

const program = new Command();

program
  .name("git-agent")
  .description("AI-powered Git assistant")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize Git Agent configuration")
  .action(initCommand);

program
  .command("commit")
  .description("Interactive commit with AI assistance")
  .action(commitCommand);

program.parse();
