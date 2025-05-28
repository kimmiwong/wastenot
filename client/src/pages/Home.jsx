import { Link } from "react-router-dom";
import ShowItems from "../components/ShowItems";
import AddItem from "../components/AddItem";
import SimpleHeader from "../components/Header";
import Notification from "../components/Notification";
import { useIngredients } from "../context/RecipesContext";

export default function Home() {
  const { selectedIngredient, setSelectedIngredient } = useIngredients();
  return (
    <div className="page-content">
      <SimpleHeader />
      <div>
        <Notification />
        <AddItem />
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
