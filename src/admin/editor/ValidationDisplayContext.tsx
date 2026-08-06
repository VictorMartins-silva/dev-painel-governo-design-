import { createContext, useContext, type ReactNode } from "react";

/** Quando true, os campos exibem erro mesmo sem terem sido tocados (após tentativa de salvar). */
const ValidationDisplayContext = createContext(false);

export function ValidationDisplayProvider({
  forceShow,
  children,
}: {
  forceShow: boolean;
  children: ReactNode;
}) {
  return (
    <ValidationDisplayContext.Provider value={forceShow}>
      {children}
    </ValidationDisplayContext.Provider>
  );
}

export function useForceShowErrors(): boolean {
  return useContext(ValidationDisplayContext);
}
