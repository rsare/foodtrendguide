import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import VenueDetail from "./pages/VenueDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import type {JSX} from "react";


// 🔥 KORUMALI ROTA BİLEŞENİ (ÖZEL BEKÇİ)
// Bu bileşen, sarıp sarmaladığı sayfayı açmadan önce "Token var mı?" diye bakar.
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token");

    // Eğer token yoksa, direkt Login'e postala
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Token varsa, istenen sayfayı (children) göster
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- HERKESE AÇIK ROTALAR (Public Routes) --- */}

                {/* Ana Sayfa */}
                <Route path="/home" element={<HomePage />} />

                {/* Kök dizine girince Home'a at */}
                <Route path="/" element={<Navigate to="/home" />} />

                {/* Giriş ve Kayıt */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Mekan Detay Sayfası (Herkes görebilir) */}
                <Route path="/venue/:id" element={<VenueDetail />} />


                {/* --- KORUMALI ROTALAR (Protected Routes) --- */}
                {/* Bu sayfalara sadece giriş yapmış kullanıcılar girebilir */}

                {/* Favoriler Sayfası */}
                <Route
                    path="/favorites"
                    element={
                        <ProtectedRoute>
                            <FavoritesPage />
                        </ProtectedRoute>
                    }
                />

                {/* ✅ Profil Düzenleme Sayfası (YENİ EKLENDİ) */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;