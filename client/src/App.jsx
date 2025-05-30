import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipe from "./components/GetRecipe";
import Compost from "./pages/Compost";
import "./App.css";
import Favorites from "./pages/Favorites";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Recipe" element={<Recipe />} />
      <Route path="/Favorites" element={<Favorites />} />
      <Route path="/Compost" element={<Compost />} />
    </Routes>
  );
}
