import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserProvider";

export default function PrivateRoute() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
