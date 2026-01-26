import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService, { type RegisterData, type LoginData } from "@/services/authService";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.register(data);
          set({
            user,
            isAuthenticated: false, // User needs to login after registration
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Registration failed",
          });
          throw error;
        }
      },

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(data);
          const { token, user } = response;

          // Store token in localStorage (also persisted by zustand)
          if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", token);
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Login failed",
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authService.logout();
        } catch (error) {
          // Clear local state regardless; let caller show feedback
          throw error;
        } finally {
          // Clear token from localStorage and state even if API failed
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
          }

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync token to localStorage after rehydration
        if (state?.token && typeof window !== "undefined") {
          localStorage.setItem("auth_token", state.token);
        }
      },
    }
  )
);

