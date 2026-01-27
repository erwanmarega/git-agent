import chalk from "chalk";
import ora from "ora";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface LearnedStyle {
  language: "fr" | "en" | "mixed";
  format: "conventional" | "angular" | "semantic" | "free";
  useEmojis: boolean;
  emojiMap: Record<string, string>;
  scopes: string[];
  averageLength: number;
  maxLength: number;
  capitalization: "lowercase" | "uppercase" | "capitalize";
  usesTicketRef: boolean;
  ticketPattern: string | null;
  tense: "imperative" | "past" | "present";
  analyzedCommits: number;
  analyzedAt: string;
}

interface CommitAnalysis {
  message: string;
  type: string | null;
  scope: string | null;
  hasEmoji: boolean;
  emoji: string | null;
  language: "fr" | "en" | "unknown";
  length: number;
  hasTicketRef: boolean;
  ticketRef: string | null;
  capitalization: "lowercase" | "uppercase" | "capitalize";
}

const FRENCH_WORDS = [
  "ajoute",
  "ajout",
  "correction",
  "corrige",
  "mise",
  "jour",
  "suppression",
  "supprime",
  "modification",
  "modifie",
  "amélioration",
  "améliore",
  "création",
  "crée",
  "implémentation",
  "implémente",
  "refactorisation",
  "nouveau",
  "nouvelle",
  "pour",
  "dans",
  "avec",
  "sans",
  "les",
  "des",
  "une",
  "sur",
  "est",
  "sont",
];

const ENGLISH_WORDS = [
  "add",
  "added",
  "fix",
  "fixed",
  "update",
  "updated",
  "remove",
  "removed",
  "change",
  "changed",
  "improve",
  "improved",
  "create",
  "created",
  "implement",
  "implemented",
  "refactor",
  "new",
  "for",
  "with",
  "without",
  "the",
  "and",
];

const EMOJI_TYPE_MAP: Record<string, string> = {
  "✨": "feat",
  "🎉": "feat",
  "🚀": "feat",
  "🐛": "fix",
  "🔧": "fix",
  "📝": "docs",
  "📚": "docs",
  "♻️": "refactor",
  "🔨": "refactor",
  "✅": "test",
  "🧪": "test",
  "🎨": "style",
  "💄": "style",
  "⚡": "perf",
  "🔥": "chore",
  "🗑️": "chore",
  "⬆️": "chore",
  "📦": "chore",
};

function displayWelcome(): void {
  console.clear();
  console.log();
  console.log(
    chalk.magenta.bold(
      "   ██████╗ ██╗████████╗     █████╗  ██████╗ ███████╗███╗   ██╗████████╗"
    )
  );
  console.log(
    chalk.magenta.bold(
      "  ██╔════╝ ██║╚══██╔══╝    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝"
    )
  );
  console.log(
    chalk.magenta.bold(
      "  ██║  ███╗██║   ██║       ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   "
    )
  );
  console.log(
    chalk.magenta.bold(
      "  ██║   ██║██║   ██║       ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   "
    )
  );
  console.log(
    chalk.magenta.bold(
      "  ╚██████╔╝██║   ██║       ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   "
    )
  );
  console.log(
    chalk.magenta.bold(
      "   ╚═════╝ ╚═╝   ╚═╝       ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   "
    )
  );
  console.log();
  console.log(chalk.gray("  Apprentissage du style de commit"));
  console.log();
}

async function getCommitHistory(
  limit: number,
  author?: string
): Promise<string[]> {
  try {
    let command = `git log --format="%s" -n ${limit}`;
    if (author) {
      command += ` --author="${author}"`;
    }
    const { stdout } = await execAsync(command);
    return stdout.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

function detectLanguage(message: string): "fr" | "en" | "unknown" {
  const lowerMessage = message.toLowerCase();

  let frenchScore = 0;
  let englishScore = 0;

  for (const word of FRENCH_WORDS) {
    if (lowerMessage.includes(word)) {
      frenchScore++;
    }
  }

  for (const word of ENGLISH_WORDS) {
    if (lowerMessage.includes(word)) {
      englishScore++;
    }
  }

  if (frenchScore > englishScore && frenchScore > 0) return "fr";
  if (englishScore > frenchScore && englishScore > 0) return "en";
  return "unknown";
}

function extractEmoji(message: string): {
  hasEmoji: boolean;
  emoji: string | null;
} {
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u;
  const match = message.match(emojiRegex);

  if (match) {
    return { hasEmoji: true, emoji: match[0] };
  }

  return { hasEmoji: false, emoji: null };
}

function extractConventionalCommit(message: string): {
  type: string | null;
  scope: string | null;
} {
  const conventionalRegex = /^(\w+)(?:\(([^)]+)\))?:\s/;
  const match = message.match(conventionalRegex);

  if (match) {
    return {
      type: match[1].toLowerCase(),
      scope: match[2] || null,
    };
  }

  return { type: null, scope: null };
}

function extractTicketRef(message: string): {
  hasTicketRef: boolean;
  ticketRef: string | null;
  pattern: string | null;
} {
  const patterns = [/([A-Z]{2,10}-\d+)/, /#(\d+)/, /\(#(\d+)\)/];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return {
        hasTicketRef: true,
        ticketRef: match[1] || match[0],
        pattern: pattern.source,
      };
    }
  }

  return { hasTicketRef: false, ticketRef: null, pattern: null };
}

