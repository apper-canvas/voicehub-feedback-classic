import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Root from "@/layouts/Root";
import { getRouteConfig } from "@/router/route.utils";
import Layout from "@/components/organisms/Layout";

// Lazy load page components
const BoardsPage = lazy(() => import("@/components/pages/BoardsPage"));
const RoadmapPage = lazy(() => import("@/components/pages/RoadmapPage"));
const BoardDetailPage = lazy(() => import("@/components/pages/BoardDetailPage"));
const PostDetailPage = lazy(() => import("@/components/pages/PostDetailPage"));
const ChangelogPage = lazy(() => import("@/components/pages/ChangelogPage"));
const ChangelogDetailPage = lazy(() => import("@/components/pages/ChangelogDetailPage"));
const AdminWidgetConfigPage = lazy(() => import("@/components/pages/AdminWidgetConfigPage"));
const AdminWidgetAnalyticsPage = lazy(() => import("@/components/pages/AdminWidgetAnalyticsPage"));
const AdminChangelogsPage = lazy(() => import("@/components/pages/AdminChangelogsPage"));
const AdminBoardsPage = lazy(() => import("@/components/pages/AdminBoardsPage"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));
const Login = lazy(() => import("@/components/pages/Login"));
const Signup = lazy(() => import("@/components/pages/Signup"));
const Callback = lazy(() => import("@/components/pages/Callback"));
const ErrorPage = lazy(() => import("@/components/pages/ErrorPage"));
const ResetPassword = lazy(() => import("@/components/pages/ResetPassword"));
const PromptPassword = lazy(() => import("@/components/pages/PromptPassword"));
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingFallback />}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

const mainRoutes = [
  createRoute({
    path: "",
    index: true,
    element: <BoardsPage />
  }),
  createRoute({
    path: "roadmap",
    element: <RoadmapPage />
  }),
  createRoute({
    path: "boards/:boardId",
    element: <BoardDetailPage />
  }),
  createRoute({
    path: "posts/:postId",
    element: <PostDetailPage />
  }),
  createRoute({
    path: "changelog",
    element: <ChangelogPage />
  }),
  createRoute({
    path: "changelog/:version",
    element: <ChangelogDetailPage />
  }),
  createRoute({
    path: "admin/widget-config",
    element: <AdminWidgetConfigPage />
  }),
  createRoute({
    path: "admin/widget-analytics",
    element: <AdminWidgetAnalyticsPage />
  }),
  createRoute({
    path: "admin/changelogs",
    element: <AdminChangelogsPage />
  }),
  createRoute({
    path: "admin/boards",
    element: <AdminBoardsPage />
  }),
  createRoute({
    path: "admin/widgets",
    element: <AdminWidgetConfigPage />
  }),
  createRoute({
    path: "*",
    element: <NotFound />
  })
];

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      createRoute({
        path: "login",
        element: <Login />
      }),
      createRoute({
        path: "signup",
        element: <Signup />
      }),
      createRoute({
        path: "callback",
        element: <Callback />
      }),
      createRoute({
        path: "error",
        element: <ErrorPage />
      }),
      createRoute({
        path: "prompt-password/:appId/:emailAddress/:provider",
        element: <PromptPassword />
      }),
      createRoute({
        path: "reset-password/:appId/:fields",
        element: <ResetPassword />
      }),
      {
        path: "/",
        element: <Layout />,
        children: mainRoutes
      }
    ]
  }
];

export const router = createBrowserRouter(routes);