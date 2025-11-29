import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import VenueDetail from "./pages/VenueDetailPage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
    const token = localStorage.getItem("token");

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                // Routes içine:
                <Route path="/favorites" element={token ? <FavoritesPage /> : <Navigate to="/login" />} />
                <Route path="/venue/:id" element={token ? <VenueDetail /> : <Navigate to="/login" />} />

                <Route path="/home" element={token ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;