import { createBrowserRouter } from "react-router-dom";
import { Animator } from "../components/routes-animations/animator";
import Error from "../pages/error";
import { ProtectedRoute } from "../components/routes/protected-route";
import Login from "../pages/auth/login";
import Home from "../pages/home/home";
import Dashboard from "../pages/dashboard/dashboard";
import Register from "../pages/auth/register";
import UsersManagement from "../pages/users/UsersManagement";
import RoleProtectedRoute from "../components/routes/role-protected-route";
import { UserType } from "../enums/user-type.enum";

// Nuevas páginas según el flujo funcional
import ClientRequests from "../pages/client/ClientRequests";
import ClientQuotes from "../pages/client/ClientQuotes";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminQuotes from "../pages/admin/AdminQuotes";
import AdminReservations from "../pages/admin/AdminReservations";
import EmployeeTasks from "../pages/employee/EmployeeTasks";

export const router = createBrowserRouter([
  {
    element: <Animator />,
    children: [
      {
        path: "/",
        element: <Home />,
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
      // Dashboard principal (redirige según rol)
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute requireAuth={true}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // =========================
      // RUTAS PARA ADMINISTRADOR
      // =========================
      {
        path: "/dashboard/admin",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.ADMIN]}>
            <AdminDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/dashboard/admin/quotes",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.ADMIN]}>
            <AdminQuotes />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/dashboard/admin/reservations",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.ADMIN]}>
            <AdminReservations />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/dashboard/users",
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
        path: "/dashboard/client/requests",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.CLIENT]}>
            <ClientRequests />
          </RoleProtectedRoute>
        ),
      },
      {
        path: "/dashboard/client/quotes",
        element: (
          <RoleProtectedRoute allowedRoles={[UserType.CLIENT]}>
            <ClientQuotes />
          </RoleProtectedRoute>
        ),
      },

      // =========================
      // RUTAS PARA EMPLEADOS
      // =========================
      {
        path: "/dashboard/employee/tasks",
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
