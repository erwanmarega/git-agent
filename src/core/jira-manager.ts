export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  projectKey?: string;
}

export interface JiraIssue {
  key: string;
  fields: {
    summary: string;
    description: any;
    status: {
      name: string;
      id: string;
    };
    issuetype: {
      name: string;
      id: string;
    };
  };
}

export interface JiraTransition {
  id: string;
  name: string;
  to: {
    name: string;
    id: string;
  };
}

export interface JiraLinkCommitParams {
  issueKey: string;
  commitSha: string;
  commitMessage: string;
  commitUrl?: string;
  branch: string;
}

export interface JiraLinkPRParams {
  issueKey: string;
  prUrl: string;
  prTitle: string;
  prNumber?: number;
}

export interface TicketExtractionResult {
  ticketId: string | null;
  branch: string;
}

export class JiraManager {
  private config: JiraConfig;
  private authHeader: string;

  constructor(config?: Partial<JiraConfig>) {
    this.config = {
      baseUrl: config?.baseUrl || process.env.JIRA_BASE_URL || "",
      email: config?.email || process.env.JIRA_EMAIL || "",
      apiToken: config?.apiToken || process.env.JIRA_API_TOKEN || "",
      projectKey: config?.projectKey || process.env.JIRA_PROJECT_KEY || "",
    };

    if (!this.config.baseUrl || !this.config.email || !this.config.apiToken) {
      throw new Error("Jira configuration is incomplete");
    }

    this.authHeader = Buffer.from(
      `${this.config.email}:${this.config.apiToken}`
    ).toString("base64");
  }

  extractTicketFromBranch(branchName: string): TicketExtractionResult {
    const patterns = [
      /([A-Z][A-Z0-9]+-\d+)/, 
      /^([A-Z]{2,10}-\d+)/i, 
      /\/([A-Z]{2,10}-\d+)/i,
    ];

    for (const pattern of patterns) {
      const match = branchName.match(pattern);
      if (match) {
        return {
          ticketId: match[1].toUpperCase(),
          branch: branchName,
        };
      }
    }

    return { ticketId: null, branch: branchName };
  }

  isConfigured(): boolean {
    return !!(
      this.config.baseUrl &&
      this.config.email &&
      this.config.apiToken
    );
  }

