import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { useRole } from "../../hooks/use-role";
import { getDashboardRoute } from "../../utils/dashboard-routes.util";
import Layout from "../Layout/Layout";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { userType } = useRole();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!requireAuth && isAuthenticated) {
    const dashboardRoute = userType ? getDashboardRoute(userType) : "/";
    return <Navigate to={dashboardRoute} replace />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // SIEMPRE mostrar el Layout con Header en todas las páginas
  return <Layout>{children}</Layout>;
};
