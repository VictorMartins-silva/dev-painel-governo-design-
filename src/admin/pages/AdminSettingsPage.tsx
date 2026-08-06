import { useState, type FormEvent } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { settingsStore } from "../store/SettingsStore";
import styles from "./AdminSettingsPage.module.css";

const DOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(() => settingsStore.get());
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleAdd(event: FormEvent) {
    event.preventDefault();
    const trimmed = newDomain.trim().toLowerCase();
    if (!trimmed) return;

    if (!DOMAIN_PATTERN.test(trimmed)) {
      setError("Informe um domínio válido, por exemplo app.powerbi.com.");
      return;
    }

    setError(null);
    setSettings(settingsStore.addAllowedEmbedDomain(trimmed));
    setNewDomain("");
  }

  function handleRemove(domain: string) {
    setSettings(settingsStore.removeAllowedEmbedDomain(domain));
  }

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Domínios permitidos para incorporação de painéis externos via iframe (allowlist de embed)."
      />

      <form className={styles.form} onSubmit={handleAdd}>
        <label htmlFor="new-domain" className={styles.label}>
          Novo domínio permitido
        </label>
        <div className={styles.row}>
          <input
            id="new-domain"
            className={styles.input}
            placeholder="app.powerbi.com"
            value={newDomain}
            onChange={(event) => setNewDomain(event.target.value)}
          />
          <button type="submit" className={styles.primaryButton}>
            Adicionar
          </button>
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>

      {settings.allowedEmbedDomains.length === 0 ? (
        <p className={styles.empty}>
          Nenhum domínio permitido — nenhum painel externo poderá ser exibido.
        </p>
      ) : (
        <ul className={styles.list}>
          {settings.allowedEmbedDomains.map((domain) => (
            <li key={domain} className={styles.item}>
              <span className={styles.domain}>{domain}</span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => handleRemove(domain)}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
