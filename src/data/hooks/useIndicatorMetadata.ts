import type { IndicatorMetadata, RequestState } from "../../domain/types";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useIndicatorMetadata(metricId: string): RequestState<IndicatorMetadata> {
  const provider = useDataProvider();

  return useAsyncRequest<IndicatorMetadata>(
    () => provider.getIndicatorMetadata(metricId),
    [provider, metricId],
  );
}
