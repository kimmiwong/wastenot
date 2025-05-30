import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import App from "./App.jsx";
import { RecipesProvider } from "./context/RecipesContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";

import { NotificationsProvider } from "./context/NotificationsContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <RecipesProvider>
          <NotificationsProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </NotificationsProvider>
        </RecipesProvider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
