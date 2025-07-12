import { useEffect } from "react";
import { useUser } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import { useIngredients } from "../context/RecipesContext";

const apiHost = import.meta.env.VITE_API_HOST;

/**
 * Logout component. Calls the backend logout endpoint, refreshes user context, and redirects to home.

 */
export default function Logout() {
  const { refreshUser } = useUser();
  const { clearIngredients } = useIngredients();
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Calls the logout API and refreshes user state.

     */
    async function doLogout() {
      // Call the backend logout endpoint. 'credentials: "include"' ensures cookies (the session) are sent.
      await fetch(`${apiHost}/api/logout`, { credentials: "include" });
      clearIngredients();
      // After logging out, update the user context so the app knows the user is logged out.
      refreshUser();
      // Use React Router's navigate to redirect to the home page without a full reload.
      navigate("/");
    }
    // useEffect runs after the component mounts. We call doLogout() once, on mount.
    doLogout();
  }, [navigate, refreshUser, clearIngredients]); // Add navigate and refreshUser to dependencies.

  return (
    <>
      <h1>Logging out...</h1>
    </>
  );
}
