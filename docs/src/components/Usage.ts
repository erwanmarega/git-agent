export function renderUsage(): string {
  return `
    <section class="pt-8 pb-20 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="mb-12">
          <h1 class="section-title">Guide d'utilisation</h1>
          <p class="section-subtitle">
            Apprenez à utiliser Git Agent pour optimiser votre workflow Git au quotidien.
          </p>
        </div>

        <div class="card mb-8">
          <h2 class="text-xl font-semibold text-white mb-4">Commandes disponibles</h2>
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
                  <td class="py-3 px-4"><code class="code-inline">git-agent init</code></td>
                  <td class="py-3 px-4 text-dark-400">Initialiser la configuration de Git Agent</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">git-agent commit</code></td>
                  <td class="py-3 px-4 text-dark-400">Lancer le workflow de commit interactif avec IA</td>
                </tr>
                <tr class="border-b border-dark-800">
                  <td class="py-3 px-4"><code class="code-inline">git-agent learn</code></td>
                  <td class="py-3 px-4 text-dark-400">Apprendre le style de commit du repository</td>
                </tr>
                <tr>
                  <td class="py-3 px-4"><code class="code-inline">git-agent --version</code></td>
                  <td class="py-3 px-4 text-dark-400">Afficher la version de Git Agent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Workflow de commit
          </h2>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3">1. Lancer la commande</h3>
            <p class="text-dark-400 mb-4">
              Dans un repository Git avec des changements en attente :
            </p>
            <div class="code-wrapper relative">
              <pre class="code-block"><code>git-agent commit</code></pre>
              <button class="copy-btn absolute top-3 right-3 p-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3">2. Staging automatique</h3>
            <p class="text-dark-400 mb-4">
              Si aucun fichier n'est stagé, Git Agent propose de tout ajouter :
            </p>
            <div class="bg-dark-900 rounded-xl p-4 font-mono text-sm">
              <div class="text-yellow-400 mb-2">⚠ No staged changes found, but you have modified files:</div>
              <div class="text-dark-500 pl-4 mb-3">
                - src/components/Button.tsx<br/>
                - src/styles/button.css
              </div>
              <div class="text-dark-300">? Do you want to stage all changes? (git add .) <span class="text-green-400">(Y/n)</span></div>
            </div>
          </div>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3">3. Création de branche (optionnel)</h3>
            <p class="text-dark-400 mb-4">
              Si vous êtes sur <code class="code-inline">main</code> ou <code class="code-inline">master</code>, Git Agent suggère des noms de branches :
            </p>
            <div class="bg-dark-900 rounded-xl p-4 font-mono text-sm">
              <div class="text-yellow-400 mb-2">⚠️ You are on the 'main' branch.</div>
              <div class="text-dark-300 mb-3">It's recommended to create a feature branch.</div>
              <div class="text-primary-400 mb-2">Suggested branch names:</div>
              <div class="text-dark-400 pl-4">
                1) feat/components-button<br/>
                2) feat/button<br/>
                3) feat/components-250121<br/>
                4) Enter custom name<br/>
                5) Stay on main
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3">4. Détection de sécurité</h3>
            <p class="text-dark-400 mb-4">
              Git Agent analyse automatiquement vos changements pour détecter :
            </p>
            <ul class="space-y-2 text-dark-300 mb-4">
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span>Fichiers sensibles (.env, credentials, clés API)</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Commentaires TODO et FIXME ajoutés</span>
              </li>
            </ul>
            <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div class="text-red-400 font-mono text-sm">
                🚨 SECURITY ALERT!<br/><br/>
                High severity: Sensitive file detected<br/>
                &nbsp;&nbsp;File: .env<br/>
                &nbsp;&nbsp;Suggestion: Add to .gitignore
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3">5. Génération du message</h3>
            <p class="text-dark-400 mb-4">
              L'IA génère un message de commit au format conventionnel :
            </p>
            <div class="bg-dark-900 rounded-xl p-4 font-mono text-sm">
              <div class="text-green-400 mb-2">✨ Suggested commit message:</div>
              <div class="bg-dark-800 rounded-lg p-3 text-white mb-4">
                feat(components): add Button component with primary and secondary variants
              </div>
              <div class="text-primary-400">Options:</div>
              <div class="text-dark-400 pl-4">
                1) Accept and commit<br/>
                2) Edit message<br/>
                3) Regenerate<br/>
                4) Cancel
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="text-lg font-semibold text-white mb-3">6. Push et PR (optionnel)</h3>
            <p class="text-dark-400 mb-4">
              Après le commit, Git Agent propose de push et créer une PR :
            </p>
            <div class="bg-dark-900 rounded-xl p-4 font-mono text-sm">
              <div class="text-green-400 mb-2">✓ Commit created successfully!</div>
              <div class="text-primary-400 mb-2">Next steps:</div>
              <div class="text-dark-400 pl-4 mb-3">
                1) Push to remote (origin/feat/button)<br/>
                2) Stay local
              </div>
              <div class="text-primary-400 mt-4 mb-2">Create a Pull Request?</div>
              <div class="text-dark-400 pl-4">
                1) Yes, create PR<br/>
                2) No, skip
              </div>
            </div>
          </div>
        </div>

        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            Commits multi-scope
          </h2>

          <div class="card">
            <p class="text-dark-400 mb-4">
              Quand vos changements touchent plusieurs domaines (frontend, backend, tests...),
              Git Agent détecte automatiquement les scopes et propose de créer des commits séparés :
            </p>
            <div class="bg-dark-900 rounded-xl p-4 font-mono text-sm mb-4">
              <div class="text-primary-400 mb-2">I detected changes in multiple areas:</div>
              <div class="text-dark-300 mb-1">1. Backend API (2 files)</div>
              <div class="text-dark-500 pl-4 mb-2">
                - src/api/users.ts<br/>
                - src/api/auth.ts
              </div>
              <div class="text-dark-300 mb-1">2. Frontend Components (3 files)</div>
              <div class="text-dark-500 pl-4 mb-3">
                - src/components/Login.tsx<br/>
                - src/components/UserProfile.tsx<br/>
                - src/components/Header.tsx
              </div>
              <div class="text-yellow-400 mb-2">Recommendation: Create separate commits.</div>
              <div class="text-dark-400">
                1) Create 2 separate commits (recommended)<br/>
                2) Create 1 single commit for everything
              </div>
            </div>
            <p class="text-dark-400 text-sm">
              Cette approche maintient un historique Git propre et facilite les revues de code.
            </p>
          </div>
        </div>

        <div class="mb-12">
          <h2 class="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            Apprentissage du style (learn)
          </h2>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3">Pourquoi utiliser learn ?</h3>
            <p class="text-dark-400 mb-4">
              La commande <code class="code-inline">git-agent learn</code> analyse l'historique des commits
              de votre repository pour comprendre le style de votre équipe et générer des messages cohérents.
            </p>
            <ul class="space-y-2 text-dark-300">
              <li class="flex items-start gap-2">
                <span class="text-primary-400">→</span>
                <span>Détecte la langue utilisée (français, anglais, mixte)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-400">→</span>
                <span>Identifie le format (Conventional Commits, libre...)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-400">→</span>
                <span>Apprend les scopes utilisés dans le projet</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-400">→</span>
                <span>Détecte l'utilisation d'emojis et les associe aux types</span>
              </li>
            </ul>
          </div>

          <div class="card mb-4">
            <h3 class="text-lg font-semibold text-white mb-3">Utilisation</h3>
            <div class="space-y-4">
              <div>
                <p class="text-dark-400 mb-2">Analyser les 100 derniers commits :</p>
                <div class="code-wrapper relative">
                  <pre class="code-block"><code>git-agent learn</code></pre>
                </div>
              </div>
              <div>
                <p class="text-dark-400 mb-2">Analyser plus de commits pour plus de précision :</p>
                <div class="code-wrapper relative">
                  <pre class="code-block"><code>git-agent learn --commits 500</code></pre>
                </div>
              </div>
              <div>
                <p class="text-dark-400 mb-2">Apprendre le style d'un contributeur spécifique :</p>
                <div class="code-wrapper relative">
                  <pre class="code-block"><code>git-agent learn --author "email@exemple.com"</code></pre>
                </div>
              </div>
              <div>
                <p class="text-dark-400 mb-2">Réinitialiser le style appris :</p>
                <div class="code-wrapper relative">
                  <pre class="code-block"><code>git-agent learn --reset</code></pre>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="text-lg font-semibold text-white mb-3">Résultat de l'analyse</h3>
            <div class="bg-dark-900 rounded-xl p-4 font-mono text-sm">
              <div class="text-cyan-400 mb-2">╔═══════════════════════════════════════════════════════╗</div>
              <div class="text-yellow-400 mb-2">║            📊 STYLE DÉTECTÉ                           ║</div>
              <div class="text-cyan-400 mb-2">╠═══════════════════════════════════════════════════════╣</div>
              <div class="text-dark-300 mb-1">║  Langue           │  🇫🇷 Français                      ║</div>
              <div class="text-dark-300 mb-1">║  Format           │  ✅ Conventional Commits          ║</div>
              <div class="text-dark-300 mb-1">║  Emojis           │  ✨ Oui                            ║</div>
              <div class="text-dark-300 mb-1">║  Longueur moyenne │  52 caractères                    ║</div>
              <div class="text-cyan-400 mb-2">╠═══════════════════════════════════════════════════════╣</div>
              <div class="text-yellow-400 mb-1">║            📁 SCOPES UTILISÉS                         ║</div>
              <div class="text-dark-400 mb-2">║  api, ui, core, auth, cli                             ║</div>
              <div class="text-cyan-400">╚═══════════════════════════════════════════════════════╝</div>
              <div class="text-green-400 mt-3">✓ Profil sauvegardé: .git-agent/learned-style.json</div>
            </div>
          </div>
        </div>

        <div class="card bg-gradient-to-br from-primary-500/10 to-blue-500/10 border-primary-500/20">
          <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            Conseils et astuces
          </h2>
          <ul class="space-y-3 text-dark-300">
            <li class="flex items-start gap-2">
              <span class="text-primary-400 mt-1">→</span>
              <span><strong class="text-white">Ajoutez du contexte</strong> : Quand Git Agent demande "What are you working on?", donnez des détails pour des messages plus précis.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-400 mt-1">→</span>
              <span><strong class="text-white">Utilisez les branches</strong> : Laissez Git Agent créer des branches pour vous avec des noms conventionnels.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-400 mt-1">→</span>
              <span><strong class="text-white">Régénérez si nécessaire</strong> : L'option "Regenerate" produit un nouveau message si le premier ne convient pas.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-400 mt-1">→</span>
              <span><strong class="text-white">Configurez Jira</strong> : Si vous utilisez Jira, configurez l'intégration pour lier automatiquement vos commits aux tickets.</span>
            </li>
          </ul>
        </div>

        <div class="mt-12 text-center">
          <p class="text-dark-400 mb-4">Besoin de plus de détails techniques ?</p>
          <button onclick="navigateTo('api')" class="btn-primary">
            Explorer l'API
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `;
}
