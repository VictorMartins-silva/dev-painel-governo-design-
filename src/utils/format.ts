import type { FormatType } from "../domain/types";

const LOCALE = "pt-BR";

const integerFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const decimalFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});
const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "BRL",
});

export function formatValue(value: string | number | null, type: FormatType): string {
  if (value === null || value === undefined) return "—";

  if (type === "text") return String(value);

  if (type === "date") {
    const isDateOnly = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
    const date = isDateOnly ? new Date(`${value}T00:00:00`) : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(LOCALE).format(date);
  }

  const numericValue = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(numericValue)) return String(value);

  switch (type) {
    case "integer":
      return integerFormatter.format(numericValue);
    case "decimal":
      return decimalFormatter.format(numericValue);
    case "percent":
      return percentFormatter.format(numericValue);
    case "currency":
      return currencyFormatter.format(numericValue);
    default:
      return String(value);
  }
}
