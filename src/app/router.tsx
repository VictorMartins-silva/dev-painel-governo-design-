import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import PanelPage from "./pages/PanelPage";
import IndicatorDetailPage from "./pages/IndicatorDetailPage";
import DevGalleryPage from "./pages/DevGalleryPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "../admin/AdminLayout";
import AdminPanelsPage from "../admin/pages/AdminPanelsPage";
import PanelEditorPage from "../admin/pages/PanelEditorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "paineis", element: <CatalogPage /> },
      { path: "paineis/:id", element: <PanelPage /> },
      { path: "indicadores/:id", element: <IndicatorDetailPage /> },
      { path: "dev/galeria", element: <DevGalleryPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminPanelsPage /> },
      { path: "paineis/novo", element: <PanelEditorPage /> },
      { path: "paineis/:id", element: <PanelEditorPage /> },
    ],
  },
]);
