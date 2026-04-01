import { useContext } from "react";
import { AuthContext } from "../context/AuthContextInstance";

/**
 * Hook para acceder al contexto de autenticación
 * Proporciona: user, isAuthenticated, isLoading, login, logout
 * 
 * Ejemplo de uso:
 * const { user, isAuthenticated, logout } = useAuth();
 * 
 * Acceder a datos del usuario:
 * - user?.id
 * - user?.correo
 * - user?.nombreCompleto
 * - user?.usuario
 * - user?.rol.nombre
 * - user?.sucursal.nombre
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  
  return context;
};

export default useAuth;
