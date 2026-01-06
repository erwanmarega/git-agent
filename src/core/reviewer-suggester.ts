import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface ReviewerSuggestion {
  username: string;
  email: string;
  score: number;
  commits: number;
  lastCommitDate?: string;
}

export class ReviewerSuggester {
  async suggestReviewers(files: string[]): Promise<ReviewerSuggestion[]> {
    if (files.length === 0) {
      return [];
    }

    const contributors = new Map<
      string,
      { commits: number; lastDate: string; email: string }
    >();

    for (const file of files) {
      try {
        const { stdout } = await execAsync(
          `git log --follow --pretty=format:"%an|%ae|%ad" --date=short -- "${file}" | head -n 50`
        );

        const lines = stdout.trim().split("\n").filter(Boolean);

        for (const line of lines) {
          const [name, email, date] = line.split("|");

          if (!name || !email) continue;

          const key = email.toLowerCase();

          if (!contributors.has(key)) {
            contributors.set(key, {
              commits: 0,
              lastDate: date,
              email: email,
            });
          }

          const contributor = contributors.get(key)!;
          contributor.commits++;

          if (date > contributor.lastDate) {
            contributor.lastDate = date;
          }
        }
      } catch (error) {
        continue;
      }
    }

    const currentUser = await this.getCurrentUser();

    const suggestions: ReviewerSuggestion[] = [];

    for (const [email, data] of contributors) {
      if (email.toLowerCase() === currentUser.email.toLowerCase()) {
        continue;
      }

      const recencyBonus = this.calculateRecencyBonus(data.lastDate);
      const score = data.commits * 10 + recencyBonus;

      const username = email.split("@")[0];

      suggestions.push({
        username,
        email: email,
        score,
        commits: data.commits,
        lastCommitDate: data.lastDate,
      });
    }

    suggestions.sort((a, b) => b.score - a.score);

    return suggestions.slice(0, 5);
  }

  private calculateRecencyBonus(dateStr: string): number {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff < 7) return 50;
      if (daysDiff < 30) return 30;
      if (daysDiff < 90) return 10;
      return 0;
    } catch {
      return 0;
    }
  }

  async getCurrentUser(): Promise<{ name: string; email: string }> {
    try {
      const { stdout: name } = await execAsync("git config user.name");
      const { stdout: email } = await execAsync("git config user.email");

      return {
        name: name.trim(),
        email: email.trim(),
      };
    } catch {
      return { name: "", email: "" };
    }
  }

  async getGitHubUsername(email: string): Promise<string | null> {
    try {
      const { stdout } = await execAsync(
        `gh api search/users?q=${encodeURIComponent(
          email
        )} --jq '.items[0].login'`
      );
      return stdout.trim() || null;
    } catch {
      return null;
    }
  }

  async suggestReviewersWithGitHub(
    files: string[]
  ): Promise<ReviewerSuggestion[]> {
    const suggestions = await this.suggestReviewers(files);

    for (const suggestion of suggestions) {
      const ghUsername = await this.getGitHubUsername(suggestion.email);
      if (ghUsername) {
        suggestion.username = ghUsername;
      }
    }

    return suggestions;
  }

  formatSuggestions(suggestions: ReviewerSuggestion[]): string[] {
    return suggestions.map((s, i) => {
      let line = `${i + 1}. ${s.username}`;
      if (s.commits > 0) {
        line += ` (${s.commits} commit${s.commits > 1 ? "s" : ""})`;
      }
      if (s.lastCommitDate) {
        line += ` - last: ${s.lastCommitDate}`;
      }
      return line;
    });
  }
}
