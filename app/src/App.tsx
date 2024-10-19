import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MyProjects from "./pages/MyProjects";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/MyProjects" element={<MyProjects />}>
          <Route index element={<MyProjects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
