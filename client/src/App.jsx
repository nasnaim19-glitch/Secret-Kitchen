import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Cuisines from "./pages/Cuisines";
import Recipes from "./pages/Recipes";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Cuisines */}
        <Route path="/cuisines" element={<Cuisines />} />

        {/* Recipes */}
        <Route path="/recipes" element={<Recipes />} />

        {/* Authentication */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;