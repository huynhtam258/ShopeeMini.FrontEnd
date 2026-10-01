import { UserRole } from "./enums";

export interface RegisterRequestDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string | null;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResultDto {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface UserProfileDto {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}
