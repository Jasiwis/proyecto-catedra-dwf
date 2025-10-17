import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { useRole } from "../../hooks/use-role";
import { UserType } from "../../enums/user-type.enum";

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
  fallbackPath = "/dashboard",
}) => {
  const { isAuthenticated } = useAuth();
  const { userType, hasAnyRole } = useRole();

  // Si no requiere autenticación, mostrar el componente
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no se especificaron roles permitidos, solo requiere autenticación
  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Si el usuario no tiene un rol válido o no está en los roles permitidos
  if (!userType || !hasAnyRole(allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
