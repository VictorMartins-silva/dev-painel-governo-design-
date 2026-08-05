import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./RootLayout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import PanelPage from "./pages/PanelPage";
import IndicatorCatalogPage from "./pages/IndicatorCatalogPage";
import IndicatorDetailPage from "./pages/IndicatorDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "../admin/AdminLayout";
import AdminPanelsPage from "../admin/pages/AdminPanelsPage";
import AdminIndicatorsPage from "../admin/pages/AdminIndicatorsPage";
import AdminComponentsPage from "../admin/pages/AdminComponentsPage";
import AdminSettingsPage from "../admin/pages/AdminSettingsPage";
import PanelEditorPage from "../admin/pages/PanelEditorPage";
import PreviewWindowPage from "../admin/pages/PreviewWindowPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "paineis", element: <CatalogPage /> },
      { path: "paineis/:id", element: <PanelPage /> },
      { path: "indicadores", element: <IndicatorCatalogPage /> },
      { path: "indicadores/:id", element: <IndicatorDetailPage /> },
      { path: "dev/galeria", element: <Navigate to="/admin/componentes" replace /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminPanelsPage /> },
      { path: "indicadores", element: <AdminIndicatorsPage /> },
      { path: "componentes", element: <AdminComponentsPage /> },
      { path: "configuracoes", element: <AdminSettingsPage /> },
      { path: "paineis/novo", element: <PanelEditorPage /> },
      { path: "paineis/:id", element: <PanelEditorPage /> },
    ],
  },
  {
    path: "admin/preview",
    element: <PreviewWindowPage />,
  },
]);
