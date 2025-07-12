import { createContext, useState, useContext } from "react";

export const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [selectedIngredient, setSelectedIngredient] = useState([]);
  const clearIngredients = () => setSelectedIngredient([]);

  return (
    <RecipesContext.Provider
      value={{ selectedIngredient, setSelectedIngredient, clearIngredients }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useIngredients = () => useContext(RecipesContext);
