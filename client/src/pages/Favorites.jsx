import { useNavigate } from "react-router-dom";
import SimpleHeader from "../components/Header";
import { useFavorites } from "../context/FavoritesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import RecipeCarousel from "../components/RecipeCarousel";

export default function Favorites() {

  const { selectedFavorites } = useFavorites();
  const navigate = useNavigate();

  return (

    <div className="page-content">
      <SimpleHeader />
      <div className="back-link">
        <button className="back-button" onClick={() => navigate("/recipe")}>
          {" "}
          <FontAwesomeIcon icon={faLeftLong} />
          Back to Recipes
        </button>
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
