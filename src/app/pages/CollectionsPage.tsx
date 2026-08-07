import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { collectionStore } from "../../admin/store/CollectionStore";
import { panelStore } from "../../admin/store/PanelStore";
import styles from "./CollectionsPage.module.css";

export default function CollectionsPage() {
  const entries = [...collectionStore.list()].sort((a, b) =>
    a.config.title.localeCompare(b.config.title),
  );

  return (
    <div>
      <PageHeader
        title="Apresentações"
        description="Coleção é o que roda na tela; permissão é quem pode ver. São dois conceitos diferentes — a permissão vem das estruturas organizacionais do Acto, não daqui."
      />

      {entries.length === 0 ? (
        <p>Nenhuma coleção cadastrada.</p>
      ) : (
        <div className={styles.grid}>
          {entries.map(({ config }) => {
            return (
              <Link key={config.id} to={`/sala/${config.id}`} className={styles.card}>
                <div className={styles.titleRow}>
                  <h3 className={styles.title}>{config.title}</h3>
                  <span className={styles.chip}>{config.panels.length} painéis</span>
                </div>
                <p className={styles.description}>{config.description}</p>
                <ol className={styles.sequence}>
                  {config.panels.slice(0, 4).map((ref, index) => {
                    const panel = panelStore.get(ref.panelId);
                    return (
                      <li key={ref.panelId}>
                        <span className={styles.sequenceIndex}>{index + 1}.</span>
                        {panel?.title ?? `Painel removido (${ref.panelId})`}
                      </li>
                    );
                  })}
                  {config.panels.length > 4 && <li>+{config.panels.length - 4} painéis</li>}
                </ol>
                <div className={styles.footer}>
                  <span>{config.timerSeconds}s por painel</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
