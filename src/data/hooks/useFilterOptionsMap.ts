import type { FilterOption, RequestState } from "../../domain/types";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useFilterOptionsMap(
  panelId: string,
  filterIds: string[],
): RequestState<Record<string, FilterOption[]>> {
  const provider = useDataProvider();
  const idsKey = filterIds.join(",");

  return useAsyncRequest<Record<string, FilterOption[]>>(async () => {
    const entries = await Promise.all(
      filterIds.map(async (filterId) => {
        const options = await provider.getFilterOptions(panelId, filterId);
        return [filterId, options] as const;
      }),
    );
    return Object.fromEntries(entries);
  }, [provider, panelId, idsKey]);
}
