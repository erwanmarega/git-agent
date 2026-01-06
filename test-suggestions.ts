import { SuggestionsEngine } from "./src/core/suggestions";

const engine = new SuggestionsEngine();

const files = ["src/api/users.ts", ".env.local", "src/config/secrets.json"];

const diff = `
diff --git a/src/api/users.ts b/src/api/users.ts
@@ -10,0 +11,3 @@
+// TODO: Add input validation
+const API_KEY = "sk-ant-1234567890abcdef";
+const password = "my-secret-password";

diff --git a/.env.local b/.env.local
@@ -0,0 +1,2 @@
+DATABASE_URL=postgres://localhost
+SECRET_KEY=super-secret-key

diff --git a/src/config/secrets.json b/src/config/secrets.json
@@ -0,0 +1,3 @@
+{
+  "apiKey": "secret-api-key-123"
+}
`;

const result = engine.analyze(files, diff);

console.log("\n=== SUGGESTIONS ANALYSIS ===\n");

console.log(`Total issues detected: ${result.totalIssues}`);
console.log(`High severity: ${result.hasHighSeverity ? "YES" : "NO"}`);
console.log(`Medium severity: ${result.hasMediumSeverity ? "YES" : "NO"}\n`);

if (result.secrets.length > 0) {
  console.log(" SECURITY ISSUES:\n");
  result.secrets.forEach((secret, i) => {
    console.log(
      `${i + 1}. [${secret.severity.toUpperCase()}] ${secret.message}`
    );
    console.log(`   File: ${secret.file}`);
    console.log(`   Type: ${secret.type}`);
    console.log(`   Suggestion: ${secret.suggestion}\n`);
  });
}

if (result.todos.length > 0) {
  console.log(" TODOs/FIXMEs:\n");
  result.todos.forEach((todo, i) => {
    console.log(`${i + 1}. [${todo.type}] ${todo.message}`);
    console.log(`   File: ${todo.file}`);
    console.log(`   Line: ${todo.line}\n`);
  });
}

const summary = engine.getSummary(result);
console.log(" SUMMARY:");
summary.forEach((s) => console.log(`  - ${s}`));

console.log("\n");
