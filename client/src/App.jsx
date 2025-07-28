import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipe from "./components/GetRecipe";
import Compost from "./pages/Compost";
import "./App.css";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Instructions from "./pages/Instructions";
import Layout from "./components/Layout";
import DevBanner from "./components/DevBanner";

export default function App() {
  return (
    <>
      <DevBanner />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/Favorites" element={<Favorites />} />
          <Route path="/Compost" element={<Compost />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/Instructions" element={<Instructions />} />
        </Route>
      </Routes>
    </>
  );
}
