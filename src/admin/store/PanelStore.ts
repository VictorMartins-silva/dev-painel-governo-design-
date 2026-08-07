import { panelConfigSchema, type PanelConfig } from "../../config/schemas/panel.schema";
import { panelRegistry, findPanelConfig } from "../../config/panels";

const STORAGE_KEY = "admin.panels";
const DELETED_STORAGE_KEY = "admin.panels.deleted";

export type PanelStore = {
  list(): PanelConfig[];
  get(id: string): PanelConfig | undefined;
  save(config: PanelConfig): PanelConfig;
  remove(id: string): void;
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

function readDeleted(storage: Storage): Set<string> {
  const raw = storage.getItem(DELETED_STORAGE_KEY);
  if (!raw) return new Set();

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? new Set(parsed.filter((id): id is string => typeof id === "string"))
      : new Set();
  } catch {
    return new Set();
  }
}

function writeDeleted(storage: Storage, deleted: Set<string>): void {
  storage.setItem(DELETED_STORAGE_KEY, JSON.stringify(Array.from(deleted)));
}

/**
 * Overlay de persistência: painéis salvos no localStorage sobrepõem os do panelRegistry por id;
 * ids marcados como excluídos ficam ocultos mesmo que ainda existam no registry — não há
 * distinção entre painel importado por código e painel criado pela UI, ambos podem ser
 * editados e excluídos do mesmo jeito.
 */
export class LocalStoragePanelStore implements PanelStore {
  constructor(private readonly storage: Storage = window.localStorage) {}

  list(): PanelConfig[] {
    const overlay = readOverlay(this.storage);
    const deleted = readDeleted(this.storage);
    const entries = new Map<string, PanelConfig>();

    for (const panel of panelRegistry) {
      entries.set(panel.id, panel);
    }

    for (const [id, config] of Object.entries(overlay)) {
      entries.set(id, config);
    }

    for (const id of deleted) {
      entries.delete(id);
    }

    return Array.from(entries.values());
  }

  get(id: string): PanelConfig | undefined {
    if (readDeleted(this.storage).has(id)) return undefined;
    return readOverlay(this.storage)[id] ?? findPanelConfig(id);
  }

  save(config: PanelConfig): PanelConfig {
    const parsed = panelConfigSchema.parse(config);
    const overlay = readOverlay(this.storage);
    overlay[parsed.id] = parsed;
    writeOverlay(this.storage, overlay);

    const deleted = readDeleted(this.storage);
    if (deleted.delete(parsed.id)) {
      writeDeleted(this.storage, deleted);
    }

    return parsed;
  }

  remove(id: string): void {
    const overlay = readOverlay(this.storage);
    if (id in overlay) {
      delete overlay[id];
      writeOverlay(this.storage, overlay);
    }

    const deleted = readDeleted(this.storage);
    deleted.add(id);
    writeDeleted(this.storage, deleted);
  }
}

/** Instância compartilhada entre o app admin e o MockDataProvider — mesma origem de dados (localStorage). */
export const panelStore: PanelStore = new LocalStoragePanelStore();
