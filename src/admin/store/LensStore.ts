import { lensConfigSchema, type LensConfig } from "../../config/schemas/lens.schema";

const STORAGE_KEY = "admin.lenses";

export type LensStore = {
  list(): LensConfig[];
  get(id: string): LensConfig | undefined;
  save(config: LensConfig): LensConfig;
  remove(id: string): void;
};

function readAll(storage: Storage): Record<string, LensConfig> {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, LensConfig>)
      : {};
  } catch {
    return {};
  }
}

function writeAll(storage: Storage, lenses: Record<string, LensConfig>): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(lenses));
}

/**
 * Diferente de painéis e coleções, lentes cadastradas não têm par estático no código-fonte:
 * persistem inteiramente no localStorage, sem overlay sobre um registry.
 */
export class LocalStorageLensStore implements LensStore {
  constructor(private readonly storage: Storage = window.localStorage) {}

  list(): LensConfig[] {
    return Object.values(readAll(this.storage));
  }

  get(id: string): LensConfig | undefined {
    return readAll(this.storage)[id];
  }

  save(config: LensConfig): LensConfig {
    const parsed = lensConfigSchema.parse(config);
    const lenses = readAll(this.storage);
    lenses[parsed.id] = parsed;
    writeAll(this.storage, lenses);
    return parsed;
  }

  remove(id: string): void {
    const lenses = readAll(this.storage);
    if (!(id in lenses)) return;
    delete lenses[id];
    writeAll(this.storage, lenses);
  }
}

/** Instância compartilhada entre o app admin e as páginas públicas (Home, Catálogo). */
export const lensStore: LensStore = new LocalStorageLensStore();
