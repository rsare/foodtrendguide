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
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [branches, setBranches] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8081/api/venues")
            .then((res) => {
                const allVenues: Venue[] = res.data;
                const currentVenue = allVenues.find(v => v.id === Number(id));

                if (currentVenue) {
                    setVenue(currentVenue);

                    const brandName = currentVenue.name.split(" ").slice(0, 2).join(" ").toLowerCase();
                    const otherBranches = allVenues.filter(v =>
                        v.id !== currentVenue.id &&
                        v.name.toLowerCase().includes(brandName)
                    );
                    setBranches(otherBranches);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="text-white text-center mt-20 text-xl">Yükleniyor...</div>;
    if (!venue) return <div className="text-white text-center mt-20 text-xl">Mekan bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans p-4 md:p-8 flex flex-col items-center">

            {/* Geri Dön Butonu */}
            <div className="w-full max-w-6xl mb-6">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
                >
                    <span className="group-hover:-translate-x-1 transition text-xl">←</span> Geri Dön
                </button>
            </div>

            {/* 🔥 ANA KART (Yatay Hafız Mustafa Tasarımı) */}
            {/* max-h-[500px] diyerek kartın aşırı uzamasını engelledik */}
            <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-2xl max-w-6xl w-full flex flex-col md:flex-row border border-gray-700 md:max-h-[500px]">

                {/* 1. RESİM ALANI (Sol Taraf - Genişlik %45) */}
                <div className="md:w-5/12 h-64 md:h-auto relative">
                    <img
                        src={venue.imageUrl}
                        alt={venue.name}
                        className="w-full h-full object-cover absolute inset-0"
                    />
                    {/* Hafif karartma */}
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* 2. BİLGİ ALANI (Sağ Taraf - Genişlik %55) */}
                <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-gray-800 relative">

                    {/* Başlık ve Puan */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400 leading-tight mb-2">
                                {venue.name}
                            </h1>
                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                📍 {venue.district}, {venue.city}
                            </p>
                        </div>
                        <div className="bg-yellow-500 text-black font-bold px-3 py-1.5 rounded-lg text-lg flex items-center gap-1 shadow-lg shrink-0">
                            <span>★</span> {venue.rating.toFixed(1)}
                        </div>
                    </div>

                    {/* Adres */}
                    <div className="mb-6">
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed border-l-4 border-gray-600 pl-4 py-1">
                            {venue.address}
                        </p>
                    </div>

                    {/* Etiketler */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <span className="bg-gray-700/50 px-3 py-1.5 rounded-lg text-sm text-gray-300 border border-gray-600">
                            {venue.city}
                        </span>
                        <span className="bg-gray-700/50 px-3 py-1.5 rounded-lg text-sm text-gray-300 border border-gray-600">
                            {venue.district}
                        </span>
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                            venue.category === 'Tatlı' ? 'bg-pink-900/20 text-pink-300 border-pink-800' :
                                venue.category === 'Kahve' ? 'bg-yellow-900/20 text-yellow-300 border-yellow-800' :
                                    'bg-blue-900/20 text-blue-300 border-blue-800'
                        }`}>
                            {venue.category}
                        </span>
                    </div>

                    {/* Buton (Alt kısma yasla) */}
                    <div className="mt-auto">
                        <button
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg flex justify-center items-center gap-2 text-base"
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + " " + venue.address)}`, '_blank')}
                        >
                            🗺️ Yol Tarifi Al
                        </button>
                    </div>
                </div>
            </div>

            {/* DİĞER ŞUBELER */}
            {branches.length > 0 && (
                <div className="w-full max-w-6xl mt-12">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-gray-700 pb-3">
                        <span className="text-yellow-500">📍</span>
                        <span className="text-white">{venue.name.split(" ").slice(0, 2).join(" ")}</span>
                        <span className="text-gray-400 font-normal">- Diğer Şubeleri</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                onClick={() => {
                                    navigate(`/venue/${branch.id}`);
                                    window.scrollTo(0, 0);
                                }}
                                className="bg-gray-800 rounded-xl p-3 border border-gray-700 hover:bg-gray-700 hover:border-yellow-500/50 cursor-pointer transition flex items-center gap-3 group"
                            >
                                <img src={branch.imageUrl} className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition shrink-0" />
                                <div className="min-w-0"> {/* min-w-0 truncate için gerekli */}
                                    <h3 className="font-bold text-white text-sm truncate group-hover:text-yellow-400 transition">{branch.name}</h3>
                                    <p className="text-xs text-gray-400 mb-1 truncate">{branch.district}</p>
                                    <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-yellow-400 font-bold border border-yellow-500/20">
                                        ★ {branch.rating.toFixed(1)}
                                    </span>
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