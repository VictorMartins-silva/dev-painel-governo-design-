import { useState } from "react";
import { Link } from "react-router-dom";
import { applyTheme, getStoredTheme, type Theme } from "../../styles/theme";
import { NavItem } from "../nav/NavItem";
import { ModeSwitch } from "../nav/ModeSwitch";
import { GlobalSearch } from "../nav/GlobalSearch";
import { CONSUMER_NAV_ITEMS } from "../nav/navItems";
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
        <Link to="/" className={styles.brand} title="Início">
          Painel de Governo
        </Link>
        <nav className={styles.nav} aria-label="Navegação principal">
          {CONSUMER_NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              to={item.to}
              className={styles.navLink}
              activeClassName={styles.navLinkActive}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>
        <div className={styles.toolbar}>
          <GlobalSearch />
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"}
          >
            {theme === "light" ? "◐ Escuro" : "◑ Claro"}
          </button>
          <span className={styles.divider} aria-hidden="true" />
          <ModeSwitch mode="toAdmin" className={styles.modeSwitch} />
        </div>
      </div>
    </header>
  );
}
