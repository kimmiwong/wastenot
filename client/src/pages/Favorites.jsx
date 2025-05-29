import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { selectedFavorites } = useFavorites();
  return (
    <div>
      <ul>
        {selectedFavorites.map((recipe) => (
          <li key={recipe.id}>
            <img src={recipe.image} alt={recipe.title} />
            <a
              href={recipe.sourecUrl}
              target="blank"
              rel="noopener nonreferrer"
            >
              View Recipe
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
