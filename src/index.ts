/**
 * Git Agent - AI-powered Git assistant
 * @packageDocumentation
 */

export { AIService } from "./core/ai-service";
export { GitAnalyzer } from "./core/git-analyzer";
export {
  ChangeAnalyzer,
  FileGroup,
  AnalysisResult,
} from "./core/change-analyzer";
export { BranchSuggester } from "./core/branch-suggester";
export { PRManager, PRInfo } from "./core/pr-manager";
export {
  ReviewerSuggester,
  ReviewerSuggestion,
} from "./core/reviewer-suggester";
export {
  JiraManager,
  JiraConfig,
  JiraIssue,
  JiraTransition,
  JiraLinkCommitParams,
  JiraLinkPRParams,
  TicketExtractionResult,
} from "./core/jira-manager";

export {
  SuggestionsEngine,
  SuggestionResult,
  SecretsDetector,
  SecretDetection,
  TodosDetector,
  TodoDetection,
} from "./core/suggestions";

export { commitCommand } from "./cli/commit";
export { initCommand } from "./cli/init";
export { learnCommand, LearnedStyle } from "./cli/learn";

export const VERSION = "1.0.0";
