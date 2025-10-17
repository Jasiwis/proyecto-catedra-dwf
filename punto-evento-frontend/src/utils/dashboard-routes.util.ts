import { UserType } from "../enums/user-type.enum";

export const getDashboardRoute = (userType: UserType): string => {
  switch (userType) {
    case UserType.ADMIN:
      return "/admin/dashboard";
    case UserType.CLIENT:
      return "/client/dashboard";
    case UserType.EMPLOYEE:
      return "/employee/dashboard";
    default:
      return "/";
  }
};

export const getDefaultRoute = (userType: UserType): string => {
  switch (userType) {
    case UserType.ADMIN:
      return "/admin/quotes";
    case UserType.CLIENT:
      return "/client/requests";
    case UserType.EMPLOYEE:
      return "/employee/tasks";
    default:
      return "/";
  }
};
