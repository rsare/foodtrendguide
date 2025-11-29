import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            console.log("➡️ Login isteği gönderiliyor...");

            const response = await axios.post("http://localhost:8081/api/auth/login", {
                email,
                password,
            });

            console.log("✅ Backend cevabı:", response);

            if (response.status === 200) {
                // Token'ı kaydet
                localStorage.setItem("token", response.data.token);
                // ✅ User ID'yi kaydet (Bunu eklemen lazım)
                localStorage.setItem("userId", response.data.userId);
                // İsim bilgisini kaydet (Profilde göstermek için)
                localStorage.setItem("fullName", response.data.fullName);

                navigate("/home");
            }
        } catch (err) {
            console.error("❌ Login hatası:", err);
            setError("E-posta veya şifre hatalı!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">
                    FoodTrend Guide 🍽️
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="E-posta"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition"
                    >
                        Giriş Yap
                    </button>
                </form>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}

                <p className="text-center text-gray-400 mt-4">
                    Henüz hesabın yok mu?{" "}
                    <span
                        className="text-yellow-400 cursor-pointer hover:underline"
                        onClick={() => navigate("/register")}
                    >
            Kayıt Ol
          </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
