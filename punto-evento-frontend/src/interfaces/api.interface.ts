export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Errors[];
}

export interface Errors {
  field: string;
  message?: string;
}
