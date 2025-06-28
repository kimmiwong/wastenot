import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipe from "./components/GetRecipe";
import Compost from "./pages/Compost";
import "./App.css";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/recipe" element={<Recipe />} />
      <Route path="/Favorites" element={<Favorites />} />
      <Route path="/Compost" element={<Compost />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}
