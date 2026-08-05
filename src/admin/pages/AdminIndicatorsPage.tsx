import { Link } from "react-router-dom";
import { Breadcrumb } from "../../components/layout/Breadcrumb";
import { PageHeader } from "../../components/layout/PageHeader";
import { Section } from "../../components/layout/Section";
import { AsyncBoundary } from "../../components/feedback/AsyncBoundary";
import { useCatalogHealth } from "../../data/hooks/useCatalogHealth";
import styles from "./AdminIndicatorsPage.module.css";

export default function AdminIndicatorsPage() {
  const healthState = useCatalogHealth();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Indicadores" },
        ]}
      />
      <PageHeader
        title="Governança de indicadores"
        description="Estado do catálogo que alimenta os painéis: quem está cadastrado, quem não é usado por nenhum painel e quais painéis referenciam um indicador que não existe no catálogo."
      />

      <AsyncBoundary state={healthState} loadingLabel="Carregando catálogo…">
        {(health) => (
          <>
            {health.invalid.length > 0 && (
              <Section title={`Fixtures inválidas (${health.invalid.length})`}>
                <ul className={styles.issueList}>
                  {health.invalid.map((invalid, index) => (
                    <li key={index} className={styles.issueRow}>
                      {invalid.issues.join("; ")}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {health.dangling.length > 0 && (
              <Section title={`Referências quebradas (${health.dangling.length})`}>
                <ul className={styles.issueList}>
                  {health.dangling.map((entry, index) => (
                    <li key={index} className={styles.issueRow}>
                      <div className={styles.issueInfo}>
                        <span className={styles.issueTitle}>
                          "{entry.reference}" não existe no catálogo
                        </span>
                        <span className={styles.issueMeta}>
                          {entry.panelTitle} · {entry.sectionTitle} · {entry.componentTitle}
                        </span>
                      </div>
                      <Link to={`/admin/paineis/${entry.panelId}`} className={styles.linkButton}>
                        Editar painel
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {health.orphans.length > 0 && (
              <Section title={`Indicadores órfãos (${health.orphans.length})`}>
                <p className={styles.hint}>
                  Estão no catálogo, mas nenhum painel publicado os utiliza.
                </p>
                <ul className={styles.issueList}>
                  {health.orphans.map((entry) => (
                    <li key={entry.id} className={styles.issueRow}>
                      <div className={styles.issueInfo}>
                        <span className={styles.issueTitle}>{entry.name}</span>
                        <span className={styles.issueMeta}>{entry.source}</span>
                      </div>
                      <Link to={`/indicadores/${entry.id}`} className={styles.linkButton}>
                        Ver indicador
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section title={`Catálogo completo (${health.entries.length})`}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Indicador</th>
                      <th>Fonte</th>
                      <th>Responsável</th>
                      <th>Periodicidade</th>
                      <th>Formas</th>
                      <th>Painéis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {health.entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>
                          <Link to={`/indicadores/${entry.id}`} className={styles.tableLink}>
                            {entry.name}
                          </Link>
                        </td>
                        <td>{entry.source}</td>
                        <td>{entry.owner}</td>
                        <td>{entry.periodicity}</td>
                        <td>{entry.shapes.join(", ")}</td>
                        <td>{health.usageCountByIndicatorId[entry.id] ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </>
        )}
      </AsyncBoundary>
    </div>
  );
}
