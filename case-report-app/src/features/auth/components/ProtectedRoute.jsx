import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ isAuthenticated, userRole, allowedRoles }) {
  // If not logged in, boot back to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but does not have the right access permissions
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        You are not authorized to view this section.
      </div>
    );
  }

  // Render child routes nested inside this wrapper
  return <Outlet />;
}