import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

interface ProtectedRouteProps {
  // You can add any props you need for the protected route here
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to={"/login"} replace></Navigate>;
}
