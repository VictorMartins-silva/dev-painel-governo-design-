export function matchesFilters(
  row: Record<string, unknown>,
  filters: Record<string, string[]>,
): boolean {
  return Object.entries(filters).every(([field, allowed]) => {
    if (!allowed || allowed.length === 0) return true;
    if (!(field in row)) return true;
    return allowed.includes(String(row[field]));
  });
}
