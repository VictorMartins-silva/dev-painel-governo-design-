import { Link, Outlet } from "react-router-dom";
import { NavItem } from "../components/nav/NavItem";
import { ModeSwitch } from "../components/nav/ModeSwitch";
import { ADMIN_NAV_GROUPS } from "../components/nav/navItems";
import { panelStore } from "./store/PanelStore";
import { collectionStore } from "./store/CollectionStore";
import { COMPONENT_CATALOG } from "../config/componentCatalog";
import styles from "./AdminLayout.module.css";

const NAV_ITEM_COUNT: Record<string, () => number> = {
  paineis: () => panelStore.list().length,
  colecoes: () => collectionStore.list().length,
  componentes: () => Object.keys(COMPONENT_CATALOG).length,
};

export default function AdminLayout() {
  return (
    <div className={styles.shell}>
      <a href="#admin-conteudo" className={styles.skipLink}>
        Pular para o conteúdo principal
      </a>
      <div className={styles.banner} role="note">
        <span className={styles.badge}>Configuração</span>
        <p className={styles.bannerText}>
          Alterações afetam os painéis publicados imediatamente. Sem autenticação nesta versão.
        </p>
        <ModeSwitch mode="toPublic" className={styles.exitLink} />
      </div>
      <div className={styles.body}>
        <aside className={styles.sidebar} aria-label="Navegação de configuração">
          <Link to="/admin/paineis" className={styles.brand}>
            Painel de Governo
          </Link>
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.label} className={styles.group}>
              <span className={styles.groupLabel}>{group.label}</span>
              {group.items.map((item) => {
                const count = NAV_ITEM_COUNT[item.id]?.();
                return (
                  <NavItem
                    key={item.id}
                    to={item.to}
                    className={styles.navLink}
                    activeClassName={styles.navLinkActive}
                  >
                    <span>{item.label}</span>
                    {count !== undefined && <span className={styles.count}>{count}</span>}
                  </NavItem>
                );
              })}
            </div>
          ))}
        </aside>
        <main id="admin-conteudo" className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
