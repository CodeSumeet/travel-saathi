import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  console.log("IS AUTHENTICATED protected: ", isAuthenticated);

  if (loading) {
    // You can return a loading spinner here or simply null
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
