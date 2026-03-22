import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Wraps a page component and redirects unauthenticated users to /auth.
 * Centralises the auth guard so individual pages stay clean.
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return null; // AuthProvider controls the loading skeleton at the page level
  if (!user) return null;

  return <>{children}</>;
}
