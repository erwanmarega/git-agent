export interface TodoDetection {
  type: "TODO" | "FIXME" | "HACK" | "XXX";
  file: string;
  line: string;
  message: string;
}

export class TodosDetector {
  detect(diff: string): TodoDetection[] {
    const detections: TodoDetection[] = [];

    const patterns = [
      { type: "TODO" as const, regex: /\/\/\s*TODO[:\s](.+)/gi },
      { type: "FIXME" as const, regex: /\/\/\s*FIXME[:\s](.+)/gi },
      { type: "HACK" as const, regex: /\/\/\s*HACK[:\s](.+)/gi },
      { type: "XXX" as const, regex: /\/\/\s*XXX[:\s](.+)/gi },
    ];

    const lines = diff.split("\n");
    let currentFile = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("diff --git")) {
        const match = line.match(/diff --git a\/(.+) b\/.+/);
        if (match) {
          currentFile = match[1];
        }
      }

      if (line.startsWith("+")) {
        const content = line.substring(1);

        for (const { type, regex } of patterns) {
          const matches = content.matchAll(regex);
          for (const match of matches) {
            detections.push({
              type,
              file: currentFile || "unknown",
              line: content.trim(),
              message: match[1]?.trim() || "No description",
            });
          }
        }
      }
    }

    return detections;
  }

  groupByFile(detections: TodoDetection[]): Map<string, TodoDetection[]> {
    const grouped = new Map<string, TodoDetection[]>();

    for (const detection of detections) {
      if (!grouped.has(detection.file)) {
        grouped.set(detection.file, []);
      }
      grouped.get(detection.file)!.push(detection);
    }

    return grouped;
  }
  countByType(detections: TodoDetection[]): Record<string, number> {
    const counts: Record<string, number> = {
      TODO: 0,
      FIXME: 0,
      HACK: 0,
      XXX: 0,
    };

    for (const detection of detections) {
      counts[detection.type]++;
    }

    return counts;
  }
}
