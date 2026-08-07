import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./RootLayout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import PanelPage from "./pages/PanelPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import KioskPresentationPage from "./pages/KioskPresentationPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "../admin/AdminLayout";
import AdminPanelsPage from "../admin/pages/AdminPanelsPage";
import AdminCollectionsPage from "../admin/pages/AdminCollectionsPage";
import CollectionEditorPage from "../admin/pages/CollectionEditorPage";
import AdminSettingsPage from "../admin/pages/AdminSettingsPage";
import PanelEditorPage from "../admin/pages/PanelEditorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "paineis", element: <CatalogPage /> },
      { path: "paineis/:id", element: <PanelPage /> },
      { path: "sala", element: <CollectionsPage /> },
      { path: "sala/:id", element: <CollectionDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/paineis" replace /> },
      { path: "paineis", element: <AdminPanelsPage /> },
      { path: "configuracoes", element: <AdminSettingsPage /> },
      { path: "paineis/novo", element: <PanelEditorPage /> },
      { path: "paineis/:id", element: <PanelEditorPage /> },
      { path: "colecoes", element: <AdminCollectionsPage /> },
      { path: "colecoes/novo", element: <CollectionEditorPage /> },
      { path: "colecoes/:id", element: <CollectionEditorPage /> },
    ],
  },
  {
    path: "sala/:id/apresentar",
    element: <KioskPresentationPage />,
  },
]);
