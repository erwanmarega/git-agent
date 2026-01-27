export function renderConfiguration(): string {
  return `
    <section class="pt-8 pb-20 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="mb-12">
          <h1 class="section-title">Configuration</h1>
          <p class="section-subtitle">
            Configurez Git Agent pour l'adapter à votre environnement et vos besoins.
          </p>
        </div>

        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            Variables d'environnement
          </h2>
          <p class="text-dark-400 mb-6">
            Créez un fichier <code class="code-inline">.env</code> à la racine du projet avec les variables suivantes :
          </p>

          <div class="code-wrapper relative mb-6">
            <pre class="code-block"><code># ===========================================
# CONFIGURATION ANTHROPIC (OBLIGATOIRE)
# ===========================================

# Clé API pour Claude AI
# Obtenez-la sur: https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxx

# ===========================================
# CONFIGURATION JIRA (OPTIONNEL)
# ===========================================

# URL de base de votre instance Jira
JIRA_BASE_URL=https://yourcompany.atlassian.net

# Email associé à votre compte Jira
JIRA_EMAIL=your.email@company.com

# Token API Jira
# Créez-le sur: https://id.atlassian.com/manage-profile/security/api-tokens
JIRA_API_TOKEN=your_jira_api_token

# Clé du projet Jira par défaut (ex: PROJ, DEV, FEAT)
JIRA_PROJECT_KEY=PROJ</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-dark-700">
                  <th class="py-3 px-4 text-dark-300">Variable</th>
                  <th class="py-3 px-4 text-dark-300">Obligatoire</th>
                  <th class="py-3 px-4 text-dark-300">Description</th>
                </tr>
              </thead>
              <tbody class="text-dark-200">
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">ANTHROPIC_API_KEY</code></td>
                  <td class="py-3 px-4"><span class="text-green-400">Oui</span></td>
                  <td class="py-3 px-4 text-dark-400">Clé API Anthropic pour Claude</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">JIRA_BASE_URL</code></td>
                  <td class="py-3 px-4"><span class="text-dark-500">Non</span></td>
                  <td class="py-3 px-4 text-dark-400">URL de votre instance Jira</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">JIRA_EMAIL</code></td>
                  <td class="py-3 px-4"><span class="text-dark-500">Non</span></td>
                  <td class="py-3 px-4 text-dark-400">Email de votre compte Jira</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">JIRA_API_TOKEN</code></td>
                  <td class="py-3 px-4"><span class="text-dark-500">Non</span></td>
                  <td class="py-3 px-4 text-dark-400">Token API Jira</td>
                </tr>
                <tr>
                  <td class="py-3 px-4"><code class="code-inline">JIRA_PROJECT_KEY</code></td>
                  <td class="py-3 px-4"><span class="text-dark-500">Non</span></td>
                  <td class="py-3 px-4 text-dark-400">Clé du projet Jira par défaut</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Anthropic API Key -->
        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
            Obtenir une clé API Anthropic
          </h2>

          <ol class="space-y-4 text-dark-300">
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
              <span>Rendez-vous sur <a href="https://console.anthropic.com" target="_blank" class="text-primary-400 hover:underline">console.anthropic.com</a></span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
              <span>Créez un compte ou connectez-vous</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
              <span>Allez dans <strong class="text-white">Settings</strong> → <strong class="text-white">API Keys</strong></span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
              <span>Cliquez sur <strong class="text-white">Create Key</strong> et copiez la clé générée</span>
            </li>
          </ol>

          <div class="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p class="text-yellow-300 text-sm flex items-start gap-2">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span><strong>Important :</strong> Ne partagez jamais votre clé API. Ajoutez <code class="bg-yellow-500/20 px-1 rounded">.env</code> à votre <code class="bg-yellow-500/20 px-1 rounded">.gitignore</code>.</span>
            </p>
          </div>
        </div>

        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.53 2c-.55.01-1.1.08-1.64.21l-.02.01c-.18.04-.35.1-.52.16l-.03.01c-.56.22-1.07.53-1.5.93L3.06 8.07c-.21.21-.21.56 0 .77l3.47 3.47c.21.21.56.21.77 0l4.76-4.76c.21-.21.56-.21.77 0l4.76 4.76c.21.21.56.21.77 0l3.47-3.47c.21-.21.21-.56 0-.77l-4.76-4.76c-.43-.4-.94-.71-1.5-.93l-.03-.01c-.17-.06-.34-.12-.52-.16l-.02-.01c-.54-.13-1.09-.2-1.64-.21h-.31zm0 5.22L9.3 9.45l2.23 2.23 2.23-2.23-2.23-2.23zm-5.46 5.46l-3.47 3.47c-.21.21-.21.56 0 .77l4.76 4.76c.43.4.94.71 1.5.93l.03.01c.17.06.34.12.52.16l.02.01c.54.13 1.09.2 1.64.21h.31c.55-.01 1.1-.08 1.64-.21l.02-.01c.18-.04.35-.1.52-.16l.03-.01c.56-.22 1.07-.53 1.5-.93l4.76-4.76c.21-.21.21-.56 0-.77l-3.47-3.47c-.21-.21-.56-.21-.77 0l-4.76 4.76c-.21.21-.56.21-.77 0l-4.76-4.76c-.21-.21-.56-.21-.77 0z"/>
            </svg>
            Configuration Jira
          </h2>
          <p class="text-dark-400 mb-6">
            L'intégration Jira est optionnelle mais recommandée pour les équipes utilisant Jira pour le suivi des tickets.
          </p>

          <h3 class="text-lg font-medium text-white mb-3">Créer un token API Jira</h3>
          <ol class="space-y-4 text-dark-300 mb-6">
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
              <span>Connectez-vous à <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" class="text-primary-400 hover:underline">Atlassian Account</a></span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
              <span>Cliquez sur <strong class="text-white">Create API token</strong></span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
              <span>Donnez un nom au token (ex: "Git Agent")</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
              <span>Copiez le token généré</span>
            </li>
          </ol>

          <h3 class="text-lg font-medium text-white mb-3">Fonctionnalités Jira</h3>
          <ul class="space-y-2 text-dark-300">
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Extraction automatique du ticket depuis le nom de branche (ex: <code class="code-inline">feat/PROJ-123-add-login</code>)
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Liaison automatique des commits aux tickets
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Création de nouveaux tickets depuis Git Agent
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Transition automatique (To Do → In Progress → In Review)
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Liaison des Pull Requests aux tickets
            </li>
          </ul>
        </div>

        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-dark-300" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
            </svg>
            GitHub CLI (optionnel)
          </h2>
          <p class="text-dark-400 mb-4">
            Pour créer des Pull Requests automatiquement, installez GitHub CLI :
          </p>

          <div class="code-wrapper relative mb-4">
            <pre class="code-block"><code># macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>

          <p class="text-dark-400 mb-4">Puis authentifiez-vous :</p>
          <div class="code-wrapper relative">
            <pre class="code-block"><code>gh auth login</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="card bg-dark-800/30">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            Sécurité : .gitignore
          </h2>
          <p class="text-dark-400 mb-4">
            Assurez-vous que votre fichier <code class="code-inline">.gitignore</code> contient :
          </p>
          <div class="code-wrapper relative">
            <pre class="code-block"><code># Environment variables
.env
.env.local
.env.*.local

# Node
node_modules/
dist/

# Logs
*.log
npm-debug.log*</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Back to home -->
        <div class="mt-12 text-center">
          <p class="text-dark-400 mb-4">Configuration terminée ?</p>
          <button onclick="navigateTo('usage')" class="btn-primary">
            Commencer à utiliser Git Agent
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `;
}
