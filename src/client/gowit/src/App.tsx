import "./App.css";
import { BrowserRouter, Route, Router, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import Layout from "./layout/layout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FavoritePage from "./pages/FavoritePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route path="" element={<HomePage />} />
            <Route path="watchlist" element={<FavoritePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
