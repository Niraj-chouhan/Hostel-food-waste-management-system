import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth";
import { getDashboardPath, getUserRole } from "../utils/roles";

export const RequireAuth = ({ adminOnly = false, role }) => {
  const { isLoggedIn, user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="route-loader" role="status" aria-live="polite">
        <span className="route-loader__spinner" />
        <p>Preparing your dashboard...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (role && getUserRole(user) !== role) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }

  return <Outlet />;
};
