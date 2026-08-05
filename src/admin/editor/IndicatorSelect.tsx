import { useMemo, useState } from "react";
import type { RequestStatus } from "../../domain/types";
import type { IndicatorCatalogEntry } from "../../config/schemas/indicator.schema";
import { FormField } from "./FormField";
import styles from "./IndicatorSelect.module.css";

type IndicatorSelectProps = {
  id: string;
  indicators: IndicatorCatalogEntry[];
  status: RequestStatus;
  value: string;
  onChange: (indicator: IndicatorCatalogEntry | null) => void;
  error?: string;
  warning?: string;
};

export function IndicatorSelect({
  id,
  indicators,
  status,
  value,
  onChange,
  error,
  warning,
}: IndicatorSelectProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return indicators;
    return indicators.filter((indicator) => indicator.name.toLowerCase().includes(term));
  }, [indicators, search]);

  const selected = indicators.find((indicator) => indicator.id === value);
  const options = selected && !filtered.includes(selected) ? [selected, ...filtered] : filtered;

  return (
    <div className={styles.wrapper}>
      <FormField label="Buscar indicador" htmlFor={`${id}-search`}>
        <input
          id={`${id}-search`}
          className={styles.input}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Filtrar por nome..."
        />
      </FormField>

      <FormField label="Indicador" htmlFor={id} error={error} warning={warning}>
        <select
          id={id}
          className={styles.select}
          value={value}
          disabled={status === "loading"}
          onChange={(event) => {
            const next = indicators.find((indicator) => indicator.id === event.target.value);
            onChange(next ?? null);
          }}
        >
          <option value="">
            {status === "loading" ? "Carregando indicadores..." : "Selecione um indicador"}
          </option>
          {options.map((indicator) => (
            <option key={indicator.id} value={indicator.id}>
              {indicator.name}
            </option>
          ))}
        </select>
      </FormField>

      {status === "error" && (
        <p className={styles.blockError} role="alert">
          Não foi possível carregar o catálogo de indicadores.
        </p>
      )}
      {status !== "loading" && indicators.length === 0 && (
        <p className={styles.hint}>Nenhum indicador compatível com este tipo de componente.</p>
      )}
    </div>
  );
}
