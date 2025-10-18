import type { ApiResponse } from "../interfaces/api.interface";
import axiosClient from "../lib/axios-client";

export interface User {
  id: string;
  name: string;
  email: string;
  userType: "ADMIN" | "EMPLOYEE" | "CLIENT";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  userType: "ADMIN" | "EMPLOYEE" | "CLIENT";
  active?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  userType?: "ADMIN" | "EMPLOYEE" | "CLIENT";
  active?: boolean;
}

export interface UsersResponse {
  data: User[];
  message: string;
  success: boolean;
}

export interface UserResponse {
  data: User;
  message: string;
  success: boolean;
}

export const usersApi = {
  // Obtener todos los usuarios
  getAllUsers: async (): Promise<UsersResponse> => {
    const response = await axiosClient.get("/users");
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },

  // Obtener usuarios por tipo
  getUsersByType: async (
    userType: "ADMIN" | "EMPLOYEE" | "CLIENT"
  ): Promise<UsersResponse> => {
    const response = await axiosClient.get(`/users/type/${userType}`);
    return response.data;
  },

  // Crear usuario
  createUser: async (userData: CreateUserRequest): Promise<UserResponse> => {
    const response = await axiosClient.post("/users", userData);
    return response.data;
  },

  // Actualizar usuario
  updateUser: async (
    id: string,
    userData: UpdateUserRequest
  ): Promise<UserResponse> => {
    const response = await axiosClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Eliminar usuario
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  },

  // Desactivar usuario
  deactivateUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosClient.patch(`/users/${id}/deactivate`);
    return response.data;
  },
};
