import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface PRInfo {
  title: string;
  body: string;
  url?: string;
}

export class PRManager {
  async isGitHubCLIInstalled(): Promise<boolean> {
    try {
      await execAsync("gh --version");
      return true;
    } catch {
      return false;
    }
  }

  async isGitHubRepo(): Promise<boolean> {
    try {
      const { stdout } = await execAsync("gh repo view --json url");
      return !!stdout;
    } catch {
      return false;
    }
  }

  async getRecentCommits(limit: number = 10): Promise<string[]> {
    try {
      const { stdout } = await execAsync(`git log --format=%s -n ${limit}`);
      return stdout.trim().split("\n").filter(Boolean);
    } catch {
      return [];
    }
  }

  async getCommitsSinceMain(): Promise<string[]> {
    try {
      let { stdout } = await execAsync(
        "git log main..HEAD --format=%s 2>/dev/null || git log master..HEAD --format=%s"
      );
      return stdout.trim().split("\n").filter(Boolean);
    } catch {
      return [];
    }
  }

  generatePRTitle(commits: string[]): string {
    if (commits.length === 0) {
      return "Feature update";
    }

    if (commits.length === 1) {
      return commits[0];
    }

    const types = commits.map((commit) => {
      const match = commit.match(
        /^(feat|fix|docs|refactor|test|chore|style):/i
      );
      return match ? match[1].toLowerCase() : "feat";
    });

    const typeCount: Record<string, number> = {};
    types.forEach((type) => {
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const dominantType = Object.entries(typeCount).sort(
      ([, a], [, b]) => b - a
    )[0][0];

    return `${dominantType}: Multiple updates (${commits.length} commits)`;
  }

  generatePRBody(commits: string[]): string {
    let body = "## Changes\n\n";

    if (commits.length === 0) {
      body += "No commit messages available.\n";
    } else if (commits.length === 1) {
      body += `${commits[0]}\n`;
    } else {
      commits.forEach((commit) => {
        body += `- ${commit}\n`;
      });
    }

    body += "\n## Checklist\n\n";
    body += "- [ ] Code reviewed\n";
    body += "- [ ] Tests passing\n";
    body += "- [ ] Documentation updated\n";

    return body;
  }

  async createPR(
    title: string,
    body: string,
    baseBranch: string = "main",
    reviewers: string[] = []
  ): Promise<string> {
    try {
      const escapedTitle = title.replace(/"/g, '\\"');
      const escapedBody = body.replace(/"/g, '\\"');

      let command = `gh pr create --title "${escapedTitle}" --body "${escapedBody}" --base ${baseBranch}`;

      if (reviewers.length > 0) {
        const reviewersList = reviewers.join(",");
        command += ` --reviewer ${reviewersList}`;
      }

      const { stdout } = await execAsync(command);

      const urlMatch = stdout.match(/https:\/\/github\.com\/[^\s]+/);
      return urlMatch ? urlMatch[0] : stdout.trim();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create PR: ${error.message}`);
      }
      throw error;
    }
  }

  async getMainBranchName(): Promise<string> {
    try {
      const { stdout } = await execAsync(
        "git remote show origin | grep 'HEAD branch' | cut -d' ' -f5"
      );
      return stdout.trim() || "main";
    } catch {
      try {
        await execAsync("git show-ref --verify refs/heads/main");
        return "main";
      } catch {
        return "master";
      }
    }
  }

  async getFileChanges(): Promise<{ additions: number; deletions: number }> {
    try {
      const { stdout } = await execAsync(
        "git diff main...HEAD --shortstat 2>/dev/null || git diff master...HEAD --shortstat"
      );

      const addMatch = stdout.match(/(\d+) insertion/);
      const delMatch = stdout.match(/(\d+) deletion/);

      return {
        additions: addMatch ? parseInt(addMatch[1]) : 0,
        deletions: delMatch ? parseInt(delMatch[1]) : 0,
      };
    } catch {
      return { additions: 0, deletions: 0 };
    }
  }
}
