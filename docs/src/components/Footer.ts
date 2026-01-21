export function renderFooter(): string {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="border-t border-dark-800 bg-dark-900/50">
      <div class="max-w-6xl mx-auto px-6 py-12">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <!-- Brand -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <img src="/git-agent-icon.svg" alt="Git Agent" class="w-8 h-8" />
              <span class="font-semibold text-lg text-white">Git Agent</span>
            </div>
            <p class="text-dark-400 text-sm max-w-sm">
              Assistant IA conversationnel pour Git qui transforme le processus de commit
              en une expérience interactive et intelligente.
            </p>
          </div>

          <div>
            <h3 class="font-medium text-white mb-4">Documentation</h3>
            <ul class="space-y-2">
              <li><button onclick="navigateTo('installation')" class="text-dark-400 hover:text-white text-sm transition-colors">Installation</button></li>
              <li><button onclick="navigateTo('usage')" class="text-dark-400 hover:text-white text-sm transition-colors">Utilisation</button></li>
              <li><button onclick="navigateTo('api')" class="text-dark-400 hover:text-white text-sm transition-colors">API Reference</button></li>
              <li><button onclick="navigateTo('configuration')" class="text-dark-400 hover:text-white text-sm transition-colors">Configuration</button></li>
            </ul>
          </div>

          <div>
            <h3 class="font-medium text-white mb-4">Ressources</h3>
            <ul class="space-y-2">
              <li>
                <a href="https://github.com/erwanmarega/git-agent" target="_blank" class="text-dark-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                  GitHub
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://github.com/erwanmarega/git-agent/issues" target="_blank" class="text-dark-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                  Issues
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </li>
              <li>
                <a href="https://console.anthropic.com" target="_blank" class="text-dark-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                  Anthropic Console
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-dark-500 text-sm">
            © ${currentYear} Git Agent.
          </p>
          <div class="flex items-center gap-4">
            <a href="https://github.com/erwanmarega" target="_blank" class="text-dark-500 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
