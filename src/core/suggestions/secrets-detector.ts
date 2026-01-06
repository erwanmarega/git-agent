export interface SecretDetection {
  type: "sensitive_file" | "secret_pattern";
  severity: "high" | "medium" | "low";
  file: string;
  message: string;
  suggestion: string;
}

export class SecretsDetector {
  detect(files: string[], diff?: string): SecretDetection[] {
    const detections: SecretDetection[] = [];

    for (const file of files) {
      const sensitiveFileDetection = this.detectSensitiveFile(file);
      if (sensitiveFileDetection) {
        detections.push(sensitiveFileDetection);
      }
    }

    if (diff) {
      const secretPatterns = this.detectSecretPatterns(diff, files);
      detections.push(...secretPatterns);
    }

    return detections;
  }

  private detectSensitiveFile(file: string): SecretDetection | null {
    const sensitiveFiles = [
      { pattern: /\.env$/, name: ".env file" },
      { pattern: /\.env\.local$/, name: ".env.local file" },
      { pattern: /\.env\.production$/, name: ".env.production file" },
      { pattern: /credentials\.json$/, name: "credentials file" },
      { pattern: /secrets\.json$/, name: "secrets file" },
      { pattern: /\.pem$/, name: "private key file" },
      { pattern: /\.key$/, name: "key file" },
      { pattern: /\.p12$/, name: "certificate file" },
      { pattern: /id_rsa$/, name: "SSH private key" },
      { pattern: /\.aws\/credentials$/, name: "AWS credentials" },
    ];

    for (const { pattern, name } of sensitiveFiles) {
      if (pattern.test(file)) {
        return {
          type: "sensitive_file",
          severity: "high",
          file,
          message: `Sensitive file detected: ${name}`,
          suggestion: `Consider removing this file from the commit or adding it to .gitignore`,
        };
      }
    }

    return null;
  }

  private detectSecretPatterns(
    diff: string,
    files: string[]
  ): SecretDetection[] {
    const detections: SecretDetection[] = [];

    const secretPatterns = [
      {
        pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"]([^'"]+)['"]/gi,
        name: "API Key",
        severity: "high" as const,
      },
      {
        pattern: /(?:secret|password|passwd)\s*[:=]\s*['"]([^'"]+)['"]/gi,
        name: "Password/Secret",
        severity: "high" as const,
      },
      {
        pattern: /(?:token|auth[_-]?token)\s*[:=]\s*['"]([^'"]+)['"]/gi,
        name: "Auth Token",
        severity: "high" as const,
      },
      {
        pattern: /sk-[a-zA-Z0-9]{20,}/g,
        name: "API Key (sk- prefix)",
        severity: "high" as const,
      },
      {
        pattern: /(?:private[_-]?key)\s*[:=]\s*['"]([^'"]+)['"]/gi,
        name: "Private Key",
        severity: "high" as const,
      },
      {
        pattern: /Bearer\s+[a-zA-Z0-9\-._~+\/]+=*/g,
        name: "Bearer Token",
        severity: "medium" as const,
      },
    ];

    const lines = diff.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("-")) continue;

      if (line.startsWith("+")) {
        const content = line.substring(1);

        for (const { pattern, name, severity } of secretPatterns) {
          if (pattern.test(content)) {
            detections.push({
              type: "secret_pattern",
              severity,
              file: this.guessFileFromDiff(diff, i),
              message: `Potential ${name} found in code`,
              suggestion: `Avoid hardcoding secrets. Use environment variables instead.`,
            });
            pattern.lastIndex = 0;
          }
        }
      }
    }

    return detections;
  }

  private guessFileFromDiff(diff: string, lineNumber: number): string {
    const lines = diff.split("\n");

    for (let i = lineNumber; i >= 0; i--) {
      const line = lines[i];
      if (line.startsWith("diff --git")) {
        const match = line.match(/diff --git a\/(.+) b\/.+/);
        if (match) {
          return match[1];
        }
      }
    }

    return "unknown file";
  }

  getSummary(detections: SecretDetection[]): {
    high: number;
    medium: number;
    low: number;
  } {
    return {
      high: detections.filter((d) => d.severity === "high").length,
      medium: detections.filter((d) => d.severity === "medium").length,
      low: detections.filter((d) => d.severity === "low").length,
    };
  }
}
