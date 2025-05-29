import { useFavorites } from "../context/FavoritesContext";

export default function RecipeCard({ recipe }) {
  const { addFavorite } = useFavorites();
  return (
    <div className="recipe-card">
      <h3 className="recipe-title">{recipe.title}</h3>
      <button onClick={() => addFavorite(recipe)}>Favorite</button>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      )}
      <a
        href={recipe.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="recipe-link"
      >
        View Instructions
      </a>
    </div>
  );
}
