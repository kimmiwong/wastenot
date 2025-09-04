import { useEffect } from "react";
import { useUser } from "../context/UserProvider";
import { useNavigate } from "react-router-dom";
import { useIngredients } from "../context/RecipesContext";

const apiHost = import.meta.env.VITE_API_HOST;

export default function Logout() {
  const { clearUser } = useUser();
  const { clearIngredients } = useIngredients();
  const navigate = useNavigate();

  useEffect(() => {
    async function doLogout() {
      await fetch(`${apiHost}/api/logout`, { credentials: "include" });
      clearUser();
      clearIngredients();
      navigate("/");
    }

    doLogout();
  }, [navigate, clearUser, clearIngredients]);

  return (
    <>
      <h1>Logging out...</h1>
    </>
  );
}