function detectCapitalization(
  message: string
): "lowercase" | "uppercase" | "capitalize" {
  const cleanMessage = message
    .replace(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u, "")
    .replace(/^\w+(\([^)]+\))?:\s*/, "");

  if (!cleanMessage || cleanMessage.length === 0) return "lowercase";

  const firstChar = cleanMessage[0];

  if (
    firstChar === firstChar.toUpperCase() &&
    firstChar !== firstChar.toLowerCase()
  ) {
    return "capitalize";
  }

  return "lowercase";
}

function analyzeCommit(message: string): CommitAnalysis {
  const { hasEmoji, emoji } = extractEmoji(message);
  const { type, scope } = extractConventionalCommit(
    message.replace(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u, "")
  );
  const { hasTicketRef, ticketRef } = extractTicketRef(message);

  return {
    message,
    type,
    scope,
    hasEmoji,
    emoji,
    language: detectLanguage(message),
    length: message.length,
    hasTicketRef,
    ticketRef,
    capitalization: detectCapitalization(message),
  };
}

function aggregateAnalysis(analyses: CommitAnalysis[]): LearnedStyle {
  const total = analyses.length;

  const langCounts = { fr: 0, en: 0, unknown: 0 };
  analyses.forEach((a) => langCounts[a.language]++);

  let language: "fr" | "en" | "mixed";
  if (langCounts.fr > total * 0.6) language = "fr";
  else if (langCounts.en > total * 0.6) language = "en";
  else language = "mixed";

  const conventionalCount = analyses.filter((a) => a.type !== null).length;
  let format: "conventional" | "angular" | "semantic" | "free";
  if (conventionalCount > total * 0.5) format = "conventional";
  else format = "free";

  const emojiCount = analyses.filter((a) => a.hasEmoji).length;
  const useEmojis = emojiCount > total * 0.3;

  const emojiMap: Record<string, string> = {};
  if (useEmojis) {
    analyses.forEach((a) => {
      if (a.emoji && a.type) {
        emojiMap[a.type] = a.emoji;
      }
    });
  }

  const scopeSet = new Set<string>();
  analyses.forEach((a) => {
    if (a.scope) scopeSet.add(a.scope);
  });

  const lengths = analyses.map((a) => a.length);
  const averageLength = Math.round(lengths.reduce((a, b) => a + b, 0) / total);
  const maxLength = Math.max(...lengths);

  const capCounts = { lowercase: 0, uppercase: 0, capitalize: 0 };
  analyses.forEach((a) => capCounts[a.capitalization]++);
  const capitalization = Object.entries(capCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0] as "lowercase" | "uppercase" | "capitalize";

  const ticketCount = analyses.filter((a) => a.hasTicketRef).length;
  const usesTicketRef = ticketCount > total * 0.2;

  let ticketPattern: string | null = null;
  if (usesTicketRef) {
    const ticketRefs = analyses
      .filter((a) => a.ticketRef)
      .map((a) => a.ticketRef!);
    if (ticketRefs.some((t) => /[A-Z]{2,10}-\d+/.test(t))) {
      ticketPattern = "[A-Z]{2,10}-\\d+";
    } else if (ticketRefs.some((t) => /^\d+$/.test(t))) {
      ticketPattern = "#\\d+";
    }
  }

  return {
    language,
    format,
    useEmojis,
    emojiMap,
    scopes: Array.from(scopeSet),
    averageLength,
    maxLength: Math.min(maxLength, 100),
    capitalization,
    usesTicketRef,
    ticketPattern,
    tense: "imperative",
    analyzedCommits: total,
    analyzedAt: new Date().toISOString(),
  };
}

