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

function RootApp() {
  const location = useLocation();
  const publicRoutes = ["/", "/login", "/ResetPassword"];
  const onPublicRoute = publicRoutes.includes(location.pathname);
  const shouldFetch = !onPublicRoute;

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
      <RootApp />
    </BrowserRouter>
  </StrictMode>
);
