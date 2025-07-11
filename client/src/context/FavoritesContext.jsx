import { createContext, useState, useEffect, useContext } from "react";

export const FavoritesContext = createContext();
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const FavoritesProvider = ({ children }) => {
  const [selectedFavorites, setSelectedFavorites] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`${baseUrl}/api/favorite-recipes`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setSelectedFavorites(data);
        } else {
          console.error("Failed to fetch favorites");
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    }
    fetchFavorites();
  }, []);

  const addFavorite = async (recipe) => {
    try {
      const res = await fetch(`${baseUrl}/api/favorite-recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(recipe),
      });
      if (res.ok) {
        const newFavorite = await res.json();
        setSelectedFavorites((prev) => [...prev, newFavorite]);
      }
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  const deleteFavorite = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/api/favorite-recipes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setSelectedFavorites((prev) =>
          prev.filter((favorite) => favorite.recipe_id !== id)
        );
      }
    } catch (err) {
      console.error("Error deleting favorite:", err);
    }
  };

  const toggleFavorite = (recipe) => {
    const alreadyFavorite = selectedFavorites.some(
      (favorite) =>
        favorite.recipe_id === recipe.recipe_id ||
        favorite.recipe_id === recipe.id?.toString()
    );
    const formattedRecipe = {
      recipe_id: recipe.recipe_id || recipe.id.toString(),
      title: recipe.title,
      image_url: recipe.image_url || recipe.image || null,
    };
    if (alreadyFavorite) {
      deleteFavorite(formattedRecipe.recipe_id);
    } else {
      addFavorite(formattedRecipe);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        selectedFavorites,
        addFavorite,
        deleteFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
