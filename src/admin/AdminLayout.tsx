import { Link, Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  return (
    <div className={styles.shell}>
      <a href="#admin-conteudo" className={styles.skipLink}>
        Pular para o conteúdo principal
      </a>
      <div className={styles.banner} role="note">
        <span className={styles.badge}>Ambiente de configuração</span>
        <p className={styles.bannerText}>
          Alterações feitas aqui afetam os painéis publicados imediatamente. Sem autenticação nesta
          versão.
        </p>
        <Link to="/" className={styles.exitLink}>
          Sair do modo de configuração
        </Link>
      </div>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/admin" className={styles.brand}>
            Painel de Governo · Admin
          </Link>
          <nav className={styles.nav} aria-label="Navegação do admin">
            <Link to="/admin" className={styles.navLink}>
              Painéis
            </Link>
            <Link to="/admin/indicadores" className={styles.navLink}>
              Indicadores
            </Link>
            <Link to="/admin/componentes" className={styles.navLink}>
              Componentes
            </Link>
            <Link to="/admin/colecoes" className={styles.navLink}>
              Coleções
            </Link>
            <Link to="/admin/configuracoes" className={styles.navLink}>
              Configurações
            </Link>
          </nav>
        </div>
      </header>
      <main id="admin-conteudo" className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
