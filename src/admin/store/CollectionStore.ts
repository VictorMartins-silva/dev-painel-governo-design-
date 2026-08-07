import {
  collectionConfigSchema,
  type CollectionConfig,
} from "../../config/schemas/collection.schema";
import { collectionRegistry, findCollectionConfig } from "../../config/collections";

const STORAGE_KEY = "admin.collections";
const DELETED_STORAGE_KEY = "admin.collections.deleted";

export type CollectionStore = {
  list(): CollectionConfig[];
  get(id: string): CollectionConfig | undefined;
  save(config: CollectionConfig): CollectionConfig;
  remove(id: string): void;
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
 * Overlay de persistência: coleções salvas no localStorage sobrepõem as do collectionRegistry
 * por id; ids marcados como excluídos ficam ocultos mesmo que ainda existam no registry — não
 * há distinção entre coleção importada por código e coleção criada pela UI.
 */
export class LocalStorageCollectionStore implements CollectionStore {
  constructor(private readonly storage: Storage = window.localStorage) {}

  list(): CollectionConfig[] {
    const overlay = readOverlay(this.storage);
    const deleted = readDeleted(this.storage);
    const entries = new Map<string, CollectionConfig>();

    for (const collection of collectionRegistry) {
      entries.set(collection.id, collection);
    }

    for (const [id, config] of Object.entries(overlay)) {
      entries.set(id, config);
    }

    for (const id of deleted) {
      entries.delete(id);
    }

    return Array.from(entries.values());
  }

  get(id: string): CollectionConfig | undefined {
    if (readDeleted(this.storage).has(id)) return undefined;
    return readOverlay(this.storage)[id] ?? findCollectionConfig(id);
  }

  save(config: CollectionConfig): CollectionConfig {
    const parsed = collectionConfigSchema.parse(config);
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

/** Instância compartilhada entre o app admin e as páginas públicas de Apresentações. */
export const collectionStore: CollectionStore = new LocalStorageCollectionStore();
