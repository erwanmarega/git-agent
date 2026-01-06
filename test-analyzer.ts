import { ChangeAnalyzer } from "./src/core/change-analyzer";

const analyzer = new ChangeAnalyzer();

const files = [
  "src/api/users.ts",
  "src/api/auth.ts",
  "src/components/UserProfile.vue",
  "src/components/Button.vue",
  "README.md",
  "package.json",
];

const result = analyzer.analyzeFiles(files);

console.log("\n=== ANALYSE DES CHANGEMENTS ===\n");
console.log(`Total files: ${result.totalFiles}`);
console.log(
  `Multiple scopes detected: ${result.hasMultipleScopes ? "YES" : "NO"}\n`
);

console.log("Groups:");
result.groups.forEach((group, index) => {
  console.log(`\n${index + 1}. ${group.label} (${group.category})`);
  group.files.forEach((file) => {
    console.log(`   - ${file}`);
  });
});

if (result.suggestions.length > 0) {
  console.log("\n Suggestions:");
  result.suggestions.forEach((s) => console.log(`  - ${s}`));
}

console.log("\n");
