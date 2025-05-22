import { useEffect, useState } from "react";
import { Link } from "react-router";
import selectedIngredient from './components/ShowItems' //importing the ingredients that the user clicked

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
      const ingredients = items
      // we need to make ingredients just the things that the user selected
        .map((item) => item.name.trim().toLowerCase())
        .join(",+");

      const response = await fetch(
        `http://localhost:8000/api/recipes?ingredients=${ingredients}`
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
  }, []);

  return (
    <>
      <div>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <div>
                <h3>{recipe.title}</h3>
                <img src={recipe.image} alt={recipe.title} />
                <p>
                  <a href={recipe.sourceUrl}>View Instructions</a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
