import type { parsePanelConfig } from "../../config/schemas/panel.schema";

export function buildFieldErrors(result: ReturnType<typeof parsePanelConfig>): Map<string, string> {
  const errors = new Map<string, string>();
  if (result.success) return errors;

  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!errors.has(path)) errors.set(path, issue.message);
  }

  return errors;
}