  async validateConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest("/rest/api/3/myself", "GET");
      return response !== null;
    } catch (error) {
      return false;
    }
  }


  async getIssue(issueKey: string): Promise<JiraIssue | null> {
    try {
      const issue = await this.makeRequest(
        `/rest/api/3/issue/${issueKey}`,
        "GET"
      );
      return issue as JiraIssue;
    } catch (error) {
      this.handleJiraError(error);
      return null;
    }
  }


  async getTransitions(issueKey: string): Promise<JiraTransition[]> {
    try {
      const response = await this.makeRequest(
        `/rest/api/3/issue/${issueKey}/transitions`,
        "GET"
      );
      return response.transitions || [];
    } catch (error) {
      this.handleJiraError(error);
      return [];
    }
  }

  async transitionIssue(
    issueKey: string,
    transitionId: string
  ): Promise<boolean> {
    try {
      await this.makeRequest(
        `/rest/api/3/issue/${issueKey}/transitions`,
        "POST",
        { transition: { id: transitionId } }
      );
      return true;
    } catch (error) {
      this.handleJiraError(error);
      return false;
    }
  }

  findTransitionByName(
    transitions: JiraTransition[],
    targetStatus: string
  ): JiraTransition | null {
    const normalized = targetStatus.toLowerCase();
    return (
      transitions.find(
        (t) =>
          t.to.name.toLowerCase() === normalized ||
          t.name.toLowerCase().includes(normalized)
      ) || null
    );
  }

  async addComment(issueKey: string, comment: string): Promise<boolean> {
    try {
      await this.makeRequest(`/rest/api/3/issue/${issueKey}/comment`, "POST", {
        body: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: comment }],
            },
          ],
        },
      });
      return true;
    } catch (error) {
      this.handleJiraError(error);
      return false;
    }
  }

 
  async linkCommit(params: JiraLinkCommitParams): Promise<boolean> {
    const { issueKey, commitSha, commitMessage, commitUrl, branch } = params;

    const comment = this.formatCommitComment(
      commitSha,
      commitMessage,
      commitUrl,
      branch
    );

    return this.addComment(issueKey, comment);
  }


  async linkPR(params: JiraLinkPRParams): Promise<boolean> {
    const { issueKey, prUrl, prTitle, prNumber } = params;

    try {
      await this.makeRequest(
        `/rest/api/3/issue/${issueKey}/remotelink`,
        "POST",
        {
          object: {
            url: prUrl,
            title: `PR${prNumber ? ` #${prNumber}` : ""}: ${prTitle}`,
            icon: {
              url16x16: "https://github.com/favicon.ico",
            },
          },
        }
      );

      const comment = this.formatPRComment(prUrl, prTitle, prNumber);
      await this.addComment(issueKey, comment);

      return true;
    } catch (error) {
      this.handleJiraError(error);
      return false;
    }
  }

  /**
   * Get available issue types for the project
   */
  async getProjectIssueTypes(): Promise<any[]> {
    try {
      const response = await this.makeRequest(
        `/rest/api/3/project/${this.config.projectKey}`,
        "GET"
      );
      return response.issueTypes || [];
    } catch (error) {
      return [];
    }
  }

  async createIssue(
    summary: string,
    description: string,
    issueType?: string
  ): Promise<string | null> {
    try {
      let finalIssueType = issueType;

      if (!finalIssueType) {
        const issueTypes = await this.getProjectIssueTypes();
        if (issueTypes.length === 0) {
          throw new Error("No issue types available for this project");
        }

        const preferredTypes = ["Story", "Task", "Bug"];
        const preferred = issueTypes.find((type) =>
          preferredTypes.includes(type.name)
        );
        finalIssueType = preferred ? preferred.name : issueTypes[0].name;
      }

      const response = await this.makeRequest("/rest/api/3/issue", "POST", {
        fields: {
          project: { key: this.config.projectKey },
          summary,
          description: {
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: description }],
              },
            ],
          },
          issuetype: { name: finalIssueType },
        },
      });
      return response.key || null;
    } catch (error) {
      console.error("Jira createIssue error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }
      this.handleJiraError(error);
      return null;
    }
  }

 
  async transitionOnCommit(issueKey: string): Promise<boolean> {
    const transitions = await this.getTransitions(issueKey);

    const targetTransition =
      this.findTransitionByName(transitions, "In Progress") ||
      this.findTransitionByName(transitions, "In Development") ||
      this.findTransitionByName(transitions, "Start Progress");

    if (targetTransition) {
      return this.transitionIssue(issueKey, targetTransition.id);
    }

    return false;
  }

  
  async transitionOnPR(issueKey: string): Promise<boolean> {
    const transitions = await this.getTransitions(issueKey);

    const targetTransition =
      this.findTransitionByName(transitions, "In Review") ||
      this.findTransitionByName(transitions, "Code Review") ||
      this.findTransitionByName(transitions, "Review");

    if (targetTransition) {
      return this.transitionIssue(issueKey, targetTransition.id);
    }

    return false;
  }

  private async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" = "GET",
    body?: any
  ): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const options: any = {
      method,
      headers: {
        Authorization: `Basic ${this.authHeader}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorDetails = "";
      try {
        const errorBody = await response.json();
        errorDetails = JSON.stringify(errorBody, null, 2);
      } catch {
        errorDetails = await response.text();
      }
      const error: any = new Error(
        `Jira API error: ${response.statusText}\nDetails: ${errorDetails}`
      );
      error.code = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null; 
    }

    return response.json();
  }


  private formatCommitComment(
    sha: string,
    message: string,
    url?: string,
    branch?: string
  ): string {
    const shortSha = sha.substring(0, 7);
    let comment = `Commit: ${shortSha}\n${message}`;

    if (branch) {
      comment += `\nBranch: ${branch}`;
    }

    if (url) {
      comment += `\nView: ${url}`;
    }

    return comment;
  }

  
  private formatPRComment(url: string, title: string, number?: number): string {
    return `Pull Request${number ? ` #${number}` : ""} created:\n${title}\n${url}`;
  }

 
  private handleJiraError(error: any): void {
    const code = error.code || 0;

    if (code === 401 || code === 403) {
     
    } else if (code === 404) {
    } else if (code === 400) {
    }
  }
}
