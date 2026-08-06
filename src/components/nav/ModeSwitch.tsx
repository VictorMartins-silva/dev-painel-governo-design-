import { Link, useLocation } from "react-router-dom";
import { toAdminPath, toPublicPath } from "./modeSwitchPaths";

type ModeSwitchProps = {
  mode: "toAdmin" | "toPublic";
  className?: string;
};

/** Botão de troca de ambiente — não é um item de conteúdo, é controle de modo. */
export function ModeSwitch({ mode, className }: ModeSwitchProps) {
  const location = useLocation();

  if (mode === "toAdmin") {
    return (
      <Link to={toAdminPath(location.pathname)} className={className}>
        <span aria-hidden="true">⚙</span> Configurar
      </Link>
    );
  }

  return (
    <Link to={toPublicPath(location.pathname)} className={className}>
      Ver como público <span aria-hidden="true">↗</span>
    </Link>
  );
}
