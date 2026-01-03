import simpleGit, { SimpleGit, StatusResult } from "simple-git";

export class GitAnalyzer {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
  }

  async getStagedChanges() {
    const status = await this.git.status();
    const diff = await this.git.diff(["--staged"]);

    return {
      files: status.staged,
      diff,
      hasChanges: status.staged.length > 0,
    };
  }

  async getStatus(): Promise<StatusResult> {
    return this.git.status();
  }
}
