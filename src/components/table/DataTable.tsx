import { useMemo, useState } from "react";
import type { TableData } from "../../domain/types";
import { formatValue } from "../../utils/format";
import styles from "./DataTable.module.css";

type DataTableProps = {
  title?: string;
  data: TableData;
  source?: string;
};

type SortState = { field: string; direction: "asc" | "desc" } | null;

export function DataTable({ title, data, source }: DataTableProps) {
  const [sort, setSort] = useState<SortState>(null);

  const rows = useMemo(() => {
    if (!sort) return data.rows;
    const direction = sort.direction === "asc" ? 1 : -1;
    return [...data.rows].sort((a, b) => {
      const valueA = a[sort.field];
      const valueB = b[sort.field];
      if (valueA === null || valueA === undefined) return 1;
      if (valueB === null || valueB === undefined) return -1;
      if (typeof valueA === "number" && typeof valueB === "number") {
        return direction * (valueA - valueB);
      }
      return direction * String(valueA).localeCompare(String(valueB));
    });
  }, [data.rows, sort]);

  function toggleSort(field: string) {
    setSort((current) => {
      if (current?.field !== field) return { field, direction: "asc" };
      if (current.direction === "asc") return { field, direction: "desc" };
      return null;
    });
  }

  return (
    <div className={styles.wrapper}>
      {title && <span className={styles.title}>{title}</span>}
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              {data.columns.map((column) => {
                const isSorted = sort?.field === column.field;
                const indicator = isSorted ? (sort.direction === "asc" ? "▲" : "▼") : "";
                return (
                  <th key={column.field} scope="col" className={styles.headerCell}>
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => toggleSort(column.field)}
                      aria-label={`Ordenar por ${column.label}`}
                    >
                      {column.label}
                      {indicator && <span aria-hidden="true">{indicator}</span>}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {data.columns.map((column) => (
                  <td key={column.field} className={styles.cell}>
                    {formatValue(row[column.field], column.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {source && <span className={styles.source}>{source}</span>}
    </div>
  );
}
