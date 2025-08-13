import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

export default function PrivateRoute({ children }) {
  const { user } = useUser();

  return user ? children : <Navigate to="/" replace />;
}
