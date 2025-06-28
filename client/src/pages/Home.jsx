import { Link } from "react-router-dom";
import ShowItems from "../components/ShowItems";
import AddItem from "../components/AddItem";
import SimpleHeader from "../components/Header";
import { useIngredients } from "../context/RecipesContext";
import { useUser } from "../context/UserProvider";

export default function Home() {
  const { setSelectedIngredient } = useIngredients();

  // useUser provides the current user and a refresh function from context.
  const { user } = useUser();

  return (
    <div className="page-content">
      <SimpleHeader />

      {"Show user info if logged in, else show a generic message"}
      <div>
        {user ? (
          <>
            <p>
              Welcome, <b>{user.username}</b>!
            </p>
            <Link to="/logout">Logout</Link>
          </>
        ) : (
          <>
            <p>You are not logged in.</p>
            <Link to="/login">Login</Link> | <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
      <div>
        {/* <AddItem /> */}
        <ShowItems />
      </div>
      <div className="recipe-button-wrapper">
        <Link to="/recipe" className="recipe-button">
          Generate Recipe
        </Link>
        <button
          type="button"
          onClick={() => setSelectedIngredient([])}
          className="clear-button"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
}
