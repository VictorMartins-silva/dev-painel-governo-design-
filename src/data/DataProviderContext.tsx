import { createContext, useContext, type ReactNode } from "react";
import type { DataProvider } from "./provider";

const DataProviderContext = createContext<DataProvider | null>(null);

type DataProviderRootProps = {
  provider: DataProvider;
  children: ReactNode;
};

export function DataProviderRoot({ provider, children }: DataProviderRootProps) {
  return <DataProviderContext.Provider value={provider}>{children}</DataProviderContext.Provider>;
}

export function useDataProvider(): DataProvider {
  const provider = useContext(DataProviderContext);
  if (!provider) {
    throw new Error("useDataProvider deve ser usado dentro de <DataProviderRoot>.");
  }
  return provider;
}
