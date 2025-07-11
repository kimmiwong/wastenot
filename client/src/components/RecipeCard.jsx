import { useFavorites } from "../context/FavoritesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function RecipeCard({ recipe, showTrashInsteadOfHeart }) {
  const { selectedFavorites, toggleFavorite, deleteFavorite } = useFavorites();
  const isSelected = selectedFavorites.some(
    (fav) =>
      fav.recipe_id === recipe.recipe_id ||
      fav.recipe_id === recipe.id?.toString()
  );

  const handleClick = () => {
    if (showTrashInsteadOfHeart) {
      deleteFavorite(recipe.id);
    } else {
      toggleFavorite(recipe);
    }
  };

  const imageSrc = recipe.image || recipe.image_url;

  return (
    <div className="recipe-card">
      <h3 className="recipe-title">{recipe.title}</h3>
      {imageSrc && (
        <img src={imageSrc} alt={recipe.title} className="recipe-image" />
      )}
      <a
        href={recipe.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="recipe-link"
      >
        View Instructions
      </a>
      <button onClick={handleClick} className="fav-button">
        {showTrashInsteadOfHeart ? (
          <FontAwesomeIcon icon={faTrashCan} />
        ) : isSelected ? (
          <FontAwesomeIcon icon={faHeart} style={{ color: "#eb6424" }} />
        ) : (
          <FontAwesomeIcon icon={faHeartRegular} style={{ color: "#eb6424" }} />
        )}
      </button>
    </div>
  );
}
