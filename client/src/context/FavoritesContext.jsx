import { createContext, useState, useEffect, useContext } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [selectedFavorites, setSelectedFavorites] = useState(() => {
    const stored = localStorage.getItem("selectedFavorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "selectedFavorites",
      JSON.stringify(selectedFavorites)
    );
  }, [selectedFavorites]);

  const addFavorite = (recipe) => {
    setSelectedFavorites((selectedFavorites) =>
      selectedFavorites.some((fav_recipe) => fav_recipe.id === recipe.id)
        ? selectedFavorites
        : [...selectedFavorites, recipe]
    );
  };

  const deleteFavorite = (id) => {
    setSelectedFavorites((selectedFavorites) =>
      selectedFavorites.filter((recipe) => recipe.id !== id)
    );
  };

  const toggleFavorite = (recipe) => {
    setSelectedFavorites((selectedFavorites) =>
      selectedFavorites.some((fav_recipe) => fav_recipe.id === recipe.id)
        ? selectedFavorites.filter((fav_recipe) => fav_recipe.id !== recipe.id)
        : [...selectedFavorites, recipe]
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        selectedFavorites,
        setSelectedFavorites,
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
