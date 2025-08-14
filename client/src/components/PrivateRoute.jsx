import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

export default function PrivateRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}