function displayResults(style: LearnedStyle): void {
  console.log();
  console.log(
    chalk.cyan.bold(
      "  ╔═══════════════════════════════════════════════════════╗"
    )
  );
  console.log(
    chalk.cyan.bold("  ║") +
      chalk.yellow.bold(
        "            📊 STYLE DÉTECTÉ                          "
      ) +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold(
      "  ╠═══════════════════════════════════════════════════════╣"
    )
  );
  console.log(
    chalk.cyan.bold("  ║") +
      `  ${chalk.white("Langue")}           │  ${
        style.language === "fr"
          ? "🇫🇷 Français"
          : style.language === "en"
          ? "🇬🇧 English"
          : "🌍 Mixte"
      }`.padEnd(63) +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold("  ║") +
      `  ${chalk.white("Format")}           │  ${
        style.format === "conventional"
          ? "✅ Conventional Commits"
          : "📝 Format libre"
      }`.padEnd(63) +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold("  ║") +
      `  ${chalk.white("Emojis")}           │  ${
        style.useEmojis ? "✨ Oui" : "❌ Non"
      }`.padEnd(63) +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold("  ║") +
      `  ${chalk.white("Longueur moyenne")} │  ${
        style.averageLength
      } caractères`.padEnd(52) +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold("  ║") +
      `  ${chalk.white("Majuscule")}        │  ${
        style.capitalization === "capitalize"
          ? "Oui (première lettre)"
          : "Non (minuscule)"
      }`.padEnd(52) +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold("  ║") +
      `  ${chalk.white("Réf. tickets")}     │  ${
        style.usesTicketRef ? "✅ Oui" : "❌ Non"
      }`.padEnd(63) +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold(
      "  ╠═══════════════════════════════════════════════════════╣"
    )
  );

  if (style.scopes.length > 0) {
    console.log(
      chalk.cyan.bold("  ║") +
        chalk.yellow.bold(
          "            📁 SCOPES UTILISÉS                        "
        ) +
        chalk.cyan.bold("║")
    );
    console.log(
      chalk.cyan.bold("  ║") +
        `  ${chalk.gray(style.scopes.slice(0, 8).join(", "))}`.padEnd(63) +
        chalk.cyan.bold("║")
    );
    console.log(
      chalk.cyan.bold(
        "  ╠═══════════════════════════════════════════════════════╣"
      )
    );
  }

  if (style.useEmojis && Object.keys(style.emojiMap).length > 0) {
    console.log(
      chalk.cyan.bold("  ║") +
        chalk.yellow.bold(
          "            😀 EMOJIS DÉTECTÉS                        "
        ) +
        chalk.cyan.bold("║")
    );
    const emojiEntries = Object.entries(style.emojiMap).slice(0, 4);
    emojiEntries.forEach(([type, emoji]) => {
      console.log(
        chalk.cyan.bold("  ║") +
          `  ${emoji}  →  ${type}`.padEnd(56) +
          chalk.cyan.bold("║")
      );
    });
    console.log(
      chalk.cyan.bold(
        "  ╠═══════════════════════════════════════════════════════╣"
      )
    );
  }

  console.log(
    chalk.cyan.bold("  ║") +
      `  ${chalk.gray(`Analysé: ${style.analyzedCommits} commits`)}`.padEnd(
        63
      ) +
      chalk.cyan.bold("║")
  );
  console.log(
    chalk.cyan.bold(
      "  ╚═══════════════════════════════════════════════════════╝"
    )
  );
  console.log();
}

function saveStyle(style: LearnedStyle): string {
  const gitAgentDir = path.join(process.cwd(), ".git-agent");
  const stylePath = path.join(gitAgentDir, "learned-style.json");

  if (!fs.existsSync(gitAgentDir)) {
    fs.mkdirSync(gitAgentDir, { recursive: true });
  }

  fs.writeFileSync(stylePath, JSON.stringify(style, null, 2));

  const gitignorePath = path.join(process.cwd(), ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    if (!gitignoreContent.includes(".git-agent/")) {
      fs.appendFileSync(gitignorePath, "\n# Git Agent\n.git-agent/\n");
    }
  }

  return stylePath;
}

export async function learnCommand(
  options: { commits?: number; author?: string; reset?: boolean } = {}
): Promise<void> {
  displayWelcome();

  const limit = options.commits || 100;
  const author = options.author;

  if (options.reset) {
    const stylePath = path.join(
      process.cwd(),
      ".git-agent",
      "learned-style.json"
    );
    if (fs.existsSync(stylePath)) {
      fs.unlinkSync(stylePath);
      console.log(chalk.green("  ✓ Style réinitialisé\n"));
    }
    return;
  }

  const spinner = ora({
    text: `Analyse de ${limit} commits${author ? ` de ${author}` : ""}...`,
    prefixText: "  ",
  }).start();

  const commits = await getCommitHistory(limit, author);

  if (commits.length === 0) {
    spinner.fail("Aucun commit trouvé");
    console.log(
      chalk.yellow(
        "\n  Vérifiez que vous êtes dans un repository git avec des commits.\n"
      )
    );
    return;
  }

  spinner.text = `Analyse de ${commits.length} commits...`;

  const analyses = commits.map(analyzeCommit);

  const style = aggregateAnalysis(analyses);

  spinner.succeed(`${commits.length} commits analysés`);

  displayResults(style);

  const savedPath = saveStyle(style);
  console.log(chalk.green(`  ✓ Profil sauvegardé: ${chalk.gray(savedPath)}`));
  console.log();
  console.log(
    chalk.gray(
      "  Le style sera utilisé automatiquement lors de vos prochains commits."
    )
  );
  console.log();
}
