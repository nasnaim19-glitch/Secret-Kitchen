import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Cuisines from "./pages/Cuisines";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cuisines" element={<Cuisines />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;