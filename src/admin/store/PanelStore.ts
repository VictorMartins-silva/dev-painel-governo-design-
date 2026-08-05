import { panelConfigSchema, type PanelConfig } from "../../config/schemas/panel.schema";
import { panelRegistry, findPanelConfig } from "../../config/panels";

const STORAGE_KEY = "admin.panels";

export type PanelOrigin = "static" | "modified" | "custom";

export type PanelListEntry = {
  config: PanelConfig;
  origin: PanelOrigin;
};

export type PanelStore = {
  list(): PanelListEntry[];
  get(id: string): PanelConfig | undefined;
  save(config: PanelConfig): PanelConfig;
  restoreOriginal(id: string): void;
};

function readOverlay(storage: Storage): Record<string, PanelConfig> {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, PanelConfig>)
      : {};
  } catch {
    return {};
  }
}

function writeOverlay(storage: Storage, overlay: Record<string, PanelConfig>): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(overlay));
}

/**
 * Overlay de persistência: painéis salvos no localStorage sobrepõem os estáticos do
 * panelRegistry (por id); a leitura nunca muta o registry, só a escrita local.
 */
export class LocalStoragePanelStore implements PanelStore {
  constructor(private readonly storage: Storage = window.localStorage) {}

  list(): PanelListEntry[] {
    const overlay = readOverlay(this.storage);
    const entries = new Map<string, PanelListEntry>();

    for (const panel of panelRegistry) {
      entries.set(panel.id, { config: panel, origin: "static" });
    }

    for (const [id, config] of Object.entries(overlay)) {
      entries.set(id, { config, origin: entries.has(id) ? "modified" : "custom" });
    }

    return Array.from(entries.values());
  }

  get(id: string): PanelConfig | undefined {
    return readOverlay(this.storage)[id] ?? findPanelConfig(id);
  }

  save(config: PanelConfig): PanelConfig {
    const parsed = panelConfigSchema.parse(config);
    const overlay = readOverlay(this.storage);
    overlay[parsed.id] = parsed;
    writeOverlay(this.storage, overlay);
    return parsed;
  }

  restoreOriginal(id: string): void {
    const overlay = readOverlay(this.storage);
    if (!(id in overlay)) return;
    const rest = Object.fromEntries(
      Object.entries(overlay).filter(([overlayId]) => overlayId !== id),
    );
    writeOverlay(this.storage, rest);
  }
}

/** Instância compartilhada entre o app admin e o MockDataProvider — mesma origem de dados (localStorage). */
export const panelStore: PanelStore = new LocalStoragePanelStore();
