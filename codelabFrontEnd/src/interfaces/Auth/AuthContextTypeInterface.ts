import type { LoginUserData } from "../LoginResponse";

export interface AuthContextType {
  user: LoginUserData | null;
  permisos: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: LoginUserData) => Promise<void>;
  logout: () => void;
  tienePermiso: (nombre: string) => boolean;
}