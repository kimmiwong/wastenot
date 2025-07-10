import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import ShowItems from "../components/ShowItems";
import AddItem from "../components/AddItem";
import SimpleHeader from "../components/Header";
import CreateHousehold from "../components/CreateHousehold";
import { useIngredients } from "../context/RecipesContext";
import { useUser } from "../context/UserProvider";

export default function Home() {
  const { setSelectedIngredient } = useIngredients();
  // useUser provides the current user and a refresh function from context.
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="page-content">
      <SimpleHeader />

      <div>
        <AddItem />

        <div className="household-wrapper">
          <button
            className="household-button"
            onClick={() => setIsModalOpen(true)}
          >
            Create Household
          </button>
        </div>

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
      <CreateHousehold
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
