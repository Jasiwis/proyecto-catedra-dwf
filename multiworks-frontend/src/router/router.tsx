import { createBrowserRouter } from "react-router-dom";
import { Animator } from "../components/routes-animations/animator";
import Error from "../pages/error";
import { ProtectedRoute } from "../components/routes/protected-route";
import Login from "../pages/auth/login";
import Home from "../pages/home/home";
import Dashboard from "../pages/dashboard/dashboard";
import Register from "../pages/auth/register";
import EmployeeList from "../pages/employees/employees";
import ClientList from "../pages/clients/clients";
import QuoteList from "../pages/quotes/QuoteList";
import QuoteDetail from "../pages/quotes/QuoteDetail";
import AssignmentDetail from "../pages/assignments/AssignmentDetail";

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
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute requireAuth={true}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/employees",
        element: (
          <ProtectedRoute requireAuth={true}>
            <EmployeeList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/clients",
        element: (
          <ProtectedRoute requireAuth={true}>
            <ClientList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/quotes",
        element: (
          <ProtectedRoute requireAuth={true}>
            <QuoteList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/quotes/:id",
        element: (
          <ProtectedRoute requireAuth={true}>
            <QuoteDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/assignments/:id",
        element: (
          <ProtectedRoute requireAuth={true}>
            <AssignmentDetail />
          </ProtectedRoute>
        ),
      },
    ],
    errorElement: <Error />,
  },
]);
