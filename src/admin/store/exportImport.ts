import { parsePanelConfig, type PanelConfig } from "../../config/schemas/panel.schema";

export function serializePanelConfig(config: PanelConfig): string {
  return `${JSON.stringify(config, null, 2)}\n`;
}

export function downloadPanelConfig(config: PanelConfig): void {
  const blob = new Blob([serializePanelConfig(config)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${config.id}.panel.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export type ImportResult = { ok: true; config: PanelConfig } | { ok: false; error: string };

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function readPanelConfigFile(file: File): Promise<ImportResult> {
  let text: string;
  try {
    text = await readFileAsText(file);
  } catch {
    return { ok: false, error: "Não foi possível ler o arquivo." };
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: "O arquivo não contém um JSON válido." };
  }

  const result = parsePanelConfig(json);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".") || "config"}: ${issue.message}`)
      .join("; ");
    return { ok: false, error: `Configuração inválida — ${message}` };
  }

  return { ok: true, config: result.data };
}
