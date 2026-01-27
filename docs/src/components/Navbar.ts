export function renderNavbar(currentSection: string): string {
  const sidebarSections = [
    {
      title: "Pour commencer",
      items: [
        { id: "home", label: "Introduction", icon: "home" },
        { id: "installation", label: "Installation", icon: "download" },
        { id: "configuration", label: "Configuration", icon: "cog" },
      ]
    },
    {
      title: "Utilisation",
      items: [
        { id: "usage", label: "Guide d'utilisation", icon: "book" },
        { id: "local", label: "Développement local", icon: "code" },
      ]
    },
    {
      title: "Référence",
      items: [
        { id: "api", label: "API Reference", icon: "cube" },
      ]
    }
  ];

  const getIcon = (icon: string) => {
    const icons: Record<string, string> = {
      home: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>`,
      download: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
      </svg>`,
      cog: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>`,
      book: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>`,
      code: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
      </svg>`,
      cube: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>`,
    };
    return icons[icon] || icons.home;
  };

  return `
    <!-- Top Header -->
    <header class="fixed top-0 left-0 right-0 z-50 h-14 bg-dark-950/90 backdrop-blur-xl border-b border-dark-800/50">
      <div class="h-full px-4 flex items-center justify-between">
        <!-- Logo -->
        <button onclick="navigateTo('home')" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/git-agent-icon.svg" alt="Git Agent" class="w-7 h-7" />
          <span class="font-semibold text-white">Git Agent</span>
          <span class="px-2 py-0.5 text-xs font-medium bg-dark-800 text-dark-400 rounded-md border border-dark-700">v1.0.0</span>
        </button>

        <!-- Right side -->
        <div class="flex items-center gap-2">
          <!-- Search (placeholder) -->
          <button class="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-dark-500 bg-dark-900 border border-dark-800 rounded-lg hover:border-dark-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span>Rechercher...</span>
            <kbd class="px-1.5 py-0.5 text-xs bg-dark-800 rounded border border-dark-700">⌘K</kbd>
          </button>

          <!-- GitHub -->
          <a
            href="https://github.com/erwanmarega/git-agent"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-dark-400 hover:text-white transition-colors rounded-lg hover:bg-dark-800"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
            </svg>
          </a>

          <!-- Mobile menu toggle -->
          <button
            onclick="document.getElementById('mobile-sidebar').classList.toggle('translate-x-0'); document.getElementById('mobile-sidebar').classList.toggle('-translate-x-full');"
            class="lg:hidden p-2 text-dark-400 hover:text-white transition-colors rounded-lg hover:bg-dark-800"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Sidebar Desktop -->
    <aside class="hidden lg:block fixed top-14 left-0 bottom-0 w-64 bg-dark-950 border-r border-dark-800/50 overflow-y-auto">
      <nav class="p-4 space-y-6">
        ${sidebarSections.map(section => `
          <div>
            <h3 class="px-3 mb-2 text-xs font-semibold text-dark-500 uppercase tracking-wider">${section.title}</h3>
            <ul class="space-y-1">
              ${section.items.map(item => `
                <li>
                  <button
                    onclick="navigateTo('${item.id}')"
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                      currentSection === item.id
                        ? 'bg-primary-500/10 text-primary-400 border-l-2 border-primary-500 -ml-[2px] pl-[14px]'
                        : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                    }"
                  >
                    ${getIcon(item.icon)}
                    <span>${item.label}</span>
                  </button>
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}

        <!-- npm install card -->
        <div class="mt-8 p-4 bg-dark-900/50 border border-dark-800 rounded-xl">
          <p class="text-xs text-dark-500 mb-2">Installation rapide</p>
          <div class="flex items-center gap-2 bg-dark-950 rounded-lg px-3 py-2 font-mono text-sm">
            <span class="text-dark-500">$</span>
            <span class="text-primary-400">npm i -g @erwanmarega/git-agent</span>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Sidebar Mobile -->
    <aside
      id="mobile-sidebar"
      class="lg:hidden fixed top-14 left-0 bottom-0 w-72 bg-dark-950 border-r border-dark-800/50 overflow-y-auto z-40 transform -translate-x-full transition-transform duration-300"
    >
      <nav class="p-4 space-y-6">
        ${sidebarSections.map(section => `
          <div>
            <h3 class="px-3 mb-2 text-xs font-semibold text-dark-500 uppercase tracking-wider">${section.title}</h3>
            <ul class="space-y-1">
              ${section.items.map(item => `
                <li>
                  <button
                    onclick="navigateTo('${item.id}'); document.getElementById('mobile-sidebar').classList.remove('translate-x-0'); document.getElementById('mobile-sidebar').classList.add('-translate-x-full');"
                    class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                      currentSection === item.id
                        ? 'bg-primary-500/10 text-primary-400'
                        : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                    }"
                  >
                    ${getIcon(item.icon)}
                    <span>${item.label}</span>
                  </button>
                </li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </nav>
    </aside>

    <!-- Mobile overlay -->
    <div
      onclick="document.getElementById('mobile-sidebar').classList.remove('translate-x-0'); document.getElementById('mobile-sidebar').classList.add('-translate-x-full');"
      class="lg:hidden fixed inset-0 bg-black/50 z-30 hidden"
      id="mobile-overlay"
    ></div>
  `;
}
