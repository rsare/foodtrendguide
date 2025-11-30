import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8081/api/auth/login", {
                email,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                localStorage.setItem("fullName", response.data.fullName);
                navigate("/home");
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "E-posta veya şifre hatalı!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-white font-sans p-4 selection:bg-yellow-500/30">

            {/* Arka plan süsü (Opsiyonel Blur) */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="bg-[#181a20] p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 w-full max-w-md border border-white/5 relative z-10">

                {/* LOGO ALANI */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-2xl text-black shadow-lg shadow-yellow-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Hoş Geldiniz</h1>
                    <p className="text-gray-500 mt-2 text-sm">Lezzet dünyasına giriş yapın</p>
                </div>

                {/* HATA MESAJI */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">

                    {/* E-POSTA INPUT */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">E-posta Adresi</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                            </span>
                            <input
                                type="email"
                                className="w-full pl-12 pr-4 py-4 bg-[#0f1115] rounded-xl border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* ŞİFRE INPUT */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Şifre</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </span>
                            <input
                                type="password"
                                className="w-full pl-12 pr-4 py-4 bg-[#0f1115] rounded-xl border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* BUTON */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all duration-300"
                    >
                        Giriş Yap
                    </button>
                </form>

                {/* ALT LİNK */}
                <p className="text-center text-gray-500 mt-8 text-sm">
                    Henüz hesabın yok mu?{" "}
                    <span
                        className="text-yellow-500 cursor-pointer hover:text-yellow-400 hover:underline font-medium transition-colors"
                        onClick={() => navigate("/register")}
                    >
                        Hemen Kayıt Ol
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;