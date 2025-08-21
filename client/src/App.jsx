import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipe from "./components/GetRecipe";
import Compost from "./pages/Compost";
import "./App.css";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Layout from "./components/Layout";
import DevBanner from "./components/DevBanner";
import HouseholdInfo from "./pages/HouseholdInfo";
import LandingPage from "./components/LandingPage";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <>
      <DevBanner />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/Home" element={<Home />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/Favorites" element={<Favorites />} />
          <Route path="/Compost" element={<Compost />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/HouseholdInfo" element={<HouseholdInfo />} />
        </Route>
      </Routes>
    </>
  );
}
