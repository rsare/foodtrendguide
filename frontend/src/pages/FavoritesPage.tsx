import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Venue {
    id: number;
    name: string;
    city: string;
    district: string;
    rating: number;
    category: string;
    imageUrl: string;
}

function FavoritesPage() {
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState<Venue[]>([]);
    const [fullName, setFullName] = useState("");

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedName = localStorage.getItem("fullName");
        setFullName(storedName || "Kullanıcı");

        if (storedUserId) {
            // Favorileri Çek
            axios.get<Venue[]>(`/api/bookmarks/user/${storedUserId}`)
                .then(res => setBookmarks(res.data))
                .catch(err => console.error("Favoriler çekilemedi:", err));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-yellow-500/30">

            <nav className="flex justify-between items-center px-6 py-5 bg-[#0f1115] border-b border-gray-800/50 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm tracking-wide group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ANA SAYFAYA DÖN
                </button>

                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("fullName");
                        navigate("/login");
                    }}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Çıkış</span>
                </button>
            </nav>

            <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">

                {/* SOL: PROFİL KARTI */}
                <div className="lg:w-1/4">
                    <div className="bg-[#181a20] p-8 rounded-[2rem] shadow-xl shadow-black/30 sticky top-28 flex flex-col items-center text-center border border-white/5">

                        <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-4xl font-bold text-black mb-6 shadow-lg shadow-yellow-500/20 ring-4 ring-[#181a20]">
                            {fullName.charAt(0).toUpperCase()}
                        </div>

                        <h2 className="text-2xl font-bold text-white">{fullName}</h2>
                        <p className="text-gray-500 text-sm mt-1 font-medium">FoodTrend Üyesi</p>

                        {/* 🔥 PROFİLİ DÜZENLE BUTONU */}
                        <button
                            onClick={() => navigate("/profile")}
                            className="mt-6 w-full py-3 bg-[#0f1115] hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-xl text-gray-300 hover:text-white text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            PROFİLİ DÜZENLE
                        </button>

                        <div className="mt-8 w-full border-t border-gray-800 pt-6">
                            <div className="flex flex-col items-center">
                                <span className="text-5xl font-bold text-white mb-2">{bookmarks.length}</span>
                                <span className="text-gray-500 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                    Favori Mekan
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAĞ: FAVORİ LİSTESİ */}
                <div className="lg:w-3/4">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-800">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Favori Mekanlarım</h1>
                    </div>

                    {bookmarks.length === 0 ? (
                        <div className="bg-[#181a20] rounded-[2rem] p-16 flex flex-col items-center justify-center text-center border border-white/5 shadow-xl shadow-black/20">
                            <div className="bg-gray-800/50 p-6 rounded-full mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Listeniz Henüz Boş</h3>
                            <p className="text-gray-500 max-w-sm mb-8">Henüz favori listenize bir mekan eklememişsiniz. Keşfetmeye başlayın!</p>
                            <button
                                onClick={() => navigate("/home")}
                                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                Mekan Ara
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookmarks.map((venue) => (
                                <div
                                    key={venue.id}
                                    onClick={() => navigate(`/venue/${venue.id}`)}
                                    className="group bg-[#181a20] rounded-[2rem] overflow-hidden shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative isolate border border-white/5"
                                >
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={venue.imageUrl || "https://via.placeholder.com/400"}
                                            alt={venue.name}
                                            className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] via-transparent to-transparent opacity-90"></div>
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-bold text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                            {typeof venue.rating === 'number' ? venue.rating.toFixed(1) : venue.rating}
                                        </div>
                                    </div>
                                    <div className="p-6 relative -mt-10">
                                        <h3 className="text-lg font-bold text-white truncate mb-2 leading-tight group-hover:text-yellow-400 transition-colors">{venue.name}</h3>
                                        <div className="flex items-center text-gray-400 text-sm mb-4 gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <span className="truncate">{venue.district}, {venue.city}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-lg border ${
                                                venue.category === 'Tatlı' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                                    venue.category === 'Kahve' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        venue.category === 'Sağlıklı' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                                {venue.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FavoritesPage;