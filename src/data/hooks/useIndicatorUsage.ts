import type { RequestState } from "../../domain/types";
import type { IndicatorUsageEntry } from "../../config/indicatorUsage";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useIndicatorUsage(indicatorId: string): RequestState<IndicatorUsageEntry[]> {
  const provider = useDataProvider();

  return useAsyncRequest<IndicatorUsageEntry[]>(
    () => provider.getIndicatorUsage(indicatorId),
    [provider, indicatorId],
  );
}
