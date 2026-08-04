import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { FilterConfig } from "../config/schemas/filters.schema";

type FilterContextValue = {
  panelId: string;
  filters: FilterConfig[];
  values: Record<string, string[]>;
  setFilterValues: (filterId: string, values: string[]) => void;
  clearFilters: () => void;
  queryFilters: Record<string, string[]>;
};

const FilterContext = createContext<FilterContextValue | null>(null);

type FilterProviderProps = {
  panelId: string;
  filters: FilterConfig[];
  children: ReactNode;
};

export function FilterProvider({ panelId, filters, children }: FilterProviderProps) {
  const [values, setValues] = useState<Record<string, string[]>>({});

  function setFilterValues(filterId: string, next: string[]) {
    setValues((current) => ({ ...current, [filterId]: next }));
  }

  function clearFilters() {
    setValues({});
  }

  const queryFilters = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const filter of filters) {
      const active = values[filter.id];
      if (active && active.length > 0) {
        map[filter.dataField] = active;
      }
    }
    return map;
  }, [filters, values]);

  const value: FilterContextValue = {
    panelId,
    filters,
    values,
    setFilterValues,
    clearFilters,
    queryFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilterContext(): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext deve ser usado dentro de <FilterProvider>.");
  }
  return context;
}
