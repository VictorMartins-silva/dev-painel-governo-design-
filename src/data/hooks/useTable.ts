import type { RequestState, TableData } from "../../domain/types";
import type { TableQuery } from "../provider";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useTable(query: TableQuery): RequestState<TableData> {
  const provider = useDataProvider();
  const cacheKey = JSON.stringify(query);

  return useAsyncRequest<TableData>(
    () => provider.getTable(query).then((envelope) => envelope.data),
    [provider, cacheKey],
    (data) => data.rows.length === 0,
  );
}
