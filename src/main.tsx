import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { registerEchartsThemes } from "./styles/echarts-theme";
import { DataProviderRoot } from "./data/DataProviderContext";
import { MockDataProvider } from "./data/mock/MockDataProvider";
import "./styles/global.css";

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
