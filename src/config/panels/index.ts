import type { PanelConfig } from "../schemas/panel.schema";
import { trabalhoEmprego } from "./trabalho-emprego.panel";
import { demografia } from "./demografia.panel";
import { catalogoOsascoPanels } from "./catalogo-osasco.generated";

/**
 * Índice estático de painéis. O grosso vem do catálogo importado da planilha
 * (`catalogo-osasco.generated.ts`, regerado por `npm run catalogo:import`); `demografia` e
 * `trabalho-emprego` continuam aqui como os dois painéis-exemplo escritos à mão, com URLs de
 * embed placeholder.
 *
 * O `PanelStore` sobrepõe qualquer entrada daqui por id com o que estiver no localStorage, então
 * editar um painel importado em /admin/paineis não é perdido na próxima importação — a edição
 * fica sombreando a versão estática, com badge "Modificado" e ação "Restaurar original".
 */
export const panelRegistry: PanelConfig[] = [...catalogoOsascoPanels, trabalhoEmprego, demografia];

export function findPanelConfig(panelId: string): PanelConfig | undefined {
  return panelRegistry.find((panel) => panel.id === panelId);
}
