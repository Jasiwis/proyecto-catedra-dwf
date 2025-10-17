export interface UserDto {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse extends UserDto {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}
