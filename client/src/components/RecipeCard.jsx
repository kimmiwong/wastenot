import { useFavorites } from "../context/FavoritesContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from "@fortawesome/free-solid-svg-icons"

export default function RecipeCard({ recipe }) {
    const { addFavorite } = useFavorites();
    return (
        <div className="recipe-card">
            <h3 className="recipe-title">{recipe.title}</h3>
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
            <button onClick={() => addFavorite(recipe)} className="fav-button"><FontAwesomeIcon icon={faHeart} style={{ color: "#eb6424", }} /></button>
        </div>
    );
}
