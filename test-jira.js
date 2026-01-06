const { JiraManager } = require("./dist/core/jira-manager.js");
require("dotenv").config();

async function testJira() {
  console.log("🔍 Testing Jira connection...\n");

  const jiraManager = new JiraManager();

  console.log("1. Testing connection...");
  const isConnected = await jiraManager.validateConnection();
  console.log(`   ${isConnected ? "✅" : "❌"} Connection: ${isConnected ? "OK" : "FAILED"}\n`);

  console.log("2. Fetching ticket DP-7...");
  const issue = await jiraManager.getIssue("DP-7");

  if (issue) {
    console.log("   ✅ Ticket found!\n");
    console.log("   📝 Details:");
    console.log(`      Key: ${issue.key}`);
    console.log(`      Summary: ${issue.fields.summary}`);
    console.log(`      Status: ${issue.fields.status.name}`);
    console.log(`      Type: ${issue.fields.issuetype.name}`);
    console.log(`      URL: https://maregaerwan-1754640863893.atlassian.net/browse/${issue.key}\n`);
  } else {
    console.log("   ❌ Ticket not found\n");
  }

  console.log("3. Available issue types in project DP:");
  const issueTypes = await jiraManager.getProjectIssueTypes();
  issueTypes.forEach((type, i) => {
    console.log(`   ${i + 1}. ${type.name} (${type.id})`);
  });
}

testJira().catch(console.error);
