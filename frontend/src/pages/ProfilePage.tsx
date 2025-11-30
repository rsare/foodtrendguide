import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfilePage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);

    // Form Verileri
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
            navigate("/login");
            return;
        }
        setUserId(storedUserId);

        // Mevcut bilgileri çek
        axios.get(`http://localhost:8081/api/users/${storedUserId}`)
            .then(res => {
                setFullName(res.data.fullName);
                setEmail(res.data.email);
                setLoading(false);
            })
            .catch(err => {
                console.error("Kullanıcı bilgisi alınamadı", err);
                setLoading(false);
            });
    }, [navigate]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        try {
            const payload: any = { fullName };
            // Eğer şifre kutusu doluysa, şifreyi de güncelle
            if (password) {
                payload.password = password;
            }

            await axios.put(`http://localhost:8081/api/users/${userId}`, payload);

            // LocalStorage'daki ismi de güncelle
            localStorage.setItem("fullName", fullName);

            alert("Profil başarıyla güncellendi! ✅");
            setPassword(""); // Şifreyi temizle
        } catch (error) {
            console.error(error);
            alert("Güncelleme sırasında hata oluştu.");
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-yellow-500/30 flex flex-col">

            {/* NAVBAR (Sadece Geri Dön) */}
            <nav className="px-6 py-5 border-b border-gray-800/50">
                <button
                    onClick={() => navigate("/favorites")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm tracking-wide group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    PROFİLİME DÖN
                </button>
            </nav>

            {/* FORM ALANI */}
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-[#181a20] p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 w-full max-w-lg border border-white/5 relative overflow-hidden">

                    {/* Arka Plan Efekti */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="text-center mb-8 relative z-10">
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-4xl font-bold text-black mb-4 mx-auto shadow-lg shadow-yellow-500/20 ring-4 ring-[#181a20]">
                            {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <h1 className="text-2xl font-bold text-white">Bilgilerini Düzenle</h1>
                        <p className="text-gray-500 text-sm mt-1">Hesap ayarlarını buradan değiştirebilirsin.</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6 relative z-10">

                        {/* AD SOYAD INPUT */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Ad Soyad</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-[#0f1115] rounded-xl border border-gray-800 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder-gray-600"
                                />
                            </div>
                        </div>

                        {/* E-POSTA INPUT (Değiştirilemez) */}
                        <div className="space-y-2 opacity-60">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">E-posta (Sabit)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                                </span>
                                <input
                                    type="text"
                                    value={email}
                                    readOnly
                                    className="w-full pl-12 pr-4 py-4 bg-[#0f1115] rounded-xl border border-gray-800 text-gray-400 focus:outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* YENİ ŞİFRE INPUT */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Yeni Şifre (İsteğe Bağlı)</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Değiştirmek istemiyorsan boş bırak"
                                    className="w-full pl-12 pr-4 py-4 bg-[#0f1115] rounded-xl border border-gray-800 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all placeholder-gray-600"
                                />
                            </div>
                        </div>

                        {/* KAYDET BUTONU */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-1 transition-all duration-300 mt-4"
                        >
                            Değişiklikleri Kaydet
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;