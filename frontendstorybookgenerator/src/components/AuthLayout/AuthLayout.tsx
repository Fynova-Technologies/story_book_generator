import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store/store";

interface ProtectedProps {
  children: React.ReactNode;
  authentication?: boolean;
}

export default function Protected({
  children,
  authentication = true,
}: ProtectedProps) {
  const { status, authInitialized } = useSelector(
    (state: RootState) => state.auth
  );

  // Wait until Firebase finishes checking auth state
  if (!authInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1>Loading...</h1>
      </div>
    );
  }

  // Protected pages (Dashboard, Profile, etc.)
  if (authentication && !status) {
    return <Navigate to="/login" replace />;
  }

  // Public pages (Login, Signup)
  if (!authentication && status) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}