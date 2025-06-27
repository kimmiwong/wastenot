// @ts-check
import { useEffect } from "react";
import { useUser } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

/**
 * Logout component. Calls the backend logout endpoint, refreshes user context, and redirects to home.
 * @returns {import('react').ReactElement}
 */
export default function Logout() {
  const { refreshUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Calls the logout API and refreshes user state.
     * @returns {Promise<void>}
     */
    async function doLogout() {
      // Call the backend logout endpoint. 'credentials: "include"' ensures cookies (the session) are sent.
      await fetch(`${API_BASE}/api/logout`, { credentials: "include" });
      // After logging out, update the user context so the app knows the user is logged out.
      refreshUser();
      // Use React Router's navigate to redirect to the home page without a full reload.
      navigate("/");
    }
    // useEffect runs after the component mounts. We call doLogout() once, on mount.
    doLogout();
  }, [navigate, refreshUser]); // Add navigate and refreshUser to dependencies.

  return (
    <>
      <h1>Logging out...</h1>
    </>
  );
}
