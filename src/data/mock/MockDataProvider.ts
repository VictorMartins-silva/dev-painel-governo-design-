import type { PanelFreshness } from "../../domain/types";
import type { DataProvider, PanelSummary } from "../provider";
import { panelStore as defaultPanelStore, type PanelStore } from "../../admin/store/PanelStore";
import { randomDelay } from "./delay";

// Simula a tabela de monitoramento de atualizações do Fabric, uma entrada por painel.
const freshnessFixtures = import.meta.glob("./datasets/freshness/*.json", {
  eager: true,
  import: "default",
}) as Record<string, PanelFreshness>;

function keyByFilename(fixtures: Record<string, unknown>): Map<string, unknown> {
  const map = new Map<string, unknown>();
  for (const [path, value] of Object.entries(fixtures)) {
    const fileName = path.split("/").pop() ?? path;
    const id = fileName.replace(/\.json$/, "");
    map.set(id, value);
  }
  return map;
}

const freshnessByPanelId = keyByFilename(freshnessFixtures) as Map<string, PanelFreshness>;

export type MockDataProviderOptions = {
  simulateLatency?: boolean;
  latencyRange?: [number, number];
  panelStore?: PanelStore;
};

export class MockDataProvider implements DataProvider {
  private readonly simulateLatency: boolean;
  private readonly latencyRange: [number, number];
  private readonly panelStore: PanelStore;

  constructor(options: MockDataProviderOptions = {}) {
    this.simulateLatency = options.simulateLatency ?? true;
    this.latencyRange = options.latencyRange ?? [300, 600];
    this.panelStore = options.panelStore ?? defaultPanelStore;
  }

  private async wait(): Promise<void> {
    if (!this.simulateLatency) return;
    await randomDelay(this.latencyRange[0], this.latencyRange[1]);
  }

  async listPanels(): Promise<PanelSummary[]> {
    await this.wait();
    return this.panelStore.list().map((panel) => ({
      id: panel.id,
      title: panel.title,
      description: panel.description,
      theme: panel.theme,
      tags: panel.tags,
      source: panel.metadata.source,
      updatedAt: freshnessByPanelId.get(panel.id)?.updatedAt ?? "—",
      embedProvider: panel.embed.provider,
    }));
  }

  async getPanelConfig(panelId: string) {
    await this.wait();
    const panel = this.panelStore.get(panelId);
    if (!panel) {
      throw new Error(`Painel "${panelId}" não encontrado.`);
    }
    return panel;
  }

  async getPanelFreshness(panelId: string): Promise<PanelFreshness> {
    await this.wait();
    return freshnessByPanelId.get(panelId) ?? {};
  }
}
