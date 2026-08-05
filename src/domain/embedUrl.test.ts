import { describe, expect, it } from "vitest";
import { validateEmbedUrl } from "./embedUrl";

describe("validateEmbedUrl", () => {
  it("aceita uma URL https cujo hostname está na allowlist", () => {
    const result = validateEmbedUrl("https://app.powerbi.com/view?r=abc", ["app.powerbi.com"]);
    expect(result.ok).toBe(true);
  });

  it("rejeita uma URL malformada", () => {
    const result = validateEmbedUrl("não é uma url", ["app.powerbi.com"]);
    expect(result.ok).toBe(false);
  });

  it("rejeita protocolo http", () => {
    const result = validateEmbedUrl("http://app.powerbi.com/view?r=abc", ["app.powerbi.com"]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/https/);
    }
  });

  it("rejeita um hostname fora da allowlist", () => {
    const result = validateEmbedUrl("https://malicioso.example.com/x", ["app.powerbi.com"]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/domínio/);
    }
  });
});
