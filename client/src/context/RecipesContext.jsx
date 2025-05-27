import { createContext, useState, useContext } from "react";

export const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
  const [selectedIngredient, setSelectedIngredient] = useState([]);
  return (
    <div>
      <RecipesContext.Provider
        value={{ selectedIngredient, setSelectedIngredient }}
      >
        {children}
      </RecipesContext.Provider>
    </div>
  );
};

export const useIngredients = () => useContext(RecipesContext);
