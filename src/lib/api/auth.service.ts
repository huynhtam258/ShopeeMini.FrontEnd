import { apiClient } from "./client";
import {
  ApiResponse,
  AuthResultDto,
  ChangePasswordRequestDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
  UserProfileDto,
} from "@/types";

export const authService = {
  async register(payload: RegisterRequestDto) {
    const res = await apiClient.post<ApiResponse<AuthResultDto>>("/auth/register", payload);
    return res.data.data;
  },

  async login(payload: LoginRequestDto) {
    const res = await apiClient.post<ApiResponse<AuthResultDto>>("/auth/login", payload);
    return res.data.data;
  },

  async refresh(payload: RefreshTokenRequestDto) {
    const res = await apiClient.post<ApiResponse<AuthResultDto>>("/auth/refresh", payload);
    return res.data.data;
  },

  async logout(payload: RefreshTokenRequestDto) {
    await apiClient.post<ApiResponse<null>>("/auth/logout", payload);
  },

  async getProfile() {
    const res = await apiClient.get<ApiResponse<UserProfileDto>>("/users/me");
    return res.data.data;
  },

  async changePassword(payload: ChangePasswordRequestDto) {
    const res = await apiClient.put<ApiResponse<null>>("/users/me/password", payload);
    return res.data.message;
  },
};
