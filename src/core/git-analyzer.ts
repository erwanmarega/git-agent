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

  async createCommit(message: string): Promise<void> {
    await this.git.commit(message);
  }

  async stageAll(): Promise<void> {
    await this.git.add(".");
  }

  async stageFile(file: string): Promise<void> {
    await this.git.add(file);
  }

  async unstageAll(): Promise<void> {
    await this.git.reset(["HEAD"]);
  }

  async unstageFile(file: string): Promise<void> {
    await this.git.reset(["HEAD", "--", file]);
  }

  async getCurrentBranch(): Promise<string> {
    const status = await this.git.status();
    return status.current || "main";
  }

  async hasRemote(): Promise<boolean> {
    const remotes = await this.git.getRemotes();
    return remotes.length > 0;
  }

  async getBranchRemote(branch: string): Promise<string | null> {
    try {
      const remote = await this.git.raw(["config", `branch.${branch}.remote`]);
      return remote.trim() || null;
    } catch {
      return null;
    }
  }

  async push(branch: string, setUpstream: boolean = false): Promise<void> {
    if (setUpstream) {
      await this.git.push(["-u", "origin", branch]);
    } else {
      await this.git.push();
    }
  }

  async isMainBranch(): Promise<boolean> {
    const currentBranch = await this.getCurrentBranch();
    return ["main", "master", "develop"].includes(currentBranch);
  }

  async createBranch(branchName: string): Promise<void> {
    await this.git.checkoutLocalBranch(branchName);
  }

  async getAllBranches(): Promise<string[]> {
    const branches = await this.git.branchLocal();
    return branches.all;
  }
}
