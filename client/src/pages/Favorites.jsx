import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import RecipeCarousel from "../components/RecipeCarousel";

export default function Favorites() {
  const { selectedFavorites } = useFavorites();

  return (
    <div className="page-content">
      <div className="back-link">
        <Link to="/recipe" className="back-button">
          <FontAwesomeIcon icon={faLeftLong} />
          Back to Recipes
        </Link>
      </div>
      <div className="carousel-wrapper">
        <h1>Favorite Recipes</h1>
        {selectedFavorites.length > 0 ? (
          <RecipeCarousel recipes={selectedFavorites} showTrashInsteadOfHeart />
        ) : (
          <p>You have not favorited any recipes yet</p>
        )}
      </div>
    </div>
  );
}
