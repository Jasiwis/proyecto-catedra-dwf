import { UserType } from "../enums/user-type.enum";

export interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  userType: UserType;
  active?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  userType?: UserType;
  active?: boolean;
}

export interface UserResponse {
  data: User;
  message: string;
  success: boolean;
}

export interface UsersListResponse {
  data: {
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  message: string;
  success: boolean;
}
