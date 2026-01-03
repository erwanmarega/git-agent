# 🤖 Git Agent

Assistant IA conversationnel pour Git qui transforme le processus de commit en une expérience interactive et intelligente.

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

1. Copiez le fichier `.env.example` vers `.env`:
```bash
cp .env.example .env
```

2. Ajoutez votre clé API Anthropic dans `.env`:
```env
ANTHROPIC_API_KEY=votre_clé_ici
```

Obtenez votre clé sur: https://console.anthropic.com/

## 🎯 Utilisation

### En développement

```bash
# Exécuter la commande commit
npm run dev commit

# Ou avec watch mode (redémarre à chaque changement)
npm run dev:watch commit
```

### En production

```bash
# Compiler
npm run build

# Exécuter
npm start commit

# Ou installer globalement
npm run build
npm link
git-agent commit
```

## 📋 Commandes disponibles

- `git-agent commit` - Assistant interactif pour créer des commits

## 🛠️ Développement

- `npm run dev` - Exécute le CLI en mode développement
- `npm run dev:watch` - Mode watch avec rechargement automatique
- `npm run build` - Compile TypeScript vers JavaScript
- `npm run start` - Exécute la version compilée

## 📚 Documentation

Voir [DOCUMENTATION.md](./DOCUMENTATION.md) pour la vision complète du projet.

## 🔐 Sécurité

Le fichier `.env` contient des informations sensibles et ne doit jamais être commité. Il est déjà dans `.gitignore`.
