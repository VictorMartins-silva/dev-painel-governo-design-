import type { RequestState } from "../../domain/types";
import type { PanelFreshness } from "../../domain/types";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function usePanelFreshness(panelId: string): RequestState<PanelFreshness> {
  const provider = useDataProvider();

  return useAsyncRequest<PanelFreshness>(
    () => provider.getPanelFreshness(panelId),
    [provider, panelId],
  );
}
