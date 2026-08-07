import { useParams } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { MetadataBlock } from "../../components/layout/MetadataBlock";
import { AsyncBoundary } from "../../components/feedback/AsyncBoundary";
import { ErrorState } from "../../components/feedback/ErrorState";
import { usePanelConfig } from "../../data/hooks/usePanelConfig";
import { usePanelFreshness } from "../../data/hooks/usePanelFreshness";
import { EmbedPanelView } from "../../renderer/EmbedPanelView";

export default function PanelPage() {
  const { id } = useParams<{ id: string }>();
  const panelState = usePanelConfig(id ?? "");
  const freshnessState = usePanelFreshness(id ?? "");
  const freshness = freshnessState.status === "success" ? freshnessState.data : undefined;

  if (!id) {
    return (
      <ErrorState
        title="Painel não especificado"
        message="Nenhum identificador de painel foi informado na URL."
      />
    );
  }

  return (
    <AsyncBoundary
      state={panelState}
      loadingLabel="Carregando painel…"
      emptyTitle="Painel não encontrado"
      emptyMessage={`Não existe um painel com o identificador "${id}".`}
    >
      {(panel) => (
        <div>
          <Breadcrumb
            items={[
              { label: "Início", href: "/" },
              { label: "Painéis", href: "/paineis" },
              { label: panel.title },
            ]}
          />
          <PageHeader title={panel.title} description={panel.description} />
          <EmbedPanelView panel={panel} />
          <MetadataBlock
            source={panel.metadata.source}
            referencePeriod={freshness?.referencePeriod}
            updatedAt={freshness?.updatedAt}
            owner={panel.metadata.owner}
            methodologyNote={panel.metadata.methodologyNote}
          />
        </div>
      )}
    </AsyncBoundary>
  );
}
