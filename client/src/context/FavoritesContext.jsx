import { createContext, useState, useContext } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const addFavorite = (recipe) => {
    setSelectedFavorites((selectedFavorites) => [...selectedFavorites, recipe]);
  };
  const deleteFavorite = (id) => {
    setSelectedFavorites((selectedFavorites) =>
      selectedFavorites.filter((recipe) => recipe.id !== id)
    );
  };
  return (
    <FavoritesContext.Provider
      value={{
        selectedFavorites,
        setSelectedFavorites,
        addFavorite,
        deleteFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
