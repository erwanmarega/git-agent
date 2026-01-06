export interface FileGroup {
  label: string; // "Backend", "Frontend", "Documentation"
  scope: string; // "api", "components", "docs"
  files: string[]; // Liste des fichiers dans ce groupe
  category: string; // "code", "tests", "docs", "config"
}

export interface AnalysisResult {
  groups: FileGroup[];
  hasMultipleScopes: boolean;
  totalFiles: number;
  suggestions: string[];
}

export class ChangeAnalyzer {
  analyzeFiles(files: string[]): AnalysisResult {
    const groups = this.groupFiles(files);
    const suggestions: string[] = [];

    const hasTests = files.some((f) => this.isTestFile(f));
    const hasCode = files.some(
      (f) => this.isCodeFile(f) && !this.isTestFile(f)
    );
    const hasDocs = files.some((f) => this.isDocFile(f));

    if (hasCode && !hasTests) {
      suggestions.push("No tests detected for code changes");
    }

    if (hasCode && !hasDocs) {
      suggestions.push("No documentation updates detected");
    }

    return {
      groups,
      hasMultipleScopes: groups.length > 1,
      totalFiles: files.length,
      suggestions,
    };
  }

  private groupFiles(files: string[]): FileGroup[] {
    const groupMap = new Map<string, FileGroup>();

    for (const file of files) {
      const group = this.categorizeFile(file);
      const key = `${group.scope}-${group.category}`;

      if (!groupMap.has(key)) {
        groupMap.set(key, {
          label: group.label,
          scope: group.scope,
          files: [],
          category: group.category,
        });
      }

      groupMap.get(key)!.files.push(file);
    }

    return Array.from(groupMap.values());
  }

  private categorizeFile(
    file: string
  ): Pick<FileGroup, "label" | "scope" | "category"> {
    if (this.isTestFile(file)) {
      return {
        label: "Tests",
        scope: this.extractScope(file),
        category: "tests",
      };
    }

    if (this.isDocFile(file)) {
      return {
        label: "Documentation",
        scope: "docs",
        category: "docs",
      };
    }

    if (this.isConfigFile(file)) {
      return {
        label: "Configuration",
        scope: "config",
        category: "config",
      };
    }

    const scope = this.extractScope(file);
    const label = this.scopeToLabel(scope);

    return {
      label,
      scope,
      category: "code",
    };
  }

  private extractScope(file: string): string {
    const parts = file.split("/");

    if (parts.includes("src") || parts.includes("lib")) {
      const srcIndex = parts.findIndex((p) => p === "src" || p === "lib");
      if (parts[srcIndex + 1]) {
        return parts[srcIndex + 1];
      }
    }

    if (parts.length > 1) {
      return parts[0];
    }

    return "root";
  }

  private scopeToLabel(scope: string): string {
    const labelMap: { [key: string]: string } = {
      api: "Backend API",
      components: "Frontend Components",
      pages: "Frontend Pages",
      views: "Frontend Views",
      utils: "Utilities",
      core: "Core",
      services: "Services",
      models: "Models",
      cli: "CLI",
      docs: "Documentation",
      tests: "Tests",
      root: "Root",
    };

    return labelMap[scope] || scope.charAt(0).toUpperCase() + scope.slice(1);
  }

  private isTestFile(file: string): boolean {
    return (
      file.includes(".test.") ||
      file.includes(".spec.") ||
      file.includes("__tests__") ||
      file.includes("/tests/") ||
      file.endsWith(".test.ts") ||
      file.endsWith(".spec.ts")
    );
  }

  private isCodeFile(file: string): boolean {
    const codeExtensions = [
      ".ts",
      ".js",
      ".tsx",
      ".jsx",
      ".vue",
      ".py",
      ".java",
      ".go",
    ];
    return codeExtensions.some((ext) => file.endsWith(ext));
  }

  private isDocFile(file: string): boolean {
    return (
      file.endsWith(".md") ||
      file.endsWith(".mdx") ||
      file.includes("/docs/") ||
      file.includes("/documentation/") ||
      file === "README.md"
    );
  }

  private isConfigFile(file: string): boolean {
    const configFiles = [
      "package.json",
      "tsconfig.json",
      ".gitignore",
      ".env",
      ".env.example",
      "Dockerfile",
      "docker-compose.yml",
    ];

    return (
      configFiles.some((cf) => file.endsWith(cf)) ||
      file.startsWith(".") ||
      file.includes("config")
    );
  }
}
