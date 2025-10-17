import { useContext } from "react";
import { AuthContext } from "../context/auth/auth-context";
import { UserType } from "../enums/user-type.enum";

export const useRole = () => {
  const { user } = useContext(AuthContext);

  const isAdmin = user?.userType === UserType.ADMIN;
  const isEmployee = user?.userType === UserType.EMPLOYEE;
  const isClient = user?.userType === UserType.CLIENT;
  const hasRole = (role: UserType) => user?.userType === role;
  const hasAnyRole = (roles: UserType[]) =>
    roles.includes(user?.userType || UserType.CLIENT);

  return {
    userType: user?.userType,
    isAdmin,
    isEmployee,
    isClient,
    hasRole,
    hasAnyRole,
  };
};
