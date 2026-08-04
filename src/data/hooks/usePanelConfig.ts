import type { RequestState } from "../../domain/types";
import type { PanelConfig } from "../../config/schemas/panel.schema";
import { useDataProvider } from "../DataProviderContext";
import { useAsyncRequest } from "./useAsyncRequest";

export function usePanelConfig(panelId: string): RequestState<PanelConfig> {
  const provider = useDataProvider();

  return useAsyncRequest<PanelConfig>(() => provider.getPanelConfig(panelId), [provider, panelId]);
}
