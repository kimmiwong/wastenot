import { useEffect, useState } from "react";
import RecipeCarousel from "../components/RecipeCarousel";
import SimpleHeader from "../components/Header";
import { useContext } from "react";
import { useIngredients } from "../context/RecipesContext";

export default function Recipe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const { selectedIngredient } = useIngredients();
  const getRecipe = async () => {
    try {
      setLoading(true);
      console.log("selectedIngredient:", selectedIngredient);
      const ingredients = selectedIngredient
        .map((name) => name.trim().toLowerCase().split(" ").join("+"))
        .join(",+");

      const response = await fetch(
        `http://localhost:8000/api/recipes?ingredients=${ingredients}`
      );
      console.log("Fetching recipes with:", ingredients);
      console.log(
        `URL: http://localhost:8000/api/recipes?ingredients=${ingredients}`
      );
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error occurred while loading recipes.", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getRecipe();
  }, [selectedIngredient]);

  return (
    <div className="page-content">
      <SimpleHeader />
      <div className="carousel-wrapper">
        <h2>Recipe Carousel</h2>
        {loading && <p>Loading...</p>}
        {error && <p>Error loading recipes.</p>}
        {!loading && !error && <RecipeCarousel recipes={recipes} />}
      </div>
    </div>
  );
}
