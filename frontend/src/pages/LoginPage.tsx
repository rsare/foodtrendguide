import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

// 1. Google'dan gelen verinin tipi (Artık kullanılacağı için hata vermeyecek)
interface GoogleTokenPayload {
    name: string;
    email: string;
    picture?: string;
    sub: string;
}

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://16.16.204.14:8081/api/auth/login", {
                email,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                localStorage.setItem("fullName", response.data.fullName);
                navigate("/home");
            }
        } catch (err: unknown) {
            console.error("Login hatası:", err);

            if (err instanceof AxiosError && err.response?.data) {
                const errorData = err.response.data as { error?: string; message?: string };
                setError(errorData.error || errorData.message || "Giriş başarısız.");
            } else {
                setError("Bir bağlantı hatası oluştu.");
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (credentialResponse.credential) {
                // 🔥 2. HATA ÇÖZÜMÜ: 'any' yerine <GoogleTokenPayload> kullandık
                const decoded = jwtDecode<GoogleTokenPayload>(credentialResponse.credential);
                console.log("Google Login Başarılı:", decoded);

                // Backend'e gönder
                const res = await axios.post("http://16.16.204.14:8081/api/auth/google", {
                    email: decoded.email,
                    fullName: decoded.name,
                    token: credentialResponse.credential
                });

                if (res.status === 200) {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("userId", res.data.userId);
                    localStorage.setItem("fullName", res.data.fullName);

                    navigate("/home");
                }
            }
        } catch (error) {
            console.error("Google Login Hatası", error);
            setError("Google ile giriş yapılamadı.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-white font-sans p-4 selection:bg-yellow-500/30">

            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="bg-[#181a20] p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 w-full max-w-md border border-white/5 relative z-10">

                <div className="text-center mb-8">
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

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">E-posta Adresi</label>
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

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Şifre</label>
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

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-700 bg-[#0f1115] text-yellow-500 focus:ring-offset-0 focus:ring-yellow-500/50 cursor-pointer accent-yellow-500"
                            />
                            <span className="text-gray-400 group-hover:text-white transition-colors select-none">Beni hatırla</span>
                        </label>
                        <a href="#" className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors">Şifremi unuttum?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all duration-300"
                    >
                        Giriş Yap
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                            <span className="px-4 bg-[#181a20] text-gray-600">veya</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                console.log('Login Failed');
                                setError("Google bağlantısı başarısız.");
                            }}
                            theme="filled_black"
                            shape="circle"
                            text="signin_with"
                            width="100%"
                            locale="tr"
                        />
                    </div>
                </div>

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