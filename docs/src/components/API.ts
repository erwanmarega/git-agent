export function renderAPI(): string {
  return `
    <section class="pt-8 pb-20 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="mb-12">
          <h1 class="section-title">Référence API</h1>
          <p class="section-subtitle">
            Documentation technique des modules et classes de Git Agent pour les développeurs.
          </p>
        </div>

        <div class="card mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">Class</span>
            <h2 class="text-xl font-semibold text-white">AIService</h2>
          </div>
          <p class="text-dark-400 mb-4">
            Service d'intégration avec l'API Claude d'Anthropic pour la génération de messages de commit.
          </p>
          <p class="text-dark-500 text-sm mb-4">📁 src/core/ai-service.ts</p>

          <h3 class="text-lg font-medium text-white mb-3">Constructor</h3>
          <div class="code-wrapper relative mb-4">
            <pre class="code-block"><code class="language-typescript">constructor(apiKey?: string)</code></pre>
          </div>
          <p class="text-dark-400 text-sm mb-4">
            Initialise le service avec une clé API. Si non fournie, utilise <code class="code-inline">ANTHROPIC_API_KEY</code> depuis l'environnement.
          </p>

          <h3 class="text-lg font-medium text-white mb-3">Méthodes</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-dark-700">
                  <th class="py-2 px-3 text-dark-300">Méthode</th>
                  <th class="py-2 px-3 text-dark-300">Paramètres</th>
                  <th class="py-2 px-3 text-dark-300">Retour</th>
                </tr>
              </thead>
              <tbody class="text-dark-200">
                <tr>
                  <td class="py-2 px-3"><code class="code-inline">generateCommitMessage</code></td>
                  <td class="py-2 px-3 text-dark-400">diff: string, context?: string</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;string&gt;</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 code-wrapper relative">
            <pre class="code-block"><code class="language-typescript">import { AIService } from './core/ai-service';

const ai = new AIService();
const message = await ai.generateCommitMessage(diff, 'Adding login feature');
// Output: "feat(auth): implement user login with JWT tokens"</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="card mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">Class</span>
            <h2 class="text-xl font-semibold text-white">GitAnalyzer</h2>
          </div>
          <p class="text-dark-400 mb-4">
            Wrapper autour de simple-git pour les opérations Git courantes.
          </p>
          <p class="text-dark-500 text-sm mb-4">📁 src/core/git-analyzer.ts</p>

          <h3 class="text-lg font-medium text-white mb-3">Méthodes</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-dark-700">
                  <th class="py-2 px-3 text-dark-300">Méthode</th>
                  <th class="py-2 px-3 text-dark-300">Description</th>
                  <th class="py-2 px-3 text-dark-300">Retour</th>
                </tr>
              </thead>
              <tbody class="text-dark-200">
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">getStagedChanges()</code></td>
                  <td class="py-2 px-3 text-dark-400">Récupère les fichiers stagés et leur diff</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;{files, diff, hasChanges}&gt;</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">getStatus()</code></td>
                  <td class="py-2 px-3 text-dark-400">Statut complet du repository</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;StatusResult&gt;</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">createCommit(message)</code></td>
                  <td class="py-2 px-3 text-dark-400">Crée un commit avec le message</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;void&gt;</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">stageAll()</code></td>
                  <td class="py-2 px-3 text-dark-400">Stage tous les fichiers (git add .)</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;void&gt;</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">stageFile(file)</code></td>
                  <td class="py-2 px-3 text-dark-400">Stage un fichier spécifique</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;void&gt;</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">getCurrentBranch()</code></td>
                  <td class="py-2 px-3 text-dark-400">Nom de la branche courante</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;string&gt;</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">createBranch(name)</code></td>
                  <td class="py-2 px-3 text-dark-400">Crée et checkout une nouvelle branche</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;void&gt;</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">push(branch, setUpstream)</code></td>
                  <td class="py-2 px-3 text-dark-400">Push vers le remote</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;void&gt;</td>
                </tr>
                <tr>
                  <td class="py-2 px-3"><code class="code-inline">isMainBranch()</code></td>
                  <td class="py-2 px-3 text-dark-400">Vérifie si sur main/master/develop</td>
                  <td class="py-2 px-3 text-dark-400">Promise&lt;boolean&gt;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">Class</span>
            <h2 class="text-xl font-semibold text-white">ChangeAnalyzer</h2>
          </div>
          <p class="text-dark-400 mb-4">
            Analyse et catégorise les fichiers modifiés par scope (frontend, backend, tests, docs, config).
          </p>
          <p class="text-dark-500 text-sm mb-4">📁 src/core/change-analyzer.ts</p>

          <h3 class="text-lg font-medium text-white mb-3">Méthodes</h3>
          <div class="code-wrapper relative mb-4">
            <pre class="code-block"><code class="language-typescript">analyzeFiles(files: string[]): AnalysisResult</code></pre>
          </div>

          <h3 class="text-lg font-medium text-white mb-3">Interface AnalysisResult</h3>
          <div class="code-wrapper relative">
            <pre class="code-block"><code class="language-typescript">interface AnalysisResult {
  groups: FileGroup[];      // Fichiers groupés par scope
  hasMultipleScopes: boolean; // Plus d'un scope détecté
  totalFiles: number;
  suggestions: string[];    // Suggestions de qualité
}

interface FileGroup {
  label: string;    // "Backend API", "Frontend Components"
  scope: string;    // "api", "components"
  files: string[];
  category: string; // "code", "tests", "docs", "config"
}</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="card mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">Class</span>
            <h2 class="text-xl font-semibold text-white">BranchSuggester</h2>
          </div>
          <p class="text-dark-400 mb-4">
            Génère des suggestions de noms de branches basées sur les conventions Git Flow.
          </p>
          <p class="text-dark-500 text-sm mb-4">📁 src/core/branch-suggester.ts</p>

          <h3 class="text-lg font-medium text-white mb-3">Méthodes</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-dark-700">
                  <th class="py-2 px-3 text-dark-300">Méthode</th>
                  <th class="py-2 px-3 text-dark-300">Description</th>
                </tr>
              </thead>
              <tbody class="text-dark-200">
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">suggestBranchName(files, diff?)</code></td>
                  <td class="py-2 px-3 text-dark-400">Génère une suggestion de nom de branche</td>
                </tr>
                <tr>
                  <td class="py-2 px-3"><code class="code-inline">generateMultipleSuggestions(files, diff?)</code></td>
                  <td class="py-2 px-3 text-dark-400">Génère plusieurs suggestions</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 p-4 bg-dark-800/50 rounded-xl">
            <p class="text-dark-300 text-sm">
              <strong class="text-white">Types détectés :</strong> feat, fix, docs, refactor, test, chore
            </p>
          </div>
        </div>

        <div class="card mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">Class</span>
            <h2 class="text-xl font-semibold text-white">SuggestionsEngine</h2>
          </div>
          <p class="text-dark-400 mb-4">
            Moteur d'analyse de sécurité et de qualité du code.
          </p>
          <p class="text-dark-500 text-sm mb-4">📁 src/core/suggestions/index.ts</p>

          <h3 class="text-lg font-medium text-white mb-3">Méthodes</h3>
          <div class="code-wrapper relative mb-4">
            <pre class="code-block"><code class="language-typescript">analyze(files: string[], diff: string): SuggestionResult</code></pre>
          </div>

          <h3 class="text-lg font-medium text-white mb-3">Interface SuggestionResult</h3>
          <div class="code-wrapper relative">
            <pre class="code-block"><code class="language-typescript">interface SuggestionResult {
  secrets: SecretDetection[];  // Fichiers sensibles détectés
  todos: TodoDetection[];      // TODO/FIXME trouvés
  hasHighSeverity: boolean;
  hasMediumSeverity: boolean;
  totalIssues: number;
}</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="card mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">Class</span>
            <h2 class="text-xl font-semibold text-white">JiraManager</h2>
          </div>
          <p class="text-dark-400 mb-4">
            Intégration complète avec l'API Jira pour la gestion des tickets.
          </p>
          <p class="text-dark-500 text-sm mb-4">📁 src/core/jira-manager.ts</p>

          <h3 class="text-lg font-medium text-white mb-3">Principales méthodes</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-dark-700">
                  <th class="py-2 px-3 text-dark-300">Méthode</th>
                  <th class="py-2 px-3 text-dark-300">Description</th>
                </tr>
              </thead>
              <tbody class="text-dark-200">
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">extractTicketFromBranch(branch)</code></td>
                  <td class="py-2 px-3 text-dark-400">Extrait l'ID du ticket depuis le nom de branche</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">getIssue(issueKey)</code></td>
                  <td class="py-2 px-3 text-dark-400">Récupère les détails d'un ticket</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">createIssue(summary, description)</code></td>
                  <td class="py-2 px-3 text-dark-400">Crée un nouveau ticket Jira</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">linkCommit(params)</code></td>
                  <td class="py-2 px-3 text-dark-400">Lie un commit à un ticket</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">linkPR(params)</code></td>
                  <td class="py-2 px-3 text-dark-400">Lie une PR à un ticket</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-2 px-3"><code class="code-inline">transitionOnCommit(issueKey)</code></td>
                  <td class="py-2 px-3 text-dark-400">Passe le ticket en "In Progress"</td>
                </tr>
                <tr>
                  <td class="py-2 px-3"><code class="code-inline">transitionOnPR(issueKey)</code></td>
                  <td class="py-2 px-3 text-dark-400">Passe le ticket en "In Review"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-12 text-center">
          <p class="text-dark-400 mb-4">Besoin de configurer Git Agent ?</p>
          <button onclick="navigateTo('configuration')" class="btn-primary">
            Guide de configuration
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `;
}
