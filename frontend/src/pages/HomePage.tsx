import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// 🔥 Veri dosyasını import et
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

    // Filtre State'leri
    const [search, setSearch] = useState("");
    const [selectedCity, setSelectedCity] = useState("Hepsi");
    const [selectedDistrict, setSelectedDistrict] = useState("Hepsi");
    const [selectedCategory, setSelectedCategory] = useState("Hepsi");

    // Dropdown Verileri
    const [districts, setDistricts] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, [navigate]);

    // Backend'den Mekanları Çek
    useEffect(() => {
        // Backend portun 8081 ise burası doğru
        axios.get("http://localhost:8081/api/venues")
            .then((res) => setVenues(res.data))
            .catch(() => setVenues([]));
    }, []);

    // Şehir Değişince Çalışan Fonksiyon
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        setSelectedCity(city);
        setSelectedDistrict("Hepsi"); // İl değişince ilçeyi sıfırla

        if (city === "Hepsi") {
            setDistricts([]);
        } else {
            // turkiye-data.ts dosyasından ilçeleri bul
            const cityData = TURKEY_DATA.find(item => item.il === city);
            if (cityData) {
                setDistricts(cityData.ilceleri);
            } else {
                setDistricts([]);
            }
        }
    };

    // 🔍 FİLTRELEME VE TEKİLLEŞTİRME MANTIĞI (BİRLEŞTİRİLDİ)
    const getDisplayVenues = () => {
        // 1. Adım: Standart filtreleri uygula (Arama, İl, İlçe, Kategori)
        const filtered = venues.filter((v) => {
            const venueName = v.name ? v.name.toLowerCase() : "";
            const matchesSearch = venueName.includes(search.toLowerCase());
            const matchesCity = selectedCity === "Hepsi" || v.city === selectedCity;
            const matchesDistrict = selectedDistrict === "Hepsi" || v.district === selectedDistrict;
            const matchesCategory = selectedCategory === "Hepsi" || v.category === selectedCategory;
            return matchesSearch && matchesCity && matchesDistrict && matchesCategory;
        });

        // 2. Adım: TEKİLLEŞTİRME (Aynı markadan sadece 1 tane göster)
        // Eğer İlçe veya Arama yapıldıysa hepsini göster, genel bakışta tekilleştir.
        // Ama kullanıcı deneyimi için ana sayfada her zaman tekil göstermek daha şıktır.
        const uniqueList: Venue[] = [];
        const seenBrands = new Set();

        filtered.forEach((venue) => {
            // Marka ismini tahmin et (İlk 2 kelime)
            // Örn: "Hafiz Mustafa 1864" -> "hafiz mustafa"
            const brandName = venue.name.split(" ").slice(0, 2).join(" ").toLowerCase();

            // Eğer bu markayı daha önce listeye eklemediysek, ekle
            if (!seenBrands.has(brandName)) {
                seenBrands.add(brandName);
                uniqueList.push(venue);
            }
        });

        return uniqueList;
    };

    // Ekrana basılacak nihai liste
    const displayVenues = getDisplayVenues();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 border-b border-gray-700 mb-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                    <span className="text-3xl"></span>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                        FoodTrend Guide
                    </h1>
                </div>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white transition text-sm font-medium">
                    Çıkış Yap
                </button>
            </nav>

            <div className="max-w-7xl mx-auto px-4">

                {/* 🔥 MODERN TEK SATIR FİLTRELEME ÇUBUĞU */}
                <div className="bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-700 flex flex-col lg:flex-row items-center gap-2 mb-8">

                    {/* ARAMA ÇUBUĞU */}
                    <div className="relative flex-grow w-full lg:w-auto">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Mekan ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 border border-gray-600 focus:border-yellow-500 transition h-12"
                        />
                    </div>

                    <div className="hidden lg:block w-px h-8 bg-gray-700 mx-1"></div>

                    {/* FİLTRELER */}
                    <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">

                        {/* İL SEÇİMİ */}
                        <div className="relative w-full lg:w-40">
                            <select
                                value={selectedCity}
                                onChange={handleCityChange}
                                className="w-full h-12 appearance-none bg-gray-700 hover:bg-gray-600 text-white pl-3 pr-8 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-500 cursor-pointer transition text-sm font-medium"
                            >
                                <option value="Hepsi">Tüm İller</option>
                                {TURKEY_DATA.map(item => (
                                    <option key={item.il} value={item.il}>{item.il}</option>
                                ))}
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
                        </div>

                        {/* İLÇE SEÇİMİ */}
                        <div className="relative w-full lg:w-40">
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={selectedCity === "Hepsi"}
                                className={`w-full h-12 appearance-none bg-gray-700 text-white pl-3 pr-8 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-500 cursor-pointer transition text-sm font-medium ${
                                    selectedCity === "Hepsi" ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
                                }`}
                            >
                                <option value="Hepsi">Tüm İlçeler</option>
                                {districts.map(dist => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
                        </div>

                        {/* KATEGORİ SEÇİMİ */}
                        <div className="relative w-full lg:w-40">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full h-12 appearance-none bg-gray-700 hover:bg-gray-600 text-white pl-3 pr-8 rounded-lg border border-gray-600 focus:outline-none focus:border-yellow-500 cursor-pointer transition text-sm font-medium"
                            >
                                <option value="Hepsi">Kategoriler</option>
                                <option value="Tatlı">Tatlı</option>
                                <option value="Tuzlu">Yemek</option>
                                <option value="Kahve">Kahve</option>
                                <option value="Sağlıklı">Sağlıklı</option>
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
                        </div>
                    </div>
                </div>

                {/* MEKAN KARTLARI */}
                {displayVenues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                        <span className="text-4xl mb-3">😕</span>
                        <p className="text-lg text-center">
                            {selectedCity !== "Hepsi"
                                ? `${selectedCity} ilinde henüz kayıtlı mekanımız yok.`
                                : "Aradığınız kriterlere uygun mekan bulunamadı."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
                        {displayVenues.map((venue) => (
                            <div
                                key={venue.id}
                                // ✅ TIKLAMA İLE DETAY SAYFASINA GİTME
                                onClick={() => navigate(`/venue/${venue.id}`)}
                                className="group bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 border border-gray-700 cursor-pointer"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={venue.imageUrl || "https://via.placeholder.com/300"}
                                        alt={venue.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-sm text-yellow-400 font-bold border border-yellow-500/30 flex items-center gap-1">
                                        <span>★</span> {typeof venue.rating === 'number' ? venue.rating.toFixed(1) : venue.rating}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-20 opacity-80"></div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-white truncate mb-1">{venue.name}</h3>
                                    <div className="flex items-center text-gray-400 text-sm mb-3 gap-1">
                                        <span className="truncate">{venue.district}, {venue.city}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                                            venue.category === 'Tatlı' ? 'bg-pink-900/30 text-pink-300 border-pink-800' :
                                                venue.category === 'Kahve' ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800' :
                                                    venue.category === 'Sağlıklı' ? 'bg-green-900/30 text-green-300 border-green-800' :
                                                        'bg-blue-900/30 text-blue-300 border-blue-800'
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
    );
}

export default HomePage;