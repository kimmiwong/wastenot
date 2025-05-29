import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import Compost from "./pages/Compost";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Recipe" element={<Recipe />} />
      <Route path="/Compost" element={<Compost />} />
    </Routes>
  );
}
