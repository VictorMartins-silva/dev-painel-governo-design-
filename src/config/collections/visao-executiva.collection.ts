import type { CollectionConfig } from "../schemas/collection.schema";

export const visaoExecutiva: CollectionConfig = {
  schemaVersion: 1,
  id: "visao-executiva",
  title: "Visão executiva do gabinete",
  description: "Painéis estratégicos consolidados para acompanhamento do gabinete.",
  timerSeconds: 45,
  refreshEveryCycles: 3,
  panels: [{ panelId: "demografia" }, { panelId: "trabalho-emprego" }],
};
