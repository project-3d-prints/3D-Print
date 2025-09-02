import { create } from "zustand";

interface AuthState {
  user: { username: string; role: string; token?: string } | null;
  isAuthenticated: boolean;
  setUser: (
    user: { username: string; role: string; token?: string } | null
  ) => void;
  setAuth: (auth: { token: string; role: string; username: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuth: (auth) =>
    set({
      isAuthenticated: true,
      user: { username: auth.username, role: auth.role, token: auth.token },
    }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
