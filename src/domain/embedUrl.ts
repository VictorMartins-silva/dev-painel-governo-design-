export type EmbedUrlValidation = { ok: true } | { ok: false; reason: string };

/** Exige https e um hostname presente na allowlist configurável em /admin/configuracoes. */
export function validateEmbedUrl(url: string, allowedDomains: string[]): EmbedUrlValidation {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, reason: "Informe uma URL válida." };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "A URL deve usar https." };
  }

  if (!allowedDomains.includes(parsed.hostname)) {
    return {
      ok: false,
      reason: `O domínio "${parsed.hostname}" não está na lista de domínios permitidos.`,
    };
  }

  return { ok: true };
}
