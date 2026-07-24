import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Cuisines from "./pages/Cuisines";
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/cuisines" element={<Cuisines />} />

        <Route path="/recipes" element={<Recipes />} />

        <Route
          path="/recipes/:id"
          element={<RecipeDetails />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;