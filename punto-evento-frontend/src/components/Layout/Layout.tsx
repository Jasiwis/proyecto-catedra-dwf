import React from "react";
import Header from "../Header/Header";
import { useAuth } from "../../hooks/use-auth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        userName={user?.name}
        onLogout={logout}
      />
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
