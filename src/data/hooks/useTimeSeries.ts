import type { MetricQuery, RequestState, TimeSeriesPoint } from "../../domain/types";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useTimeSeries(query: MetricQuery): RequestState<TimeSeriesPoint[]> {
  const provider = useDataProvider();
  const cacheKey = JSON.stringify(query);

  return useAsyncRequest<TimeSeriesPoint[]>(
    () => provider.getTimeSeries(query).then((envelope) => envelope.data),
    [provider, cacheKey],
    (data) => data.length === 0,
  );
}
