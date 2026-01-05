import Anthropic from "@anthropic-ai/sdk";

export class AIService {
  private client: Anthropic;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || "";

    if (!this.apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is required. Set it in your .env file or pass it to the constructor."
      );
    }

    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  async generateCommitMessage(diff: string, context?: string): Promise<string> {
    if (!diff || diff.trim().length === 0) {
      throw new Error("No changes to generate commit message from");
    }

    try {
      const message = await this.client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are a Git commit message expert. Generate a concise, conventional commit message for these changes.

Changes:
${diff}

${context ? `Context: ${context}` : ""}

Format: <type>(<scope>): <description>
Types: feat, fix, docs, style, refactor, test, chore

Return ONLY the commit message, nothing else.`,
          },
        ],
      });

      const commitMessage =
        message.content[0].type === "text"
          ? message.content[0].text.trim()
          : "";

      if (!commitMessage) {
        throw new Error("AI service returned an empty commit message");
      }

      return commitMessage;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          throw new Error("Invalid API key. Please check your ANTHROPIC_API_KEY.");
        } else if (error.message.includes("429")) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else if (error.message.includes("network") || error.message.includes("ENOTFOUND")) {
          throw new Error("Network error. Please check your internet connection.");
        }
        throw error;
      }
      throw new Error("An unexpected error occurred while generating commit message");
    }
  }
}
