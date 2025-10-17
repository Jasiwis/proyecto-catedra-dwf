import type { ApiResponse } from "../interfaces/api.interface";

export const getErrorFromResponse = (
  response: ApiResponse<unknown>
): string => {
  if (response?.errors) {
    return (
      response.errors[0].message ?? response.message ?? "Error desconocido"
    );
  }
  return response?.message ?? "Error desconocido";
};
