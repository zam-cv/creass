import "./App.css";
import {Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from "./pages/Home";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={
              <Home />
            } /> 
          </Route>
      </Routes>
    </BrowserRouter>
  )
}