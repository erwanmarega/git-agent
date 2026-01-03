import Anthropic from "@anthropic-ai/sdk";

export class AIService {
  private client: Anthropic;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateCommitMessage(diff: string, context?: string): Promise<string> {
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

    return message.content[0].type === "text"
      ? message.content[0].text.trim()
      : "";
  }
}
