import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8081/api/auth/register", formData);
            alert("Kayıt başarılı! Lütfen giriş yapın.");
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Kayıt işlemi başarısız.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-white font-sans p-4 selection:bg-yellow-500/30">

            <div className="bg-[#181a20] p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 w-full max-w-md border border-white/5 relative z-10">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Hesap Oluştur</h1>
                    <p className="text-gray-500 mt-2 text-sm">Aramıza katıl ve keşfetmeye başla</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleRegister}>

                    {/* AD SOYAD */}
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </span>
                        <input
                            name="fullName"
                            type="text"
                            required
                            className="w-full pl-12 pr-4 py-4 bg-[#0f1115] rounded-xl border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                            placeholder="Ad Soyad"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* E-POSTA */}
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        </span>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full pl-12 pr-4 py-4 bg-[#0f1115] rounded-xl border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                            placeholder="E-posta Adresi"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ŞİFRE */}
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </span>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full pl-12 pr-4 py-4 bg-[#0f1115] rounded-xl border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                            placeholder="Şifre"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        Kayıt Ol
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Zaten bir hesabın var mı?{" "}
                    <span
                        className="text-yellow-500 cursor-pointer hover:text-yellow-400 hover:underline font-medium transition-colors"
                        onClick={() => navigate("/login")}
                    >
                        Giriş Yap
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;