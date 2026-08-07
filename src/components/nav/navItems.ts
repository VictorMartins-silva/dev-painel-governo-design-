export type NavItem = {
  id: string;
  label: string;
  to: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/** Destinos de conteúdo do ambiente de consumo. "Início" fica de fora — a marca já leva para "/". */
export const CONSUMER_NAV_ITEMS: NavItem[] = [
  { id: "paineis", label: "Painéis", to: "/paineis" },
  { id: "sala", label: "Apresentações", to: "/sala" },
];

/** Itens do ambiente de configuração, agrupados por natureza (não por frequência de uso). */
export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    label: "Conteúdo",
    items: [
      { id: "paineis", label: "Painéis", to: "/admin/paineis" },
      { id: "colecoes", label: "Coleções", to: "/admin/colecoes" },
    ],
  },
  {
    label: "Sistema",
    items: [{ id: "configuracoes", label: "Configurações", to: "/admin/configuracoes" }],
  },
];
