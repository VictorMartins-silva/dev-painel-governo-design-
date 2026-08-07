/**
 * Mapeamento best-effort entre a rota atual e a equivalente no outro ambiente (consumo ↔
 * configuração). Quando não há equivalente óbvio, cai na raiz do ambiente de destino.
 */
export function toAdminPath(pathname: string): string {
  const panelMatch = pathname.match(/^\/paineis\/([^/]+)$/);
  if (panelMatch) return `/admin/paineis/${panelMatch[1]}`;
  if (pathname === "/paineis") return "/admin/paineis";

  const collectionMatch = pathname.match(/^\/sala\/([^/]+)$/);
  if (collectionMatch) return `/admin/colecoes/${collectionMatch[1]}`;
  if (pathname === "/sala") return "/admin/colecoes";

  return "/admin/paineis";
}

export function toPublicPath(pathname: string): string {
  const panelMatch = pathname.match(/^\/admin\/paineis\/([^/]+)$/);
  if (panelMatch && panelMatch[1] !== "novo") return `/paineis/${panelMatch[1]}`;
  if (pathname === "/admin" || pathname === "/admin/paineis") return "/paineis";

  const collectionMatch = pathname.match(/^\/admin\/colecoes\/([^/]+)$/);
  if (collectionMatch && collectionMatch[1] !== "novo") return `/sala/${collectionMatch[1]}`;
  if (pathname === "/admin/colecoes") return "/sala";

  return "/paineis";
}
