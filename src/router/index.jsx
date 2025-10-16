import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

const BoardsPage = lazy(() => import("@/components/pages/BoardsPage"));
const BoardDetailPage = lazy(() => import("@/components/pages/BoardDetailPage"));
const RoadmapPage = lazy(() => import("@/components/pages/RoadmapPage"));
const PostDetailPage = lazy(() => import("@/components/pages/PostDetailPage"));
const ChangelogPage = lazy(() => import("@/components/pages/ChangelogPage"));
const AdminWidgetConfigPage = lazy(() => import("@/components/pages/AdminWidgetConfigPage"));
const AdminWidgetAnalyticsPage = lazy(() => import("@/components/pages/AdminWidgetAnalyticsPage"));
const AdminChangelogsPage = lazy(() => import("@/components/pages/AdminChangelogsPage"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={<div>Loading.....</div>}><BoardsPage /></Suspense>
  },
  {
    path: "roadmap",
    element: <Suspense fallback={<div>Loading.....</div>}><RoadmapPage /></Suspense>
  },
  {
    path: "boards/:boardId",
    element: <Suspense fallback={<div>Loading.....</div>}><BoardDetailPage /></Suspense>
  },
{
    path: "posts/:postId",
    element: <Suspense fallback={<div>Loading.....</div>}><PostDetailPage /></Suspense>
  },
  {
    path: "changelog",
    element: <Suspense fallback={<div>Loading.....</div>}><ChangelogPage /></Suspense>
  },
{
    path: "admin/widget-config",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <AdminWidgetConfigPage />
      </Suspense>
    )
  },
  {
    path: "admin/widget-analytics",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <AdminWidgetAnalyticsPage />
      </Suspense>
    )
  },
  {
    path: "admin/changelogs",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <AdminChangelogsPage />
      </Suspense>
    )
  },
  {
    path: "admin/widgets",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <AdminWidgetConfigPage />
      </Suspense>
    )
  },
  {
    path: "*",
    element: <Suspense fallback={<div>Loading.....</div>}><NotFound /></Suspense>
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);