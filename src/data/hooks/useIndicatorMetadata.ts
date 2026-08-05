import type { RequestState } from "../../domain/types";
import type { IndicatorCatalogEntry } from "../../config/schemas/indicator.schema";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useIndicatorMetadata(indicatorId: string): RequestState<IndicatorCatalogEntry> {
  const provider = useDataProvider();

  return useAsyncRequest<IndicatorCatalogEntry>(
    () => provider.getIndicatorMetadata(indicatorId),
    [provider, indicatorId],
  );
}
