import SimpleHeader from "../components/Header";
import { useFavorites } from "../context/FavoritesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";


export default function Favorites() {
  const { selectedFavorites, deleteFavorite } = useFavorites();

  return (
    <div>
      <SimpleHeader />
      <ul>
        {selectedFavorites.map((recipe) => (
          <li key={recipe.id}>
            <h3 className="fav-title">{recipe.title}</h3>
            <img src={recipe.image} alt={recipe.title} />
            <a
              href={recipe.sourecUrl}
              target="blank"
              rel="noopener nonreferrer"
            >
              View Recipe
            </a>
            <button onClick={() => deleteFavorite(recipe.id)}>
              <FontAwesomeIcon icon={faTrashCan} />
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
}
