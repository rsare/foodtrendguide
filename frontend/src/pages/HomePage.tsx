import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
    const [venues, setVenues] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Hepsi");

    // 🔐 Token kontrolü
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // 📦 Mekanları backend'den çek
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/venues")
            .then((res) => setVenues(res.data))
            .catch(() => setVenues([]));
    }, []);

    // 🔍 Arama ve filtreleme
    const filteredVenues = venues.filter((v) => {
        const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            filter === "Hepsi" || v.category.toLowerCase() === filter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    // 🚪 Çıkış işlemi
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            {/* 🔹 Navbar */}
            <nav className="flex justify-between items-center px-8 py-4 bg-gray-800 shadow-md">
                <h1
                    className="text-2xl font-bold text-yellow-400 cursor-pointer"
                    onClick={() => navigate("/home")}
                >
                    FoodTrend Guide 🍴
                </h1>

                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => navigate("/favorites")}
                        className="hover:text-yellow-400"
                    >
                        Favoriler
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="hover:text-yellow-400"
                    >
                        Profil
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg"
                    >
                        Çıkış Yap
                    </button>
                </div>
            </nav>

            {/* 🔹 Arama ve Filtre */}
            <div className="max-w-6xl mx-auto mt-10 px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <input
                        type="text"
                        placeholder="Mekan ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-1/2 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4 md:mb-0"
                    />

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                        <option>Hepsi</option>
                        <option>Tatlı</option>
                        <option>Tuzlu</option>
                        <option>Sağlıklı</option>
                        <option>Sporcu Menüsü</option>
                    </select>
                </div>

                {/* 🔹 Mekan Kartları */}
                {filteredVenues.length === 0 ? (
                    <p className="text-center text-gray-400 mt-20">
                        Hiç mekan bulunamadı.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredVenues.map((venue) => (
                            <div
                                key={venue.id}
                                className="bg-gray-800 rounded-xl shadow-lg hover:scale-105 transform transition p-4"
                            >
                                <img
                                    src={venue.imageUrl || "https://via.placeholder.com/300"}
                                    alt={venue.name}
                                    className="rounded-lg mb-4 w-full h-48 object-cover"
                                />
                                <h3 className="text-xl font-semibold text-yellow-400">
                                    {venue.name}
                                </h3>
                                <p className="text-gray-400 text-sm mb-2">
                                    {venue.category}
                                </p>
                                <p className="text-gray-300">{venue.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
