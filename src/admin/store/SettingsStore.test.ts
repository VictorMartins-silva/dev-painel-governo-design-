import { beforeEach, describe, expect, it } from "vitest";
import { LocalStorageSettingsStore } from "./SettingsStore";

describe("LocalStorageSettingsStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("retorna app.powerbi.com como domínio permitido por padrão quando não há nada salvo", () => {
    const store = new LocalStorageSettingsStore();
    expect(store.get().allowedEmbedDomains).toEqual(["app.powerbi.com"]);
  });

  it("adiciona um novo domínio permitido e persiste", () => {
    const store = new LocalStorageSettingsStore();
    store.addAllowedEmbedDomain("meudominio.com");

    const reloaded = new LocalStorageSettingsStore();
    expect(reloaded.get().allowedEmbedDomains).toEqual(["app.powerbi.com", "meudominio.com"]);
  });

  it("não duplica um domínio já existente", () => {
    const store = new LocalStorageSettingsStore();
    store.addAllowedEmbedDomain("app.powerbi.com");

    expect(store.get().allowedEmbedDomains).toEqual(["app.powerbi.com"]);
  });

  it("remove um domínio permitido", () => {
    const store = new LocalStorageSettingsStore();
    store.removeAllowedEmbedDomain("app.powerbi.com");

    expect(store.get().allowedEmbedDomains).toEqual([]);
  });

  it("ignora um arquivo de configurações corrompido e volta ao padrão", () => {
    window.localStorage.setItem("admin.settings", "não é json");
    const store = new LocalStorageSettingsStore();
    expect(store.get().allowedEmbedDomains).toEqual(["app.powerbi.com"]);
  });
});
