import type { LoginUserData } from "../LoginResponse";

export interface AuthContextType {
  user: LoginUserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: LoginUserData) => void;
  logout: () => void;
}