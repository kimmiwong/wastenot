import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import App from "./App.jsx";
import { RecipesProvider } from "./context/RecipesContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <RecipesProvider>
          <App />
        </RecipesProvider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
