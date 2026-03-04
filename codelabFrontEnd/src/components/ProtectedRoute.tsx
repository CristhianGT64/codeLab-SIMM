import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

/**
 * Componente para proteger rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige al login.
 * Mientras se verifica la sesión, muestra un loading.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#4a6eb0] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#4a6eb0] font-semibold">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;
