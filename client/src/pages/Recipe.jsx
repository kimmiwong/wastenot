import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Recipe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const getRecipe = async () => {
    try {
      setLoading(true);
      const itemResponse = await fetch("http://localhost:8000/api/food-items");

      if (!itemResponse.ok) {
        throw new Error(`${itemResponse.status}`);
      }

      const items = await itemResponse.json();
      const ingredients = items.map((item) => item.name);

      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=4`
      );

      const recipeId = await response.json();
      const id = recipeId.map((recipe) => recipe.id);

      const recipeInfo = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information`
      );
      const recipe = recipeInfo.map((recipe) => ({
        title: recipe.title,
        image: recipe.image,
        sourceURL: recipe.sourceURL,
      }));

      setRecipes(recipe);
    } catch (error) {
      console.error("Error occurred while loading recipes.", error);
    }
  };
  useEffect(() => {
    getRecipe();
  }, []);
}
