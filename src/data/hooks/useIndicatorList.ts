import type { RequestState } from "../../domain/types";
import type { IndicatorCatalogEntry } from "../../config/schemas/indicator.schema";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useIndicatorList(): RequestState<IndicatorCatalogEntry[]> {
  const provider = useDataProvider();

  return useAsyncRequest<IndicatorCatalogEntry[]>(
    () => provider.listIndicators(),
    [provider],
    (data) => data.length === 0,
  );
}
