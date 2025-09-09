import type { ApiResponse } from "../interfaces/api.interface";
import type {
  EmployeeDto,
  EmployeeResponse,
} from "../interfaces/employee.interface";
import axiosClient from "../lib/axios-client";

export const getAllEmployees = async (): Promise<
  ApiResponse<EmployeeResponse[]>
> => {
  const response = await axiosClient.get<ApiResponse<EmployeeResponse[]>>(
    "employees"
  );
  return response.data;
};

export const getEmployeeById = async (
  employeeId: string
): Promise<ApiResponse<EmployeeResponse>> => {
  const response = await axiosClient.get<ApiResponse<EmployeeResponse>>(
    `employees/${employeeId}`
  );
  return response.data;
};

export const createEmployee = async (
  data: EmployeeDto
): Promise<ApiResponse<EmployeeResponse>> => {
  const response = await axiosClient.post<ApiResponse<EmployeeResponse>>(
    "employees",
    data
  );
  return response.data;
};

export const updateEmployee = async (
  employeeId: string,
  data: EmployeeDto
): Promise<ApiResponse<EmployeeResponse>> => {
  const response = await axiosClient.put<ApiResponse<EmployeeResponse>>(
    `employees/${employeeId}`,
    data
  );
  return response.data;
};

export const updateEmployeeStatus = async (
  employeeId: string
): Promise<ApiResponse<EmployeeResponse>> => {
  const response = await axiosClient.put<ApiResponse<EmployeeResponse>>(
    `employees/status/${employeeId}`
  );
  return response.data;
};
