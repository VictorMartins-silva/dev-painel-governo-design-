import { useMemo, useState } from "react";
import type { RequestStatus } from "../../domain/types";
import type { IndicatorSummary } from "../../data/provider";
import { FormField } from "./FormField";
import styles from "./IndicatorSelect.module.css";

type IndicatorSelectProps = {
  id: string;
  indicators: IndicatorSummary[];
  status: RequestStatus;
  value: string;
  onChange: (indicator: IndicatorSummary | null) => void;
  error?: string;
};

export function IndicatorSelect({
  id,
  indicators,
  status,
  value,
  onChange,
  error,
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

      <FormField label="Indicador" htmlFor={id} error={error}>
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
