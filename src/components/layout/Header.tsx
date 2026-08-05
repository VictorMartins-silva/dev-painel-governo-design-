import { useState } from "react";
import { Link } from "react-router-dom";
import { applyTheme, getStoredTheme, type Theme } from "../../styles/theme";
import styles from "./Header.module.css";

export function Header() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          Painel de Governo
        </Link>
        <nav className={styles.nav} aria-label="Navegação principal">
          <Link to="/" className={styles.navLink}>
            Início
          </Link>
          <Link to="/paineis" className={styles.navLink}>
            Painéis
          </Link>
          <Link to="/indicadores" className={styles.navLink}>
            Indicadores
          </Link>
          <Link to="/sala" className={styles.navLink}>
            Sala de situação
          </Link>
          <Link to="/admin" className={styles.navLink}>
            Configuração
          </Link>
        </nav>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
        >
          {theme === "light" ? "◐ Escuro" : "◑ Claro"}
        </button>
      </div>
    </header>
  );
}
