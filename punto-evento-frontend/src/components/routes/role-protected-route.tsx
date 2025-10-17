import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { useRole } from "../../hooks/use-role";
import { UserType } from "../../enums/user-type.enum";
import { getDashboardRoute } from "../../utils/dashboard-routes.util";
import Layout from "../Layout/Layout";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserType[];
  requireAuth?: boolean;
  fallbackPath?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
  fallbackPath,
}) => {
  const { isAuthenticated } = useAuth();
  const { userType, hasAnyRole } = useRole();

  // Si no requiere autenticación, mostrar el componente con Layout
  if (!requireAuth) {
    return <Layout>{children}</Layout>;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no se especificaron roles permitidos, solo requiere autenticación
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Layout>{children}</Layout>;
  }

  // Si el usuario no tiene un rol válido o no está en los roles permitidos
  if (!userType || !hasAnyRole(allowedRoles)) {
    const redirectPath =
      fallbackPath || (userType ? getDashboardRoute(userType) : "/");
    return <Navigate to={redirectPath} replace />;
  }

  // Usuario autenticado con rol válido - mostrar componente con Layout
  return <Layout>{children}</Layout>;
};

export default RoleProtectedRoute;
