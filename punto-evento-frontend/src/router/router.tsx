import { createBrowserRouter } from "react-router-dom";
import { Animator } from "../components/routes-animations/animator";
import Error from "../pages/error";
import { ProtectedRoute } from "../components/routes/protected-route";
import Login from "../pages/auth/login";
import Home from "../pages/home/home";
import Register from "../pages/auth/register";
import UsersManagement from "../pages/admin/AdminUsersManagement";
import RoleProtectedRoute from "../components/routes/role-protected-route";
import { UserType } from "../enums/user-type.enum";

// Páginas según el flujo funcional
import ClientRequests from "../pages/client/ClientRequests";
import ClientQuotes from "../pages/client/ClientQuotes";
import ClientDashboard from "../pages/client/ClientDashboard";
import ClientReservations from "../pages/client/ClientReservations";
import AdminQuotes from "../pages/admin/AdminQuotes";
import AdminReservations from "../pages/admin/AdminReservations";
import AdminRequests from "../pages/admin/AdminRequests";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EmployeeTasks from "../pages/employee/EmployeeTasks";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";

export const router = createBrowserRouter([
  {
    element: <Animator />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        ),
      },

      // =========================
      // RUTAS PARA ADMINISTRADOR
      // =========================
      {
        path: "/admin/dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.ADMIN]}>
            <AdminDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/admin/quotes",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.ADMIN]}>
            <AdminQuotes />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/admin/reservations",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.ADMIN]}>
            <AdminReservations />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/admin/requests",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.ADMIN]}>
            <AdminRequests />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.ADMIN]}>
            <UsersManagement />
          </RoleProtectedRoute>
        ),
      },

      // =========================
      // RUTAS PARA CLIENTES
      // =========================
      {
        path: "/client/dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.CLIENT]}>
            <ClientDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/client/requests",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.CLIENT]}>
            <ClientRequests />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/client/quotes",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.CLIENT]}>
            <ClientQuotes />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/client/reservations",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.CLIENT]}>
            <ClientReservations />
          </RoleProtectedRoute>
        ),
      },

      // =========================
      // RUTAS PARA EMPLEADOS
      // =========================
      {
        path: "/employee/dashboard",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.EMPLOYEE]}>
            <EmployeeDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/employee/tasks",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.EMPLOYEE]}>
            <EmployeeTasks />
          </RoleProtectedRoute>
        ),
      },
    ],
    errorElement: <Error />,
  },
]);
