export enum UserType {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
  CLIENT = "CLIENT",
}

export const UserTypeLabels = {
  [UserType.ADMIN]: "Administrador",
  [UserType.EMPLOYEE]: "Empleado",
  [UserType.CLIENT]: "Cliente",
};
