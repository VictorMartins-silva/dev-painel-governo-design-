import type { CollectionConfig } from "../schemas/collection.schema";

export const acompanhamentoMensal: CollectionConfig = {
  schemaVersion: 1,
  id: "acompanhamento-mensal",
  title: "Acompanhamento mensal",
  description: "Rotina mensal de revisão dos indicadores demográficos e de emprego.",
  timerSeconds: 30,
  refreshEveryCycles: 1,
  panels: [
    { panelId: "trabalho-emprego", timerSeconds: 40 },
    { panelId: "demografia" },
  ],
};
