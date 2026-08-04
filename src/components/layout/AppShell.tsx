import type { ReactNode } from "react";
import { Header } from "./Header";
import styles from "./AppShell.module.css";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <a href="#conteudo-principal" className={styles.skipLink}>
        Pular para o conteúdo principal
      </a>
      <Header />
      <main id="conteudo-principal" className={styles.main}>
        {children}
      </main>
    </div>
  );
}
