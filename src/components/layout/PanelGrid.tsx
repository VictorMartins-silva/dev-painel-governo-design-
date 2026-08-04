import type { ReactNode } from "react";
import { PANEL_LAYOUTS, type PanelLayout } from "../../domain/types";
import styles from "./PanelGrid.module.css";

export const PANEL_GRID_LAYOUTS = PANEL_LAYOUTS;
export type PanelGridLayout = PanelLayout;

const LAYOUT_CLASS: Record<PanelGridLayout, string> = {
  "grid-2": styles.grid2,
  "grid-3": styles.grid3,
  "grid-4": styles.grid4,
  stack: styles.stack,
};

type PanelGridProps = {
  layout: PanelGridLayout;
  children: ReactNode;
};

export function PanelGrid({ layout, children }: PanelGridProps) {
  return <div className={`${styles.grid} ${LAYOUT_CLASS[layout]}`}>{children}</div>;
}
