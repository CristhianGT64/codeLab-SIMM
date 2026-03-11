import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import type { ReactNode } from "react";

interface PermissionGateProps {
  permiso: string;
  children: ReactNode;
  redirectTo?: string;
}

export default function PermissionGate({
  permiso,
  children,
  redirectTo = "/dashboard",
}: Readonly<PermissionGateProps>) {
  const { tienePermiso, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!tienePermiso(permiso)) {
    return redirectTo ? <Navigate to={redirectTo} replace /> : null;
  }

  return <>{children}</>;
}
