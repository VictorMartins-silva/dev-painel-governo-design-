import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./RootLayout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import PanelPage from "./pages/PanelPage";
import IndicatorCatalogPage from "./pages/IndicatorCatalogPage";
import IndicatorDetailPage from "./pages/IndicatorDetailPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import KioskPresentationPage from "./pages/KioskPresentationPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "../admin/AdminLayout";
import AdminPanelsPage from "../admin/pages/AdminPanelsPage";
import AdminCollectionsPage from "../admin/pages/AdminCollectionsPage";
import CollectionEditorPage from "../admin/pages/CollectionEditorPage";
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
      { path: "sala", element: <CollectionsPage /> },
      { path: "sala/:id", element: <CollectionDetailPage /> },
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
      { path: "colecoes", element: <AdminCollectionsPage /> },
      { path: "colecoes/novo", element: <CollectionEditorPage /> },
      { path: "colecoes/:id", element: <CollectionEditorPage /> },
    ],
  },
  {
    path: "admin/preview",
    element: <PreviewWindowPage />,
  },
  {
    path: "sala/:id/apresentar",
    element: <KioskPresentationPage />,
  },
]);
