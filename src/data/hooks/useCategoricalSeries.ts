import type { CategoricalPoint, MetricQuery, RequestState } from "../../domain/types";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useCategoricalSeries(query: MetricQuery): RequestState<CategoricalPoint[]> {
  const provider = useDataProvider();
  const cacheKey = JSON.stringify(query);

  return useAsyncRequest<CategoricalPoint[]>(
    () => provider.getCategoricalSeries(query).then((envelope) => envelope.data),
    [provider, cacheKey],
    (data) => data.length === 0,
  );
}
