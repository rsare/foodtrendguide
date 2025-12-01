import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TURKEY_DATA } from "../data/turkiye-data";

interface Venue {
    id: number;
    name: string;
    city: string;
    district: string;
    rating: number;
    category?: string;
    imageUrl?: string;
}

function HomePage() {
    const navigate = useNavigate();
    const [venues, setVenues] = useState<Venue[]>([]);

    // Login Kontrolü
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    // Filtre State'leri
    const [search, setSearch] = useState("");
    const [selectedCity, setSelectedCity] = useState("Hepsi");
    const [selectedDistrict, setSelectedDistrict] = useState("Hepsi");
    const [selectedCategory, setSelectedCategory] = useState("Hepsi");
    const [districts, setDistricts] = useState<string[]>([]);

    // 🔥 YENİ STATE: Giriş Yap Pop-up'ı için
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        axios.get("http://16.16.204.14:8081/api/venues")
            .then((res) => setVenues(res.data))
            .catch(() => setVenues([]));
    }, []);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        setSelectedCity(city);
        setSelectedDistrict("Hepsi");

        if (city === "Hepsi") {
            setDistricts([]);
        } else {
            const cityData = TURKEY_DATA.find(item => item.il === city);
            if (cityData) {
                setDistricts(cityData.ilceleri);
            } else {
                setDistricts([]);
            }
        }
    };

    // FAVORİYE EKLEME (Güncellendi: Pop-up açıyor)
    const toggleFavorite = async (e: React.MouseEvent, venueId: number) => {
        e.stopPropagation();

        // Eğer giriş yapmamışsa ÖZEL MODAL'ı aç
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            await axios.post(`http://16.16.204.14:8081/api/bookmarks/${userId}/${venueId}`);
            alert("Favori listesi güncellendi.");
        } catch (error) {
            console.error("Favori hatası:", error);
        }
    };

    const getDisplayVenues = () => {
        const filtered = venues.filter((v) => {
            const venueName = v.name ? v.name.toLowerCase() : "";
            const matchesSearch = venueName.includes(search.toLowerCase());
            const matchesCity = selectedCity === "Hepsi" || v.city === selectedCity;
            const matchesDistrict = selectedDistrict === "Hepsi" || v.district === selectedDistrict;
            const matchesCategory = selectedCategory === "Hepsi" || v.category === selectedCategory;
            return matchesSearch && matchesCity && matchesDistrict && matchesCategory;
        });

        const uniqueList: Venue[] = [];
        const seenBrands = new Set();

        filtered.forEach((venue) => {
            const brandName = venue.name.split(" ").slice(0, 2).join(" ").toLowerCase();
            if (!seenBrands.has(brandName)) {
                seenBrands.add(brandName);
                uniqueList.push(venue);
            }
        });

        return uniqueList;
    };

    const displayVenues = getDisplayVenues();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("fullName");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-yellow-500/30 relative">

            {/* ... Navbar (Aynı) ... */}
            <nav className="flex justify-between items-center px-6 py-5 bg-[#0f1115] border-b border-gray-800/50 sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-lg text-black group-hover:scale-105 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold tracking-wide text-white">
                        FoodTrend <span className="text-yellow-500">Guide</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <button onClick={() => navigate("/favorites")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="hidden sm:inline">Favorilerim</span>
                            </button>
                            <button
                                onClick={() => navigate("/blog")}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                <span className="hidden sm:inline">Blog / Keşfet</span>
                            </button>
                            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10">
                                <span>Çıkış Yap</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate("/login")} className="text-white hover:text-yellow-400 transition font-medium text-sm">Giriş Yap</button>
                            <button onClick={() => navigate("/register")} className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl transition text-sm font-bold shadow-lg shadow-yellow-500/20">Kayıt Ol</button>
                        </>
                    )}
                </div>
            </nav>

            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {/* ... Filtre Alanı (Değişiklik Yok) ... */}
                <div className="bg-[#181a20] p-3 rounded-2xl shadow-xl shadow-black/20 flex flex-col lg:flex-row items-center gap-3 mb-10 border border-white/5">
                    <div className="relative flex-grow w-full lg:w-auto group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Mekan veya mutfak ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[#0f1115] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 transition border border-gray-800 focus:border-yellow-500/50"
                        />
                    </div>
                    <div className="hidden lg:block w-px h-8 bg-gray-800 mx-2"></div>
                    <div className="flex w-full lg:w-auto gap-3 overflow-x-auto pb-1 lg:pb-0">
                        <div className="relative min-w-[160px] flex-1">
                            <select value={selectedCity} onChange={handleCityChange} className="w-full h-12 appearance-none bg-[#0f1115] hover:bg-[#13151a] text-gray-300 pl-4 pr-10 rounded-xl border border-gray-800 focus:outline-none focus:border-yellow-500/50 cursor-pointer transition text-sm font-medium">
                                <option value="Hepsi">Tüm İller</option>
                                {TURKEY_DATA.map(item => (<option key={item.il} value={item.il}>{item.il}</option>))}
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                        </div>
                        <div className="relative min-w-[160px] flex-1">
                            <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={selectedCity === "Hepsi"} className={`w-full h-12 appearance-none bg-[#0f1115] text-gray-300 pl-4 pr-10 rounded-xl border border-gray-800 focus:outline-none focus:border-yellow-500/50 cursor-pointer transition text-sm font-medium ${selectedCity === "Hepsi" ? "opacity-50 cursor-not-allowed" : "hover:bg-[#13151a]"}`}>
                                <option value="Hepsi">Tüm İlçeler</option>
                                {districts.map(dist => (<option key={dist} value={dist}>{dist}</option>))}
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                        </div>
                        <div className="relative min-w-[160px] flex-1">
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full h-12 appearance-none bg-[#0f1115] hover:bg-[#13151a] text-gray-300 pl-4 pr-10 rounded-xl border border-gray-800 focus:outline-none focus:border-yellow-500/50 cursor-pointer transition text-sm font-medium">
                                <option value="Hepsi">Kategoriler</option>
                                <option value="Tatlı">Tatlı</option>
                                <option value="Tuzlu">Yemek</option>
                                <option value="Kahve">Kahve</option>
                                <option value="Sağlıklı">Sağlıklı</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                        </div>
                    </div>
                </div>

                {/* ... Kartlar Alanı (Değişiklik Yok) ... */}
                {displayVenues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-32 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-lg">Kriterlere uygun mekan bulunamadı.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                        {displayVenues.map((venue) => (
                            <div
                                key={venue.id}
                                onClick={() => navigate(`/venue/${venue.id}`)}
                                className="group bg-[#181a20] rounded-[2rem] overflow-hidden shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative isolate"
                            >
                                <button
                                    onClick={(e) => toggleFavorite(e, venue.id)}
                                    className="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-red-500/90 text-white rounded-full backdrop-blur-md transition-all duration-300 border border-white/10 group-hover:scale-110"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>

                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={venue.imageUrl || "https://via.placeholder.com/400"}
                                        alt={venue.name}
                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] via-transparent to-transparent opacity-80"></div>

                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-bold text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                        {typeof venue.rating === 'number' ? venue.rating.toFixed(1) : venue.rating}
                                    </div>
                                </div>

                                <div className="p-6 relative -mt-10">
                                    <h3 className="text-xl font-bold text-white truncate mb-2 leading-tight group-hover:text-yellow-400 transition-colors">{venue.name}</h3>

                                    <div className="flex items-center text-gray-400 text-sm mb-5 gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="truncate">{venue.district}, {venue.city}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold tracking-wide border ${
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

            {/* 🔥 YENİ EKLENEN POP-UP (MODAL) */}
            {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#181a20] border border-white/10 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center relative transform transition-all scale-100">

                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Giriş Yapmalısın</h3>
                        <p className="text-gray-400 mb-8 text-sm">
                            Favorilere eklemek ve profilini yönetmek için lütfen giriş yap veya hesap oluştur.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20"
                            >
                                Giriş Yap
                            </button>
                            <button
                                onClick={() => setShowAuthModal(false)}
                                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-all"
                            >
                                Vazgeç
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default HomePage;