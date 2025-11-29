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
        const userId = localStorage.getItem("userId");
        const storedName = localStorage.getItem("fullName");
        setFullName(storedName || "Kullanıcı");

        if (userId) {
            // Favorileri çek
            axios.get(`http://localhost:8081/api/bookmarks/user/${userId}`)
                .then(res => setBookmarks(res.data))
                .catch(err => console.error("Favoriler çekilemedi", err));
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
            <button onClick={() => navigate("/home")} className="mb-6 text-gray-400 hover:text-white">← Ana Sayfaya Dön</button>

            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                {/* PROFIL KARTI */}
                <div className="md:w-1/4">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 text-center sticky top-10">
                        <div className="w-24 h-24 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-black font-bold">
                            {fullName.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-bold">{fullName}</h2>
                        <p className="text-gray-400 text-sm mt-1">FoodTrend Üyesi</p>
                        <div className="mt-6 border-t border-gray-700 pt-4">
                            <p className="text-3xl font-bold text-yellow-400">{bookmarks.length}</p>
                            <p className="text-xs text-gray-400 uppercase tracking-widest">Favori Mekan</p>
                        </div>
                    </div>
                </div>

                {/* FAVORİ LİSTESİ */}
                <div className="md:w-3/4">
                    <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        ❤️ Favori Mekanlarım
                    </h1>

                    {bookmarks.length === 0 ? (
                        <div className="text-gray-500 text-center mt-10 bg-gray-800 p-10 rounded-xl">
                            Henüz favori eklemedin. 😔
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookmarks.map((venue) => (
                                <div
                                    key={venue.id}
                                    onClick={() => navigate(`/venue/${venue.id}`)}
                                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 cursor-pointer transition group"
                                >
                                    <div className="h-40 relative">
                                        <img src={venue.imageUrl} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-yellow-400 font-bold">
                                            ★ {venue.rating.toFixed(1)}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-white truncate">{venue.name}</h3>
                                        <p className="text-sm text-gray-400">{venue.district}, {venue.city}</p>
                                        <span className="text-xs mt-2 inline-block px-2 py-1 rounded bg-gray-700 text-gray-300">
                                            {venue.category}
                                        </span>
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