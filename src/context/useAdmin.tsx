import { useAuth } from "./AuthProvider";

export type Role = "ADMIN" | "IT" | "FINANCE" | "GUEST";

export const useRole = () => {
  const { user } = useAuth();

  const role = user?.role as Role | undefined;

  const hasRole = (roles: Role | Role[]) => {
    if (!role) return false;

    return Array.isArray(roles)
      ? roles.includes(role)
      : role === roles;
  };

  
  return {
    role,
    hasRole,
    isAdmin: hasRole("ADMIN"),
    isIT: hasRole("IT"),
    isFinance: hasRole("FINANCE"),
    isGuest: hasRole("GUEST"),
  };
};