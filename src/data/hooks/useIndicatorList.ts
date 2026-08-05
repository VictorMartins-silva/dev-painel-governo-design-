import type { RequestState } from "../../domain/types";
import type { IndicatorSummary } from "../provider";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useIndicatorList(): RequestState<IndicatorSummary[]> {
  const provider = useDataProvider();

  return useAsyncRequest<IndicatorSummary[]>(
    () => provider.listIndicators(),
    [provider],
    (data) => data.length === 0,
  );
}
