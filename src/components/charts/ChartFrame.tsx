import type { ReactNode } from "react";
import styles from "./ChartFrame.module.css";

type ChartFrameProps = {
  title: string;
  unit?: string;
  source?: string;
  children: ReactNode;
};

export function ChartFrame({ title, unit, source, children }: ChartFrameProps) {
  return (
    <div className={styles.frame}>
      <span className={styles.title}>{title}</span>
      {children}
      {(unit ?? source) && (
        <div className={styles.footer}>
          <span>{unit}</span>
          <span>{source}</span>
        </div>
      )}
    </div>
  );
}
