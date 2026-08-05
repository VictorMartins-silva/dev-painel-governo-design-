import { Link } from "react-router-dom";
import type { IndicatorCatalogEntry } from "../../config/schemas/indicator.schema";
import styles from "./IndicatorCatalogCard.module.css";

const SHAPE_LABEL: Record<string, string> = {
  metric: "Métrica",
  categorical: "Categórico",
  table: "Tabela",
};

type IndicatorCatalogCardProps = {
  indicator: IndicatorCatalogEntry;
};

export function IndicatorCatalogCard({ indicator }: IndicatorCatalogCardProps) {
  return (
    <Link to={`/indicadores/${indicator.id}`} className={styles.card}>
      <span className={styles.source}>{indicator.source}</span>
      <span className={styles.title}>{indicator.name}</span>
      <p className={styles.description}>{indicator.definition}</p>
      <div className={styles.tags}>
        {indicator.shapes.map((shape) => (
          <span key={shape} className={styles.tag}>
            {SHAPE_LABEL[shape] ?? shape}
          </span>
        ))}
      </div>
      <div className={styles.footer}>
        <span>{indicator.periodicity}</span>
        <span>Responsável: {indicator.owner}</span>
      </div>
    </Link>
  );
}
