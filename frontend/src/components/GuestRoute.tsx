import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface GuestRouteProps {
  children: ReactNode; // <- more flexible than JSX.Element
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { user } = useAuth();

  if (user) {
    // Redirect logged-in users to homepage/dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // wrap in fragment to render any ReactNode
}
