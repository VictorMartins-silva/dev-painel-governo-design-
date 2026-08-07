const STORAGE_KEY = "admin.settings";

export type Settings = {
  allowedEmbedDomains: string[];
};

/**
 * Domínios liberados por padrão: o Power BI mais os portais de BI da própria Prefeitura de
 * Osasco que aparecem no catálogo importado (docs/catalogo_paineis_osasco.xlsx). Sem eles, os
 * painéis `iframe-externo` seriam salvos normalmente e falhariam só na hora de renderizar.
 */
export const DEFAULT_ALLOWED_EMBED_DOMAINS = [
  "app.powerbi.com",
  "bi.osasco.sp.gov.br",
  "bi156painel.osasco.sp.gov.br",
  "bi-gestaoeducacional.osasco.sp.gov.br",
  "parcerias.osasco.sp.gov.br",
  "protocolo.osasco.sp.gov.br",
];

/**
 * Versão do conjunto de domínios padrão. Incrementar sempre que
 * `DEFAULT_ALLOWED_EMBED_DOMAINS` ganhar entradas novas.
 *
 * 1 — só `app.powerbi.com`.
 * 2 — acrescenta os portais de BI da Prefeitura de Osasco (catálogo importado da planilha).
 *
 * Sem isso, quem já tinha configurações gravadas no localStorage (qualquer visita anterior a
 * /admin/configuracoes) continuaria preso à allowlist antiga e veria "domínio não permitido" em
 * todos os painéis novos. Na migração, os domínios padrão que faltarem são somados aos que a
 * pessoa já tinha — inclusive um padrão que ela tenha removido de propósito, que volta uma vez.
 */
const DEFAULTS_VERSION = 2;

type StoredSettings = {
  defaultsVersion?: number;
  allowedEmbedDomains: string[];
};

export type SettingsStore = {
  get(): Settings;
  addAllowedEmbedDomain(domain: string): Settings;
  removeAllowedEmbedDomain(domain: string): Settings;
};

function defaults(): Settings {
  return { allowedEmbedDomains: [...DEFAULT_ALLOWED_EMBED_DOMAINS] };
}

function parseStored(raw: string): StoredSettings | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Array.isArray((parsed as StoredSettings).allowedEmbedDomains)
    ) {
      return parsed as StoredSettings;
    }
    return null;
  } catch {
    return null;
  }
}

function writeSettings(storage: Storage, settings: Settings): void {
  const stored: StoredSettings = {
    defaultsVersion: DEFAULTS_VERSION,
    allowedEmbedDomains: settings.allowedEmbedDomains,
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

function readSettings(storage: Storage): Settings {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return defaults();

  const stored = parseStored(raw);
  if (!stored) return defaults();

  const current: Settings = { allowedEmbedDomains: [...stored.allowedEmbedDomains] };
  // Configurações gravadas antes deste campo existir são, por definição, da versão 1.
  if ((stored.defaultsVersion ?? 1) >= DEFAULTS_VERSION) return current;

  const faltando = DEFAULT_ALLOWED_EMBED_DOMAINS.filter(
    (domain) => !current.allowedEmbedDomains.includes(domain),
  );
  const migrated: Settings = {
    allowedEmbedDomains: [...current.allowedEmbedDomains, ...faltando],
  };
  writeSettings(storage, migrated);
  return migrated;
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
