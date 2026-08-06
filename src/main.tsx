import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { z } from "zod";
import { router } from "./app/router";
import { registerEchartsThemes } from "./styles/echarts-theme";
import { DataProviderRoot } from "./data/DataProviderContext";
import { MockDataProvider } from "./data/mock/MockDataProvider";
import "./styles/global.css";

// Mensagens de validação padrão do Zod (invalid_type, enum, etc.) em português.
z.config(z.locales.pt());

registerEchartsThemes();

const dataProvider = new MockDataProvider();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento #root não encontrado no index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <DataProviderRoot provider={dataProvider}>
      <RouterProvider router={router} />
    </DataProviderRoot>
  </StrictMode>,
);
