import { createContext, useState, useContext } from "react";

export const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [selectedIngredient, setSelectedIngredient] = useState([]);

  return (
    <RecipesContext.Provider
      value={{ selectedIngredient, setSelectedIngredient }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export const useIngredients = () => useContext(RecipesContext);
