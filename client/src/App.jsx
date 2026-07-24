import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Cuisines from "./pages/Cuisines";
import Recipes from "./pages/Recipes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cuisines" element={<Cuisines />} />
        <Route path="/recipes" element={<Recipes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;