import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Venue {
    id: number;
    name: string;
    city: string;
    district: string;
    address: string;
    rating: number;
    category: string;
    imageUrl?: string;
}

function VenueDetailPage() {
    const { id } = useParams(); // URL'den ID'yi al
    const navigate = useNavigate();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [branches, setBranches] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Tüm mekanları çekip içinden şu anki mekanı ve şubelerini bulacağız
        axios.get("http://localhost:8081/api/venues")
            .then((res) => {
                const allVenues: Venue[] = res.data;
                const currentVenue = allVenues.find(v => v.id === Number(id));

                if (currentVenue) {
                    setVenue(currentVenue);

                    // 🔍 ŞUBE BULMA MANTIĞI
                    // Mekan isminin ilk 2 kelimesini al (Örn: "Hafiz Mustafa" -> "Hafiz Mustafa")
                    // Ve bu kelimeyi içeren diğer mekanları bul
                    const brandName = currentVenue.name.split(" ").slice(0, 2).join(" ").toLowerCase();

                    const otherBranches = allVenues.filter(v =>
                        v.id !== currentVenue.id && // Kendisini listeye ekleme
                        v.name.toLowerCase().includes(brandName) // İsim benzerliği
                    );
                    setBranches(otherBranches);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-white text-center mt-20">Yükleniyor...</div>;
    if (!venue) return <div className="text-white text-center mt-20">Mekan bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
            <button onClick={() => navigate("/home")} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2">
                ← Geri Dön
            </button>

            {/* MEKAN DETAYI */}
            <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto flex flex-col md:flex-row border border-gray-700">
                <div className="md:w-1/2 h-64 md:h-auto">
                    <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-yellow-400">{venue.name}</h1>
                        <span className="bg-yellow-500 text-black font-bold px-3 py-1 rounded-lg text-lg">★ {venue.rating.toFixed(1)}</span>
                    </div>

                    <p className="text-gray-300 mb-4 text-lg">{venue.address}</p>

                    <div className="flex gap-3 mb-6">
                        <span className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-300">{venue.city}</span>
                        <span className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-300">{venue.district}</span>
                        <span className="bg-blue-900/40 text-blue-300 border border-blue-800 px-3 py-1 rounded text-sm">{venue.category}</span>
                    </div>

                    <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition w-full md:w-auto text-center">
                        Yol Tarifi Al 📍
                    </button>
                </div>
            </div>

            {/* DİĞER ŞUBELER */}
            {branches.length > 0 && (
                <div className="max-w-6xl mx-auto mt-12">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
                        📍 {venue.name.split(" ").slice(0, 2).join(" ")} - Diğer Şubeleri
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                onClick={() => navigate(`/venue/${branch.id}`)}
                                className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:bg-gray-700 cursor-pointer transition flex items-center gap-4"
                            >
                                <img src={branch.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
                                <div>
                                    <h3 className="font-bold text-sm text-white truncate w-32">{branch.name}</h3>
                                    <p className="text-xs text-gray-400">{branch.district}</p>
                                    <span className="text-xs text-yellow-400 font-bold">★ {branch.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default VenueDetailPage;