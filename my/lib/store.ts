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
  setAuth: (auth) => {
    document.cookie = `user_role=${auth.role}; path=/; max-age=86400`;
    set({
      isAuthenticated: true,
      user: { username: auth.username, role: auth.role, token: auth.token },
    });
  },
  clearAuth: () => {
    document.cookie = "user_role=; path=/; max-age=0";
    document.cookie = "session_id=; path=/; max-age=0";
    set({ user: null, isAuthenticated: false });
  },
}));
