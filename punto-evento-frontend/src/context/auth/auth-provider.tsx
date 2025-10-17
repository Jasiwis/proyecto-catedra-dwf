import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./auth-context";
import { getProfile, login as loginAxios } from "../../api/auth";
import type { UserResponse } from "../../interfaces/auth.interface";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const userData = await getProfile();
      setUser(userData.data ?? null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<UserResponse> => {
    const userData = await loginAxios({ email, password });
    localStorage.setItem("token-catedra", userData.data?.token ?? "");

    const userFromApi = await getProfile();
    setUser(userFromApi.data ?? null);

    return userFromApi.data;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("token-catedra");
    window.location.href = "/";
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
