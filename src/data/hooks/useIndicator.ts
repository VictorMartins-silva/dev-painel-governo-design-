import type { IndicatorData, MetricQuery, RequestState } from "../../domain/types";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useIndicator(query: MetricQuery): RequestState<IndicatorData> {
  const provider = useDataProvider();
  const cacheKey = JSON.stringify(query);

  return useAsyncRequest<IndicatorData>(
    () => provider.getIndicator(query).then((envelope) => envelope.data),
    [provider, cacheKey],
    (data) => data.value === null,
  );
}
