import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import NotFound from "./components/NotFound/NotFound";
import Header from "./components/shared/Header/Header";
import Footer from "./components/shared/Footer/Footer";
import Login from "./components/Login/Login.jsx";
import Logout from "./components/Logout/Logout";
import Register from "./components/Register/Register";

function App() {
  const token = localStorage.getItem("jwt");
  console.log(token);
  return (
    <BrowserRouter>
      <Header />
      <div className="App">
        <Routes>
          {localStorage.getItem("jwt") ? (
            <>
              <Route exact path="/" element={<HomePage />} />
              <Route exact path="/logout" element={<Logout />} />
            </>
          ) : (
            <>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/register" element={<Register />} />
            </>
          )}

          <Route exact path="/*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
