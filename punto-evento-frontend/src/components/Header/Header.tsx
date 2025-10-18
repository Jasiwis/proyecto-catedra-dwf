import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button } from "../Buttons/Button";
import { useRole } from "../../hooks/use-role";
import { getDashboardRoute } from "../../utils/dashboard-routes.util";

interface HeaderProps {
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  userName,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { isAdmin, isClient, isEmployee, userType } = useRole();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  // Menú expandido según el rol del usuario
  const getMenuItemsByRole = (): Array<{
    key: string;
    icon: React.ReactNode;
    label: string;
    to: string;
  }> => {
    const baseItems: Array<{
      key: string;
      icon: React.ReactNode;
      label: string;
      to: string;
    }> = [];

    // Agregar Dashboard para todos los roles autenticados
    if (userType) {
      baseItems.push({
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        to: getDashboardRoute(userType),
      });
    }

    if (isAdmin) {
      return [
        ...baseItems,
        {
          key: "requests",
          icon: <FileTextOutlined />,
          label: "Solicitudes",
          to: "/admin/requests",
        },
        {
          key: "quotes",
          icon: <FileTextOutlined />,
          label: "Cotizaciones",
          to: "/admin/quotes",
        },
        {
          key: "reservations",
          icon: <CalendarOutlined />,
          label: "Reservas",
          to: "/admin/reservations",
        },
        {
          key: "users",
          icon: <TeamOutlined />,
          label: "Usuarios",
          to: "/admin/users",
        },
      ];
    }

    if (isClient) {
      return [
        ...baseItems,
        {
          key: "requests",
          icon: <PlusOutlined />,
          label: "Nueva Solicitud",
          to: "/client/requests",
        },
        {
          key: "quotes",
          icon: <FileTextOutlined />,
          label: "Mis Cotizaciones",
          to: "/client/quotes",
        },
        {
          key: "reservations",
          icon: <CalendarOutlined />,
          label: "Mis Reservas",
          to: "/client/reservations",
        },
      ];
    }

    if (isEmployee) {
      return [
        ...baseItems,
        {
          key: "tasks",
          icon: <CheckSquareOutlined />,
          label: "Mis Tareas",
          to: "/employee/tasks",
        },
      ];
    }

    return baseItems;
  };

  const itemsLongMenu = getMenuItemsByRole();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-4xl font-extrabold font-cursive">
              Punto Evento
            </Link>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-4 md:flex text-gray-500">
              {itemsLongMenu.map((item) => (
                <HeaderItem
                  key={item.key}
                  label={item.label}
                  icon={item.icon}
                  to={item.to}
                />
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Dropdown menu={{ items }} placement="bottomRight">
                <div className="flex items-center cursor-pointer gap-2">
                  <Avatar icon={<UserOutlined />} className="mr-2 " />
                  <span className="text-gray-700">{userName || "User"}</span>
                </div>
              </Dropdown>
            ) : (
              <div className="space-x-4">
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const HeaderItem = ({
  label,
  icon,
  to,
}: {
  label: string;
  icon: React.ReactNode;
  to: string;
}) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 hover:!text-blue-500 hover:!bg-gray-100 rounded-md p-2 !text-gray-500 no-underline"
    >
      {icon}
      {label}
    </Link>
  );
};

export default Header;
