import styles from "./MetadataBlock.module.css";

type MetadataBlockProps = {
  source?: string;
  referencePeriod?: string;
  updatedAt?: string;
  owner?: string;
  methodologyNote?: string;
};

export function MetadataBlock({
  source,
  referencePeriod,
  updatedAt,
  owner,
  methodologyNote,
}: MetadataBlockProps) {
  const items: { label: string; value: string }[] = [
    { label: "Fonte", value: source ?? "—" },
    { label: "Período de referência", value: referencePeriod ?? "—" },
    { label: "Atualizado em", value: updatedAt ?? "—" },
    { label: "Responsável", value: owner ?? "—" },
  ];

  return (
    <div className={styles.block}>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.label} className={styles.item}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>{item.value}</span>
          </div>
        ))}
      </div>
      {methodologyNote && <p className={styles.note}>{methodologyNote}</p>}
    </div>
  );
}
