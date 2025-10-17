import axiosClient from "../lib/axios-client";
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserResponse,
  UsersListResponse,
} from "../interfaces/user.interface";
import { UserType } from "../enums/user-type.enum";

export const usersApi = {
  // Obtener todos los usuarios con paginación
  getUsers: async (
    page: number = 0,
    size: number = 10
  ): Promise<UsersListResponse> => {
    const response = await axiosClient.get(`/users?page=${page}&size=${size}`);
    return response.data;
  },

  // Obtener usuarios por tipo
  getUsersByType: async (
    userType: UserType
  ): Promise<{ data: User[]; message: string; success: boolean }> => {
    const response = await axiosClient.get(`/users/type/${userType}`);
    return response.data;
  },

  // Obtener usuario por ID
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },

  // Obtener usuario por email
  getUserByEmail: async (email: string): Promise<UserResponse> => {
    const response = await axiosClient.get(`/users/email/${email}`);
    return response.data;
  },

  // Crear nuevo usuario
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
  deleteUser: async (
    id: string
  ): Promise<{ data: null; message: string; success: boolean }> => {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  },

  // Desactivar usuario
  deactivateUser: async (
    id: string
  ): Promise<{ data: null; message: string; success: boolean }> => {
    const response = await axiosClient.patch(`/users/${id}/deactivate`);
    return response.data;
  },
};
