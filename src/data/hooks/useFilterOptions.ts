import type { FilterOption, RequestState } from "../../domain/types";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useFilterOptions(panelId: string, filterId: string): RequestState<FilterOption[]> {
  const provider = useDataProvider();

  return useAsyncRequest<FilterOption[]>(
    () => provider.getFilterOptions(panelId, filterId),
    [provider, panelId, filterId],
    (data) => data.length === 0,
  );
}
