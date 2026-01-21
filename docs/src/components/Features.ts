export function renderFeatures(): string {
  const features = [
    {
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>`,
      title: 'Messages de commit IA',
      description: 'Génération automatique de messages de commit conventionnels grâce à Claude AI. Analyse intelligente de vos changements.'
    },
    {
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>`,
      title: 'Workflow interactif',
      description: 'Interface CLI intuitive avec options pour accepter, éditer ou régénérer les suggestions. Expérience fluide et naturelle.'
    },
    {
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>`,
      title: 'Analyse des changements',
      description: 'Détection automatique du scope (frontend, backend, tests, docs) et suggestions de commits séparés pour les changements multiples.'
    },
    {
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
      </svg>`,
      title: 'Détection de secrets',
      description: 'Scan automatique des fichiers sensibles (.env, clés API) pour prévenir les fuites de données accidentelles.'
    },
    {
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
      </svg>`,
      title: 'Intégration Jira',
      description: 'Liaison automatique des commits aux tickets Jira, création de tickets, et mise à jour des statuts.'
    },
    {
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>`,
      title: 'Création de PR',
      description: 'Génération automatique de Pull Requests GitHub avec titre, description et suggestions de reviewers.'
    },
    {
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
      </svg>`,
      title: 'Suggestion de branches',
      description: 'Génération de noms de branches basée sur les conventions (feat/, fix/, docs/) et le contenu des changements.'
    },
    {
      icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>`,
      title: 'Détection de TODOs',
      description: 'Identification des TODO et FIXME ajoutés dans le code pour un suivi des tâches techniques.'
    }
  ]

  return `
    <section class="py-20 px-6 bg-dark-900/30">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="section-title">Fonctionnalités puissantes</h2>
          <p class="section-subtitle mx-auto">
            Tout ce dont vous avez besoin pour un workflow Git professionnel et efficace.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${features.map(feature => `
            <div class="card-feature">
              <div class="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-400 mb-4">
                ${feature.icon}
              </div>
              <h3 class="text-lg font-semibold text-white mb-2">${feature.title}</h3>
              <p class="text-dark-400 text-sm">${feature.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `
}
