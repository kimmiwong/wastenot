import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import App from "./App.jsx";
import { RecipesProvider } from "./context/RecipesContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { UserProvider } from "./context/UserProvider.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";

function ProvidersWrapper() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const isPublicRoute =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/resetpassword");

  const shouldFetch = !isPublicRoute;

  return (
    <UserProvider shouldFetch={shouldFetch}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <RecipesProvider>
          <NotificationsProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </NotificationsProvider>
        </RecipesProvider>
      </MantineProvider>
    </UserProvider>
  );
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProvidersWrapper />
    </BrowserRouter>
  </StrictMode>
);
