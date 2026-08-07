import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_ALLOWED_EMBED_DOMAINS, LocalStorageSettingsStore } from "./SettingsStore";
import { panelRegistry } from "../../config/panels";

describe("LocalStorageSettingsStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("retorna a allowlist padrão quando não há nada salvo", () => {
    const store = new LocalStorageSettingsStore();
    expect(store.get().allowedEmbedDomains).toEqual(DEFAULT_ALLOWED_EMBED_DOMAINS);
  });

  it("libera por padrão todos os domínios usados pelos painéis do catálogo estático", () => {
    const store = new LocalStorageSettingsStore();
    const allowed = new Set(store.get().allowedEmbedDomains);

    const usados = new Set(panelRegistry.map((panel) => new URL(panel.embed.url).hostname));
    expect([...usados].filter((host) => !allowed.has(host))).toEqual([]);
  });

  it("adiciona um novo domínio permitido e persiste", () => {
    const store = new LocalStorageSettingsStore();
    store.addAllowedEmbedDomain("meudominio.com");

    const reloaded = new LocalStorageSettingsStore();
    expect(reloaded.get().allowedEmbedDomains).toEqual([
      ...DEFAULT_ALLOWED_EMBED_DOMAINS,
      "meudominio.com",
    ]);
  });

  it("não duplica um domínio já existente", () => {
    const store = new LocalStorageSettingsStore();
    store.addAllowedEmbedDomain("app.powerbi.com");

    expect(store.get().allowedEmbedDomains).toEqual(DEFAULT_ALLOWED_EMBED_DOMAINS);
  });

  it("remove um domínio permitido, inclusive um dos padrão", () => {
    const store = new LocalStorageSettingsStore();
    store.removeAllowedEmbedDomain("app.powerbi.com");

    expect(store.get().allowedEmbedDomains).toEqual(
      DEFAULT_ALLOWED_EMBED_DOMAINS.filter((domain) => domain !== "app.powerbi.com"),
    );
  });

  it("ignora um arquivo de configurações corrompido e volta ao padrão", () => {
    window.localStorage.setItem("admin.settings", "não é json");
    const store = new LocalStorageSettingsStore();
    expect(store.get().allowedEmbedDomains).toEqual(DEFAULT_ALLOWED_EMBED_DOMAINS);
  });

  it("acrescenta os domínios padrão novos a configurações salvas antes deles existirem", () => {
    // Formato gravado pela versão anterior do store: sem defaultsVersion, só app.powerbi.com.
    window.localStorage.setItem(
      "admin.settings",
      JSON.stringify({ allowedEmbedDomains: ["app.powerbi.com", "meudominio.com"] }),
    );

    const store = new LocalStorageSettingsStore();
    expect(store.get().allowedEmbedDomains).toEqual([
      "app.powerbi.com",
      "meudominio.com",
      ...DEFAULT_ALLOWED_EMBED_DOMAINS.filter((domain) => domain !== "app.powerbi.com"),
    ]);
  });

  it("migra uma única vez: um padrão removido depois da migração continua removido", () => {
    window.localStorage.setItem(
      "admin.settings",
      JSON.stringify({ allowedEmbedDomains: ["app.powerbi.com"] }),
    );

    const store = new LocalStorageSettingsStore();
    store.get();
    store.removeAllowedEmbedDomain("protocolo.osasco.sp.gov.br");

    const reloaded = new LocalStorageSettingsStore();
    expect(reloaded.get().allowedEmbedDomains).not.toContain("protocolo.osasco.sp.gov.br");
  });

  it("não deixa uma leitura mutar a lista padrão compartilhada", () => {
    const store = new LocalStorageSettingsStore();
    store.get().allowedEmbedDomains.push("dominio-injetado.com");

    expect(new LocalStorageSettingsStore().get().allowedEmbedDomains).toEqual(
      DEFAULT_ALLOWED_EMBED_DOMAINS,
    );
  });
});
