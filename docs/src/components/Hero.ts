export function renderHero(): string {
  return `
    <section class="pt-16 pb-20 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent pointer-events-none"></div>
      <div class="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
      </div>

      <div class="max-w-5xl mx-auto text-center relative">

        <div class="mb-8">
          <div class="relative inline-block">
            <div class="absolute inset-0 blur-2xl bg-primary-500/30 rounded-full scale-150 animate-pulse-glow animation-delay-1000"></div>

            <div class="relative logo-build-container">
              <svg class="w-24 h-24 md:w-32 md:h-32 mx-auto drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle class="logo-circle-bg" cx="32" cy="32" r="30" fill="none" stroke="url(#grad1)" stroke-width="2"/>
                <circle class="logo-circle-fill" cx="32" cy="32" r="30" fill="url(#grad1)"/>

                <path class="logo-line-main" d="M32 22v8m0 8v8" stroke="white" stroke-width="3" stroke-linecap="round"/>

                <path class="logo-line-branch-left" d="M20 32c0-3.3 2.7-6 6-6" stroke="white" stroke-width="3" stroke-linecap="round" fill="none"/>
                <path class="logo-line-branch-right" d="M44 32c0 3.3-2.7 6-6 6" stroke="white" stroke-width="3" stroke-linecap="round" fill="none"/>

                <circle class="logo-node logo-node-1" cx="32" cy="18" r="4" fill="white"/>
                <circle class="logo-node logo-node-2" cx="32" cy="32" r="4" fill="white"/>
                <circle class="logo-node logo-node-3" cx="32" cy="46" r="4" fill="white"/>

                <circle class="logo-node logo-node-4" cx="20" cy="32" r="3" fill="white"/>
                <circle class="logo-node logo-node-5" cx="44" cy="32" r="3" fill="white"/>
              </svg>
            </div>
          </div>
        </div>

        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
          <span class="block animate-fade-in-up animation-delay-300">Transformez vos commits avec</span>
          <span class="block animate-fade-in-up animation-delay-500">
            <span class="gradient-text-animated">l'Intelligence Artificielle</span>
          </span>
        </h1>

        <p class="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 text-balance animate-fade-in-up animation-delay-700">
          Git Agent est un assistant CLI intelligent qui génère automatiquement des messages de commit,
          suggère des noms de branches, et s'intègre avec Jira et GitHub.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-900">
          <button onclick="navigateTo('installation')" class="btn-primary group">
            <svg class="w-5 h-5 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Commencer
          </button>
          <a href="https://github.com/erwanmarega/git-agent" target="_blank" class="btn-secondary group">
            <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
            </svg>
            Voir sur GitHub
          </a>
        </div>

        <div class="max-w-3xl mx-auto animate-fade-in-up animation-delay-1000">
          <div class="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-primary-500/10 transition-shadow duration-500">
            <div class="flex items-center gap-2 px-4 py-3 bg-dark-800/50 border-b border-dark-800">
              <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span class="text-dark-500 text-sm ml-2">Terminal</span>
            </div>

            <div class="p-6 font-mono text-sm text-left">
              <div class="flex items-center gap-2 text-dark-400 mb-3">
                <span class="text-green-400">$</span>
                <span class="text-white typing-effect">git-agent commit</span>
              </div>
              <div class="text-primary-400 mb-2">
                ✨ Git Agent - Interactive Commit
              </div>
              <div class="text-dark-400 mb-3">
                Analyzing your changes...
              </div>
              <div class="text-dark-300 mb-1">
                📁 Staged files:
              </div>
              <div class="text-dark-500 pl-4 mb-3">
                - src/components/Button.tsx<br/>
                - src/styles/button.css
              </div>
              <div class="text-green-400 mb-2">
                ✨ Suggested commit message:
              </div>
              <div class="bg-dark-800 rounded-lg p-3 text-white mb-3">
                feat(components): add new Button component with variants
              </div>
              <div class="text-dark-400">
                <span class="text-primary-400">?</span> Options: [1] Accept [2] Edit [3] Regenerate [4] Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
