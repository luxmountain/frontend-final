// src/App.js
import React from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import routes from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "./components/Layout";

const renderRoutes = (routes, parentPath = "") => {
  return routes.flatMap(({ path, element: Element, protected: isProtected, children }) => {
    const fullPath = `${parentPath}/${path}`.replace(/\/+/g, "/");

    const RouteElement = isProtected ? (
      <ProtectedRoute>
        <Element />
      </ProtectedRoute>
    ) : (
      <Element />
    );

    const route = (
      <Route key={fullPath} path={fullPath} element={RouteElement} />
    );

    const childRoutes = children ? renderRoutes(children, fullPath) : [];

    return [route, ...childRoutes];
  });
};

const App = () => {
  const allRoutes = renderRoutes(routes);

  return (
    <Routes>
      <Route element={<Layout />}>
        {allRoutes}
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
