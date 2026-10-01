import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AuthResultDto, UserRole } from "@/types";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  setAuthResult: (result: AuthResultDto) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  updateProfile: (partial: Partial<AuthUser>) => void;
  clear: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      setAuthResult: (result) =>
        set({
          user: {
            id: result.userId,
            email: result.email,
            fullName: result.fullName,
            role: result.role,
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      updateProfile: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : state.user,
        })),
      clear: () => set({ user: null, accessToken: null, refreshToken: null }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "shopeemini-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function isAdmin(role: UserRole | undefined | null) {
  return role === "Admin";
}
