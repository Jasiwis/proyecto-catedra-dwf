import type { ApiResponse } from "../interfaces/api.interface";
import type {
  LoginDto,
  LoginResponse,
  UserDto,
  UserResponse,
} from "../interfaces/auth.interface";
import axiosClient from "../lib/axios-client";

export const register = async (
  data: UserDto
): Promise<ApiResponse<UserResponse>> => {
  const response = await axiosClient.post<ApiResponse<UserResponse>>(
    "/auth/register",
    data
  );
  return response.data;
};

export const login = async (
  data: LoginDto
): Promise<ApiResponse<LoginResponse>> => {
  const response = await axiosClient.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    data
  );
  return response.data;
};

export const getProfile = async (): Promise<ApiResponse<UserResponse>> => {
  const response = await axiosClient.get<ApiResponse<UserResponse>>("/auth/me");
  return response.data;
};
