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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-gray-400">Yükleniyor...</div>;
    if (!venue) return <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-gray-400">Mekan bulunamadı.</div>;

    return (
        // Arka planı daha koyu ve mat bir ton yaptık (#0f1115)
        <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-yellow-500/30">

            {/* Geri Dön (Daha minimal) */}
            <div className="max-w-7xl mx-auto pt-8 px-6">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium tracking-wide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    ANA SAYFAYA DÖN
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-6 flex flex-col gap-12">

                {/* 🔥 ANA KART (Modern & Borderless) */}
                <div className="flex flex-col lg:flex-row bg-[#181a20] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50">

                    {/* SOL: Resim (Daha sinematik) */}
                    <div className="lg:w-1/2 relative h-[400px] lg:h-[550px]">
                        <img
                            src={venue.imageUrl}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#181a20]"></div>
                    </div>

                    {/* SAĞ: İçerik */}
                    <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">

                        {/* Üst Kısım: Puan ve Kategori */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-xl">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                <span>{venue.rating.toFixed(1)}</span>
                            </div>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="text-gray-400 text-sm tracking-widest uppercase font-semibold">{venue.category}</span>
                        </div>

                        {/* Başlık */}
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {venue.name}
                        </h1>

                        {/* Adres ve Lokasyon */}
                        <div className="space-y-4 mb-10">
                            <div className="flex items-start gap-3">
                                <span className="mt-1 p-2 bg-white/5 rounded-full text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </span>
                                <div>
                                    <h3 className="text-white font-medium text-lg">{venue.district}, {venue.city}</h3>
                                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{venue.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Aksiyon Butonu (Modern Gradient) */}
                        <div className="mt-auto">
                            <button
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + " " + venue.address)}`, '_blank')}
                                className="group w-full sm:w-auto bg-white text-black hover:bg-yellow-400 font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)]"
                            >
                                <span>Yol Tarifi Al</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* DİĞER ŞUBELER (Minimal Grid) */}
                {branches.length > 0 && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">Diğer Şubeler</h2>
                            <div className="h-[1px] flex-grow bg-gray-800 ml-6"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {branches.map((branch) => (
                                <div
                                    key={branch.id}
                                    onClick={() => {
                                        navigate(`/venue/${branch.id}`);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="group cursor-pointer"
                                >
                                    {/* Şube Resmi */}
                                    <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                                        <img
                                            src={branch.imageUrl}
                                            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition"></div>
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 border border-white/10">
                                            {branch.rating.toFixed(1)}
                                        </div>
                                    </div>

                                    {/* Şube Bilgisi */}
                                    <div>
                                        <h3 className="font-bold text-white text-lg group-hover:text-yellow-400 transition truncate">{branch.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{branch.district}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VenueDetailPage;