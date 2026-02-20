import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import Layout from "./layout/layout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FavoritePage from "./pages/FavoritePage";
import DetailPage from "./pages/DetailPage";

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
            <Route path="movies/:id" element={<DetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
