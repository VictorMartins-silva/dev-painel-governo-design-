import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  title?: string;
  children: ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <section className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </section>
  );
}
