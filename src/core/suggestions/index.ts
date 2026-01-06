import { SecretsDetector, SecretDetection } from "./secrets-detector";
import { TodosDetector, TodoDetection } from "./todos-detector";

export interface SuggestionResult {
  secrets: SecretDetection[];
  todos: TodoDetection[];
  hasHighSeverity: boolean;
  hasMediumSeverity: boolean;
  totalIssues: number;
}

export class SuggestionsEngine {
  private secretsDetector: SecretsDetector;
  private todosDetector: TodosDetector;

  constructor() {
    this.secretsDetector = new SecretsDetector();
    this.todosDetector = new TodosDetector();
  }

  analyze(files: string[], diff: string): SuggestionResult {
    const secrets = this.secretsDetector.detect(files, diff);
    const todos = this.todosDetector.detect(diff);

    const hasHighSeverity = secrets.some(s => s.severity === "high");
    const hasMediumSeverity = secrets.some(s => s.severity === "medium");
    const totalIssues = secrets.length + todos.length;

    return {
      secrets,
      todos,
      hasHighSeverity,
      hasMediumSeverity,
      totalIssues,
    };
  }


  getSummary(result: SuggestionResult): string[] {
    const summary: string[] = [];

    if (result.secrets.length > 0) {
      const secretsSummary = this.secretsDetector.getSummary(result.secrets);
      if (secretsSummary.high > 0) {
        summary.push(`${secretsSummary.high} high-severity security issue(s) detected`);
      }
      if (secretsSummary.medium > 0) {
        summary.push(`${secretsSummary.medium} medium-severity security issue(s) detected`);
      }
    }

    if (result.todos.length > 0) {
      const counts = this.todosDetector.countByType(result.todos);
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      summary.push(`${total} TODO/FIXME comment(s) added`);
    }

    return summary;
  }
}

export { SecretsDetector, SecretDetection } from "./secrets-detector";
export { TodosDetector, TodoDetection } from "./todos-detector";
