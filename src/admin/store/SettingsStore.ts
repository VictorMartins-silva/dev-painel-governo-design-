const STORAGE_KEY = "admin.settings";

export type Settings = {
  allowedEmbedDomains: string[];
};

const DEFAULT_SETTINGS: Settings = {
  allowedEmbedDomains: ["app.powerbi.com"],
};

export type SettingsStore = {
  get(): Settings;
  addAllowedEmbedDomain(domain: string): Settings;
  removeAllowedEmbedDomain(domain: string): Settings;
};

function readSettings(storage: Storage): Settings {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Array.isArray((parsed as Settings).allowedEmbedDomains)
    ) {
      return { allowedEmbedDomains: [...(parsed as Settings).allowedEmbedDomains] };
    }
    return { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function writeSettings(storage: Storage, settings: Settings): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/** Overlay de persistência das configurações do admin: mesmo padrão do LocalStoragePanelStore. */
export class LocalStorageSettingsStore implements SettingsStore {
  constructor(private readonly storage: Storage = window.localStorage) {}

  get(): Settings {
    return readSettings(this.storage);
  }

  addAllowedEmbedDomain(domain: string): Settings {
    const trimmed = domain.trim().toLowerCase();
    const current = readSettings(this.storage);
    if (!trimmed || current.allowedEmbedDomains.includes(trimmed)) return current;

    const next: Settings = { allowedEmbedDomains: [...current.allowedEmbedDomains, trimmed] };
    writeSettings(this.storage, next);
    return next;
  }

  removeAllowedEmbedDomain(domain: string): Settings {
    const current = readSettings(this.storage);
    const next: Settings = {
      allowedEmbedDomains: current.allowedEmbedDomains.filter((existing) => existing !== domain),
    };
    writeSettings(this.storage, next);
    return next;
  }
}

/** Instância compartilhada entre o app admin e a renderização pública (mesma origem de dados, localStorage). */
export const settingsStore: SettingsStore = new LocalStorageSettingsStore();
