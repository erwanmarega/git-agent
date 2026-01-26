# Git Agent

AI-powered Git assistant that transforms your commit workflow into an interactive, intelligent experience using Claude AI.

[![npm version](https://badge.fury.io/js/%40erwanmarega%2Fgit-agent.svg)](https://www.npmjs.com/package/@erwanmarega/git-agent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **AI-Powered Commit Messages**: Generate meaningful conventional commit messages using Claude AI
- **Secrets Detection**: Automatically detect API keys, passwords, tokens, and sensitive files before committing
- **TODO/FIXME Detection**: Identify incomplete code markers in your staged changes
- **Branch Suggestions**: Get intelligent branch name suggestions based on your changes
- **GitHub Integration**: Create pull requests directly from the CLI
- **Jira Integration**: Link commits to Jira tickets automatically
- **Reviewer Suggestions**: Get reviewer recommendations based on git history

## Installation

```bash
npm install -g @erwanmarega/git-agent
```

Or use it locally in your project:

```bash
npm install @erwanmarega/git-agent
```

## Quick Start

### 1. Initialize Configuration

```bash
git-agent init
```

This will guide you through setting up:
- Your Anthropic API key
- Preferred Claude model (Sonnet 4, Opus 4.5, or Haiku)
- Optional Jira integration

### 2. Make a Commit

```bash
# Stage your changes
git add .

# Use Git Agent for an intelligent commit
git-agent commit
```

Git Agent will:
1. Analyze your staged changes
2. Check for secrets and sensitive files
3. Detect TODOs and FIXMEs
4. Generate a conventional commit message
5. Let you review and customize before committing

## CLI Commands

### `git-agent init`

Interactive setup wizard to configure Git Agent.

### `git-agent commit`

Interactive commit workflow with AI assistance.

Options:
- Analyzes staged changes
- Detects security issues
- Suggests commit messages
- Supports multi-commit splitting

## Programmatic Usage

Git Agent can also be used as a library in your Node.js projects:

```typescript
import {
  AIService,
  GitAnalyzer,
  SuggestionsEngine,
  BranchSuggester,
  ChangeAnalyzer
} from '@erwanmarega/git-agent';

// Generate commit messages
const ai = new AIService(process.env.ANTHROPIC_API_KEY);
const message = await ai.generateCommitMessage(diff, context);

// Analyze git changes
const git = new GitAnalyzer();
const { files, diff, hasChanges } = await git.getStagedChanges();

// Detect secrets and TODOs
const suggestions = new SuggestionsEngine();
const result = suggestions.analyze(files, diff);

if (result.hasHighSeverity) {
  console.log('Security issues detected!');
}

// Suggest branch names
const branchSuggester = new BranchSuggester();
const branchName = branchSuggester.suggestBranchName(files, diff);

// Analyze file changes
const changeAnalyzer = new ChangeAnalyzer();
const analysis = changeAnalyzer.analyzeFiles(files);
```

## API Reference

### AIService

```typescript
class AIService {
  constructor(apiKey?: string);
  generateCommitMessage(diff: string, context?: string): Promise<string>;
}
```

### GitAnalyzer

```typescript
class GitAnalyzer {
  getStagedChanges(): Promise<{ files: string[]; diff: string; hasChanges: boolean }>;
  getStatus(): Promise<StatusResult>;
  createCommit(message: string): Promise<void>;
  getCurrentBranch(): Promise<string>;
  push(branch: string, setUpstream?: boolean): Promise<void>;
  // ... and more
}
```

### SuggestionsEngine

```typescript
class SuggestionsEngine {
  analyze(files: string[], diff: string): SuggestionResult;
  getSummary(result: SuggestionResult): string[];
}

interface SuggestionResult {
  secrets: SecretDetection[];
  todos: TodoDetection[];
  hasHighSeverity: boolean;
  hasMediumSeverity: boolean;
  totalIssues: number;
}
```

### BranchSuggester

```typescript
class BranchSuggester {
  suggestBranchName(files: string[], diff?: string): string;
  generateMultipleSuggestions(files: string[], diff?: string): string[];
}
```

### ChangeAnalyzer

```typescript
class ChangeAnalyzer {
  analyzeFiles(files: string[]): AnalysisResult;
}

interface AnalysisResult {
  groups: FileGroup[];
  hasMultipleScopes: boolean;
  totalFiles: number;
  suggestions: string[];
}
```

### PRManager

```typescript
class PRManager {
  isGitHubCLIInstalled(): Promise<boolean>;
  createPR(title: string, body: string, baseBranch?: string, reviewers?: string[]): Promise<string>;
  generatePRTitle(commits: string[]): string;
  generatePRBody(commits: string[]): string;
}
```

## Configuration

Git Agent stores its configuration in `~/.git-agent/config.json`:

```json
{
  "anthropicApiKey": "your-api-key",
  "model": "claude-sonnet-4-20250514",
  "jira": {
    "enabled": false,
    "baseUrl": "",
    "email": "",
    "apiToken": ""
  }
}
```

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key (alternative to config file)

## Requirements

- Node.js >= 18.0.0
- Git
- GitHub CLI (`gh`) for PR creation (optional)

## Security

Git Agent helps you avoid committing sensitive data by detecting:

- **Files**: `.env`, `credentials.json`, `*.pem`, `id_rsa`, etc.
- **Patterns**: API keys, tokens, passwords, connection strings
- **Severity Levels**: High (blocks commit), Medium (warning)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git-agent commit`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**erwanmarega** - [GitHub](https://github.com/erwanmarega)

---

Made with Claude AI
