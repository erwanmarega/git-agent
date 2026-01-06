export class BranchSuggester {
  suggestBranchName(files: string[], diff?: string): string {
    const type = this.detectChangeType(files, diff);
    const scope = this.detectScope(files);

    const description = this.generateDescription(files, type);

    return `${type}/${scope ? scope + "-" : ""}${description}`;
  }

  private detectChangeType(files: string[], diff?: string): string {
    const hasTests = files.some(
      (f) =>
        f.includes(".test.") || f.includes(".spec.") || f.includes("__tests__")
    );

    const hasDocs = files.some(
      (f) => f.endsWith(".md") || f.includes("/docs/")
    );

    const hasConfig = files.some(
      (f) =>
        f.match(/\.(config|rc)\.(js|ts|json)$/) ||
        f === "package.json" ||
        f === "tsconfig.json"
    );

    if (diff) {
      if (diff.match(/\b(fix|bug|issue|error)\b/i)) {
        return "fix";
      }
      if (diff.match(/\b(feat|feature|add|implement|new)\b/i)) {
        return "feat";
      }
      if (diff.match(/\b(refactor|restructure|reorganize)\b/i)) {
        return "refactor";
      }
    }

    if (hasDocs) return "docs";
    if (hasConfig) return "chore";
    if (
      hasTests &&
      files.length ===
        files.filter((f) => f.includes(".test.") || f.includes(".spec.")).length
    ) {
      return "test";
    }

    return "feat";
  }

  private detectScope(files: string[]): string | null {
    if (files.length === 0) return null;

    const patterns = [
      { regex: /src\/api\/([^\/]+)/, name: "api" },
      { regex: /src\/components\/([^\/]+)/, name: "components" },
      { regex: /src\/services\/([^\/]+)/, name: "services" },
      { regex: /src\/core\/([^\/]+)/, name: "core" },
      { regex: /src\/cli\/([^\/]+)/, name: "cli" },
      { regex: /src\/utils\/([^\/]+)/, name: "utils" },
    ];

    for (const pattern of patterns) {
      const matches = files.filter((f) => pattern.regex.test(f));
      if (matches.length > 0) {
        return pattern.name;
      }
    }

    return null;
  }

  private generateDescription(files: string[], type: string): string {
    const keywords: string[] = [];

    for (const file of files) {
      const baseName = file
        .split("/")
        .pop()
        ?.replace(/\.(ts|js|tsx|jsx|md)$/, "");
      if (baseName) {
        keywords.push(baseName);
      }
    }

    if (keywords.length > 0) {
      return this.kebabCase(keywords[0]);
    }

    const fallbacks: Record<string, string> = {
      feat: "new-feature",
      fix: "bug-fix",
      docs: "update-docs",
      refactor: "refactoring",
      test: "add-tests",
      chore: "update-config",
    };

    return fallbacks[type] || "changes";
  }

  private kebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
  }

  generateMultipleSuggestions(files: string[], diff?: string): string[] {
    const suggestions: string[] = [];
    const type = this.detectChangeType(files, diff);
    const scope = this.detectScope(files);

    const mainSuggestion = this.suggestBranchName(files, diff);
    suggestions.push(mainSuggestion);

    if (scope) {
      const description = this.generateDescription(files, type);
      suggestions.push(`${type}/${description}`);
    }

    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    suggestions.push(`${type}/${scope ? scope + "-" : ""}${date.slice(2)}`);

    return suggestions;
  }
}
