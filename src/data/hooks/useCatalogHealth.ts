import type { RequestState } from "../../domain/types";
import type { CatalogHealth } from "../provider";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useCatalogHealth(): RequestState<CatalogHealth> {
  const provider = useDataProvider();

  return useAsyncRequest<CatalogHealth>(() => provider.getCatalogHealth(), [provider]);
}
