export function renderLocalDev(): string {
  return `
    <section class="pt-32 pb-20 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="mb-12">
          <h1 class="section-title">Développement Local</h1>
          <p class="section-subtitle">
            Commandes pour contribuer au projet ou tester Git Agent en local.
          </p>
        </div>

        <div class="card mb-8 border-yellow-500/30 bg-yellow-500/5">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h3 class="text-yellow-500 font-semibold mb-1">Mode Développement</h3>
              <p class="text-dark-400 text-sm">
                Ces commandes sont destinées aux contributeurs et développeurs qui travaillent sur le code source de Git Agent.
                Pour une utilisation normale, préférez l'installation via npm.
              </p>
            </div>
          </div>
        </div>

        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-white mb-4">Prérequis</h2>
          <ul class="space-y-2 text-dark-300">
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Node.js >= 18.0.0
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              npm ou yarn
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Clé API Anthropic
            </li>
          </ul>
        </div>

        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-white mb-4">Installation du projet</h2>
          <div class="space-y-4">
            <div>
              <p class="text-dark-400 mb-2">1. Cloner le repository :</p>
              <div class="code-wrapper relative">
                <pre class="code-block"><code>git clone https://github.com/erwanmarega/git-agent.git
cd git-agent</code></pre>
              </div>
            </div>
            <div>
              <p class="text-dark-400 mb-2">2. Installer les dépendances :</p>
              <div class="code-wrapper relative">
                <pre class="code-block"><code>npm install</code></pre>
              </div>
            </div>
            <div>
              <p class="text-dark-400 mb-2">3. Configurer l'environnement :</p>
              <div class="code-wrapper relative">
                <pre class="code-block"><code>npm run dev init</code></pre>
              </div>
            </div>
          </div>
        </div>

        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-white mb-6">Commandes disponibles</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-dark-700">
                  <th class="py-3 px-4 text-dark-300 font-medium">Commande</th>
                  <th class="py-3 px-4 text-dark-300 font-medium">Description</th>
                </tr>
              </thead>
              <tbody class="text-dark-200">
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">npm run dev init</code></td>
                  <td class="py-3 px-4 text-dark-400">Configurer Git Agent (clé API, modèle, Jira)</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">npm run dev commit</code></td>
                  <td class="py-3 px-4 text-dark-400">Lancer le workflow de commit interactif</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">npm run dev learn</code></td>
                  <td class="py-3 px-4 text-dark-400">Analyser et apprendre le style de commit</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">npm run dev:watch</code></td>
                  <td class="py-3 px-4 text-dark-400">Mode watch (recharge auto)</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">npm run build</code></td>
                  <td class="py-3 px-4 text-dark-400">Compiler le projet TypeScript</td>
                </tr>
                <tr>
                  <td class="py-3 px-4"><code class="code-inline">npm start</code></td>
                  <td class="py-3 px-4 text-dark-400">Lancer la version compilée</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-white mb-6">Exemples d'utilisation</h2>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span class="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">1</span>
              Initialiser la configuration
            </h3>
            <div class="bg-dark-900 rounded-xl p-4 font-mono text-sm">
              <div class="flex items-center gap-2 text-dark-400 mb-3">
                <span class="text-green-400">$</span>
                <span class="text-white">npm run dev init</span>
              </div>
              <div class="text-primary-400 mb-2">Git Agent - Setup</div>
              <div class="text-dark-400 mb-2">? Enter your Anthropic API key: <span class="text-dark-600">••••••••</span></div>
              <div class="text-dark-400 mb-2">? Which model do you want to use?</div>
              <div class="text-dark-500 pl-4">
                ❯ Claude Sonnet 4 (Recommended)<br/>
                &nbsp; Claude Opus 4.5<br/>
                &nbsp; Claude Haiku
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span class="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">2</span>
              Faire un commit
            </h3>
            <div class="bg-dark-900 rounded-xl p-4 font-mono text-sm">
              <div class="flex items-center gap-2 text-dark-400 mb-3">
                <span class="text-green-400">$</span>
                <span class="text-white">npm run dev commit</span>
              </div>
              <div class="text-magenta-400 mb-1">   ██████╗ ██╗████████╗     █████╗  ██████╗ ███████╗███╗   ██╗████████╗</div>
              <div class="text-magenta-400 mb-1">  ██╔════╝ ██║╚══██╔══╝    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝</div>
              <div class="text-magenta-400 mb-1">  ██║  ███╗██║   ██║       ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║</div>
              <div class="text-magenta-400 mb-1">  ██║   ██║██║   ██║       ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║</div>
              <div class="text-magenta-400 mb-1">  ╚██████╔╝██║   ██║       ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║</div>
              <div class="text-magenta-400 mb-3">   ╚═════╝ ╚═╝   ╚═╝       ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝</div>
              <div class="text-dark-500 mb-3">  Assistant IA pour des commits intelligents</div>
              <div class="text-dark-400">⠋ Analyzing your changes...</div>
            </div>
          </div>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span class="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">3</span>
              Apprendre le style
            </h3>
            <div class="bg-dark-900 rounded-xl p-4 font-mono text-sm">
              <div class="flex items-center gap-2 text-dark-400 mb-3">
                <span class="text-green-400">$</span>
                <span class="text-white">npm run dev learn</span>
              </div>
              <div class="text-dark-400 mb-3">⠋ Analyse de 100 commits...</div>
              <div class="text-green-400 mb-3">✓ 100 commits analysés</div>
              <div class="text-cyan-400 mb-1">╔═══════════════════════════════════════════════════════╗</div>
              <div class="text-yellow-400 mb-1">║            📊 STYLE DÉTECTÉ                           ║</div>
              <div class="text-cyan-400 mb-1">╠═══════════════════════════════════════════════════════╣</div>
              <div class="text-dark-300 mb-1">║  Langue           │  🇫🇷 Français                      ║</div>
              <div class="text-dark-300 mb-1">║  Format           │  ✅ Conventional Commits          ║</div>
              <div class="text-dark-300 mb-1">║  Emojis           │  ✨ Oui                            ║</div>
              <div class="text-cyan-400">╚═══════════════════════════════════════════════════════╝</div>
            </div>
          </div>

          <div class="card">
            <h3 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span class="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 text-sm font-bold">4</span>
              Options avancées de learn
            </h3>
            <div class="space-y-3">
              <div>
                <p class="text-dark-400 mb-2">Analyser plus de commits :</p>
                <div class="code-wrapper relative">
                  <pre class="code-block"><code>npm run dev learn -- --commits 500</code></pre>
                </div>
              </div>
              <div>
                <p class="text-dark-400 mb-2">Analyser le style d'un contributeur :</p>
                <div class="code-wrapper relative">
                  <pre class="code-block"><code>npm run dev learn -- --author "email@example.com"</code></pre>
                </div>
              </div>
              <div>
                <p class="text-dark-400 mb-2">Réinitialiser le style appris :</p>
                <div class="code-wrapper relative">
                  <pre class="code-block"><code>npm run dev learn -- --reset</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-gradient-to-br from-primary-500/10 to-blue-500/10 border-primary-500/20">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            Contribuer au projet
          </h2>
          <p class="text-dark-400 mb-4">
            Git Agent est open source ! Les contributions sont les bienvenues.
          </p>
          <ol class="space-y-2 text-dark-300 mb-4">
            <li>1. Fork le repository</li>
            <li>2. Crée une branche (<code class="code-inline">git checkout -b feat/ma-feature</code>)</li>
            <li>3. Commit avec Git Agent (<code class="code-inline">npm run dev commit</code>)</li>
            <li>4. Push et crée une Pull Request</li>
          </ol>
          <a
            href="https://github.com/erwanmarega/git-agent"
            target="_blank"
            class="btn-primary inline-flex"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
            </svg>
            Voir sur GitHub
          </a>
        </div>
      </div>
    </section>
  `;
}
