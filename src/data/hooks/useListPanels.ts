import type { RequestState } from "../../domain/types";
import type { PanelSummary } from "../provider";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function useListPanels(): RequestState<PanelSummary[]> {
  const provider = useDataProvider();

  return useAsyncRequest<PanelSummary[]>(
    () => provider.listPanels(),
    [provider],
    (data) => data.length === 0,
  );
}
