import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type NavItemProps = {
  to: string;
  children: ReactNode;
  className: string;
  activeClassName: string;
};

/**
 * NavLink já resolve estado ativo (por prefixo de rota) e `aria-current="page"` sozinho — este
 * wrapper só centraliza a montagem de className para ser reaproveitado pelo topo e pela sidebar.
 */
export function NavItem({ to, children, className, activeClassName }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? `${className} ${activeClassName}` : className)}
    >
      {children}
    </NavLink>
  );
}
