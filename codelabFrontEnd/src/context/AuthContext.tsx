import { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import type { LoginUserData } from "../interfaces/LoginResponse";
import type { AuthContextType } from "../interfaces/Auth/AuthContextTypeInterface";
import { getRolById } from "../services/RolesService";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const PERMISOS_KEY = "permisos";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<LoginUserData | null>(null);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPermisos = async (rolId: string) => {
    try {
      const response = await getRolById(rolId);
      const nombres = response.data.permisos.map((p) => p.nombre);
      setPermisos(nombres);
      localStorage.setItem(PERMISOS_KEY, JSON.stringify(nombres));
    } catch {
      setPermisos([]);
      localStorage.removeItem(PERMISOS_KEY);
    }
  };

  // Cargar usuario y permisos desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPermisos = localStorage.getItem(PERMISOS_KEY);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as LoginUserData;
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("user");
      }
    }

    if (storedPermisos) {
      try {
        setPermisos(JSON.parse(storedPermisos) as string[]);
      } catch {
        localStorage.removeItem(PERMISOS_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (userData: LoginUserData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    await fetchPermisos(userData.rol.id);
  };

  const logout = () => {
    setUser(null);
    setPermisos([]);
    localStorage.removeItem("user");
    localStorage.removeItem(PERMISOS_KEY);
  };

  const tienePermiso = useCallback(
    (nombre: string) => permisos.includes(nombre),
    [permisos],
  );

  const value: AuthContextType = useMemo(
    () => ({
      user,
      permisos,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      tienePermiso,
    }),
    [user, permisos, isLoading, tienePermiso],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
