export function renderInstallation(): string {
  return `
    <section class="pt-32 pb-20 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="mb-12">
          <h1 class="section-title">Installation</h1>
          <p class="section-subtitle">
            Installez Git Agent en quelques étapes simples et commencez à l'utiliser immédiatement.
          </p>
        </div>

        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Prérequis
          </h2>
          <ul class="space-y-2 text-dark-300">
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
              Node.js 18+ installé
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
              npm ou yarn
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
              Git installé et configuré
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-primary-400 rounded-full"></span>
              Clé API Anthropic (Claude)
            </li>
          </ul>
        </div>

        <div class="card mb-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">1</span>
            <h2 class="text-xl font-semibold text-white">Cloner le repository</h2>
          </div>
          <div class="code-wrapper relative">
            <pre class="code-block"><code>git clone https://github.com/erwanmarega/git-agent.git
cd git-agent</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="card mb-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">2</span>
            <h2 class="text-xl font-semibold text-white">Installer les dépendances</h2>
          </div>
          <div class="code-wrapper relative">
            <pre class="code-block"><code>npm install</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="card mb-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">3</span>
            <h2 class="text-xl font-semibold text-white">Configurer l'API Anthropic</h2>
          </div>
          <p class="text-dark-400 mb-4">
            Créez un fichier <code class="code-inline">.env</code> à la racine du projet :
          </p>
          <div class="code-wrapper relative">
            <pre class="code-block"><code># Clé API Anthropic (obligatoire)
ANTHROPIC_API_KEY=your_api_key_here

# Configuration Jira (optionnel)
JIRA_BASE_URL=https://yourcompany.atlassian.net
JIRA_EMAIL=your.email@company.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=PROJ</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
          <div class="mt-4 p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
            <p class="text-primary-300 text-sm">
              <strong>💡 Astuce :</strong> Obtenez votre clé API sur <a href="https://console.anthropic.com" target="_blank" class="underline hover:text-primary-200">console.anthropic.com</a>
            </p>
          </div>
        </div>

        <!-- Step 4: Build -->
        <div class="card mb-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">4</span>
            <h2 class="text-xl font-semibold text-white">Build et lien global</h2>
          </div>
          <div class="code-wrapper relative">
            <pre class="code-block"><code># Compiler le projet
npm run build

# Créer un lien global pour utiliser git-agent partout
npm link</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Step 5: Verify -->
        <div class="card mb-8">
          <div class="flex items-center gap-3 mb-4">
            <span class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">✓</span>
            <h2 class="text-xl font-semibold text-white">Vérifier l'installation</h2>
          </div>
          <div class="code-wrapper relative">
            <pre class="code-block"><code>git-agent --version
# Output: 0.1.0</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Development mode -->
        <div class="card bg-dark-800/30">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            Mode développement
          </h2>
          <p class="text-dark-400 mb-4">
            Pour développer et tester localement sans compiler :
          </p>
          <div class="code-wrapper relative">
            <pre class="code-block"><code># Lancer en mode dev
npm run dev

# Ou avec hot-reload
npm run dev:watch</code></pre>
            <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

          <!-- Next steps -->
        <div class="mt-12 text-center">
          <p class="text-dark-400 mb-4">Prêt à utiliser Git Agent ?</p>
          <button onclick="navigateTo('usage')" class="btn-primary">
            Voir le guide d'utilisation
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `;
}
