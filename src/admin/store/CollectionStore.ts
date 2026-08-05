import {
  collectionConfigSchema,
  type CollectionConfig,
} from "../../config/schemas/collection.schema";
import { collectionRegistry, findCollectionConfig } from "../../config/collections";

const STORAGE_KEY = "admin.collections";

export type CollectionOrigin = "static" | "modified" | "custom";

export type CollectionListEntry = {
  config: CollectionConfig;
  origin: CollectionOrigin;
};

export type CollectionStore = {
  list(): CollectionListEntry[];
  get(id: string): CollectionConfig | undefined;
  save(config: CollectionConfig): CollectionConfig;
  restoreOriginal(id: string): void;
};

function readOverlay(storage: Storage): Record<string, CollectionConfig> {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, CollectionConfig>)
      : {};
  } catch {
    return {};
  }
}

function writeOverlay(storage: Storage, overlay: Record<string, CollectionConfig>): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(overlay));
}

/**
 * Overlay de persistência: coleções salvas no localStorage sobrepõem as estáticas do
 * collectionRegistry (por id); a leitura nunca muta o registry, só a escrita local.
 */
export class LocalStorageCollectionStore implements CollectionStore {
  constructor(private readonly storage: Storage = window.localStorage) {}

  list(): CollectionListEntry[] {
    const overlay = readOverlay(this.storage);
    const entries = new Map<string, CollectionListEntry>();

    for (const collection of collectionRegistry) {
      entries.set(collection.id, { config: collection, origin: "static" });
    }

    for (const [id, config] of Object.entries(overlay)) {
      entries.set(id, { config, origin: entries.has(id) ? "modified" : "custom" });
    }

    return Array.from(entries.values());
  }

  get(id: string): CollectionConfig | undefined {
    return readOverlay(this.storage)[id] ?? findCollectionConfig(id);
  }

  save(config: CollectionConfig): CollectionConfig {
    const parsed = collectionConfigSchema.parse(config);
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

/** Instância compartilhada entre o app admin e as páginas públicas da Sala de Situação. */
export const collectionStore: CollectionStore = new LocalStorageCollectionStore();
