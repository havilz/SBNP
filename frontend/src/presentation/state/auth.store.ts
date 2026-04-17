import { create } from "zustand";

interface UserInfo {
  id: string;
  username: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: UserInfo | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
}

const getCachedUser = (): UserInfo | null => {
  try {
    const val = localStorage.getItem("sbnp_admin_user");
    if (!val || val === "undefined") return null;
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  // Inisialisasi mengecek apakah token sudah ada di memori persistent (localStorage)
  isAuthenticated: !!localStorage.getItem("sbnp_admin_token"),
  token: localStorage.getItem("sbnp_admin_token"),
  user: getCachedUser(),

  login: (token, user) => {
    // Simpan ke local storage agar terekam mesksi aplikasi ditutup
    localStorage.setItem("sbnp_admin_token", token);
    localStorage.setItem("sbnp_admin_user", JSON.stringify(user));
    
    set({
      isAuthenticated: true,
      token,
      user
    });
  },

  logout: () => {
    localStorage.removeItem("sbnp_admin_token");
    localStorage.removeItem("sbnp_admin_user");

    set({
      isAuthenticated: false,
      token: null,
      user: null
    });
  }
}));
