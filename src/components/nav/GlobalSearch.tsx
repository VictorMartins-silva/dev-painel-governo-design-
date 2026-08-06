import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GlobalSearch.module.css";

/** Busca do topo — único ponto de entrada para o índice de painéis, de qualquer página. */
export function GlobalSearch() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    navigate(trimmed ? `/paineis?q=${encodeURIComponent(trimmed)}` : "/paineis");
  }

  return (
    <form className={styles.form} role="search" onSubmit={handleSubmit}>
      <input
        type="search"
        className={styles.input}
        placeholder="Buscar painéis…"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Buscar painéis"
      />
    </form>
  );
}
