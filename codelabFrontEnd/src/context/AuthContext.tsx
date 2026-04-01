import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import type { LoginUserData } from "../interfaces/LoginResponse";
import { getRolById } from "../services/RolesService";
import type { AuthContextType } from "../interfaces/Auth/AuthContextTypeInterface";
import { AuthContext } from "./AuthContextInstance";

interface AuthProviderProps {
  children: ReactNode;
}

const PERMISOS_KEY = "permisos";

const normalizePermissionName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<LoginUserData | null>(null);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPermisos = useCallback(async (rolId: string) => {
    try {
      const response = await getRolById(rolId);
      const nombres = response.data.permisos.map((p) => p.nombre);
      setPermisos(nombres);
      localStorage.setItem(PERMISOS_KEY, JSON.stringify(nombres));
    } catch {
      setPermisos([]);
      localStorage.removeItem(PERMISOS_KEY);
    }
  }, []);

  // Cargar usuario desde localStorage y refrescar permisos desde API.
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedPermisos = localStorage.getItem(PERMISOS_KEY);

      let parsedUser: LoginUserData | null = null;

      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser) as LoginUserData;
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

      if (parsedUser?.rol?.id) {
        await fetchPermisos(parsedUser.rol.id);
      }

      setIsLoading(false);
    };

    void initAuth();
  }, [fetchPermisos]);

  const login = useCallback(async (userData: LoginUserData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    await fetchPermisos(userData.rol.id);
  }, [fetchPermisos]);

  const logout = useCallback(() => {
    setUser(null);
    setPermisos([]);
    localStorage.removeItem("user");
    localStorage.removeItem(PERMISOS_KEY);
  }, []);

  const tienePermiso = useCallback(
    (nombre: string) => {
      const normalizedTarget = normalizePermissionName(nombre);
      return permisos.some(
        (permiso) => normalizePermissionName(permiso) === normalizedTarget,
      );
    },
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
    [user, permisos, isLoading, login, logout, tienePermiso],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
