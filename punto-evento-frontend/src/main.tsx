import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { AuthProvider } from "./context/auth/auth-provider";
import { App as AntApp } from "antd";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AntApp>
      <RouterProvider router={router} />
    </AntApp>
  </AuthProvider>
);
