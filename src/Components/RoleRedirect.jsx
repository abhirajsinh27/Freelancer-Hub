import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
 
function RoleRedirect() {
  const { user,loading } = useAuth();

  if (loading) {
    return <div className="bg-slate-900 text-white p-4  ">Loading authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role still loading
  if (user?.role === undefined) {
    return <div className="bg-slate-900 text-white p-4  ">Loading role...</div>;
  }

  if (user?.role === "client") {
    return <Navigate to="/client/dashboard" replace />;
  }

  if (user?.role === "freelancer") {
    return <Navigate to="/freelancer/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default RoleRedirect;