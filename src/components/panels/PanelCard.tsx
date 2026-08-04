import { Link } from "react-router-dom";
import type { PanelSummary } from "../../data/provider";
import styles from "./PanelCard.module.css";

type PanelCardProps = {
  panel: PanelSummary;
};

export function PanelCard({ panel }: PanelCardProps) {
  return (
    <Link to={`/paineis/${panel.id}`} className={styles.card}>
      <span className={styles.theme}>{panel.theme}</span>
      <span className={styles.title}>{panel.title}</span>
      <p className={styles.description}>{panel.description}</p>
      <div className={styles.tags}>
        {panel.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className={styles.footer}>
        <span>{panel.source}</span>
        <span>Atualizado em {panel.updatedAt}</span>
      </div>
    </Link>
  );
}
