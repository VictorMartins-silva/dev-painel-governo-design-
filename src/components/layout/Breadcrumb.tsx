import { Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {item.href && !isLast ? (
                <Link to={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? styles.current : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
