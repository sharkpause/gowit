import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter> */}
      <HomePage />
    </>
  );
}

export default App;
