import { Link } from "react-router-dom";
import type { FormatType, IndicatorData } from "../../domain/types";
import { formatValue } from "../../utils/format";
import styles from "./IndicatorCard.module.css";

type IndicatorCardProps = {
  title: string;
  data: IndicatorData;
  format: FormatType;
  indicatorId?: string;
};

const COMPARISON_CLASS = {
  up: styles.comparisonUp,
  down: styles.comparisonDown,
  stable: styles.comparisonStable,
};

const CARD_BORDER_CLASS = {
  up: styles.cardUp,
  down: styles.cardDown,
  stable: styles.cardStable,
};

const COMPARISON_SYMBOL = {
  up: "▲",
  down: "▼",
  stable: "■",
};

export function IndicatorCard({ title, data, format, indicatorId }: IndicatorCardProps) {
  const { value, unit, comparison, referencePeriod, source } = data;
  const cardClass = comparison
    ? `${styles.card} ${CARD_BORDER_CLASS[comparison.direction]}`
    : styles.card;

  return (
    <div className={cardClass} title={source ? `Fonte: ${source}` : undefined}>
      <span className={styles.title}>{title}</span>
      <div className={styles.valueRow}>
        <span className={styles.value}>{formatValue(value, format)}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {comparison && (
        <span className={`${styles.comparison} ${COMPARISON_CLASS[comparison.direction]}`}>
          <span aria-hidden="true">{COMPARISON_SYMBOL[comparison.direction]}</span>
          {formatValue(Math.abs(comparison.value), format)} vs. {comparison.referenceLabel}
        </span>
      )}
      <div className={styles.footer}>
        <span>{referencePeriod}</span>
        {indicatorId && (
          <Link to={`/indicadores/${indicatorId}`} className={styles.link}>
            Ver detalhes
          </Link>
        )}
      </div>
    </div>
  );
}
