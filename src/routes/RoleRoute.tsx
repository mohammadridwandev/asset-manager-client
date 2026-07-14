import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "../context/useAdmin";


type Role = "ADMIN" | "IT" | "FINANCE" | "GUEST";

type Props = {
  children: ReactNode;
  roles: Role[];
};

export default function RoleRoute({
  children,
  roles,
}: Props) {

  const { hasRole } = useRole();

  if (!hasRole(roles)) {
    return <Navigate to="/dashboard" replace />;
  }


  return <>{children}</>;
}