import { useMemo } from "react";
import { FilterBar } from "../components/filters/FilterBar";
import { useFilterOptionsMap } from "../data/hooks/useFilterOptionsMap";
import { useFilterContext } from "./FilterContext";

export function PanelFilterBar() {
  const { panelId, filters, values, setFilterValues, clearFilters } = useFilterContext();
  const filterIds = useMemo(() => filters.map((filter) => filter.id), [filters]);
  const optionsState = useFilterOptionsMap(panelId, filterIds);
  const optionsByFilterId = optionsState.status === "success" ? optionsState.data : {};

  if (filters.length === 0) return null;

  return (
    <FilterBar
      filters={filters}
      values={values}
      optionsByFilterId={optionsByFilterId}
      onChange={setFilterValues}
      onClear={clearFilters}
    />
  );
}
