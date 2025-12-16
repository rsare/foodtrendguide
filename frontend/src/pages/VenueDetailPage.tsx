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

interface Review {
    id: number;
    text: string;
    rating: number;
    user: { fullName: string };
    createdAt: string;
}

function VenueDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [branches, setBranches] = useState<Venue[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Yorum Formu State'leri
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(5);

    useEffect(() => {
        // 1. Mekan Detaylarını ve Şubeleri Çek
        axios.get("/api/venues")
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

        // 2. Yorumları Çek
        if(id) {
            axios.get(`/api/reviews/venue/${id}`)
                .then(res => setReviews(res.data))
                .catch(err => console.error("Yorumlar çekilemedi", err));
        }

    }, [id]);

    const handleSubmitReview = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Yorum yapmak için lütfen giriş yapın.");
            return;
        }
        if (!newReview.trim()) {
            alert("Lütfen bir yorum yazın.");
            return;
        }

        try {
            await axios.post(`/api/reviews/${userId}/${id}`, {
                text: newReview,
                rating: newRating.toString()
            });

            // Yorumları yenile
            const res = await axios.get(`/api/reviews/venue/${id}`);
            setReviews(res.data);

            // Formu temizle
            setNewReview("");
            setNewRating(5);
            alert("Yorumunuz eklendi! 🎉");
        } catch (error) {
            console.error("Yorum hatası", error);
            alert("Yorum gönderilirken hata oluştu.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-gray-400">Yükleniyor...</div>;
    if (!venue) return <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-gray-400">Mekan bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-[#0f1115] text-white font-sans p-4 md:p-8 flex flex-col items-center selection:bg-yellow-500/30">

            <div className="w-full max-w-6xl mb-6">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium tracking-wide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    ANA SAYFAYA DÖN
                </button>
            </div>

            {/* 🔥 ANA KART */}
            <div className="flex flex-col lg:flex-row bg-[#181a20] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50 w-full max-w-6xl border border-white/5">
                <div className="lg:w-5/12 relative h-[300px] lg:h-auto">
                    <img src={venue.imageUrl} alt={venue.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#181a20]"></div>
                </div>

                <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-xl">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            <span>{venue.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-500 text-sm tracking-widest uppercase font-semibold border border-gray-700 px-2 py-0.5 rounded">{venue.category}</span>
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">{venue.name}</h1>

                    <div className="flex items-start gap-3 mb-8">
                        <span className="mt-1 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
                        <div>
                            <h3 className="text-white font-medium text-lg">{venue.district}, {venue.city}</h3>
                            <p className="text-gray-500 text-sm mt-1">{venue.address}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + " " + venue.address)}`, '_blank')}
                        className="w-full sm:w-auto bg-white text-black hover:bg-yellow-400 font-bold py-3.5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    >
                        <span>Yol Tarifi Al</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </div>
            </div>

            {/* 🔥 YORUMLAR BÖLÜMÜ */}
            <div className="w-full max-w-6xl mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* YORUM YAPMA FORMU */}
                <div className="bg-[#181a20] p-8 rounded-[2rem] border border-white/5 h-fit">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <span className="text-yellow-500"></span> Yorum Yap
                    </h2>
                    <textarea
                        className="w-full bg-[#0f1115] p-4 rounded-xl text-white border border-gray-700 focus:border-yellow-500 outline-none resize-none transition-colors mb-4 placeholder-gray-600"
                        rows={4}
                        placeholder="Mekan hakkında deneyimlerini paylaş..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 bg-[#0f1115] px-3 py-2 rounded-xl border border-gray-700">
                            <span className="text-sm text-gray-400">Puan:</span>
                            <select
                                value={newRating}
                                onChange={(e) => setNewRating(Number(e.target.value))}
                                className="bg-transparent text-yellow-400 font-bold outline-none cursor-pointer"
                            >
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                            <span className="text-yellow-400 text-sm">★</span>
                        </div>
                        <button
                            onClick={handleSubmitReview}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 px-6 rounded-xl transition shadow-lg shadow-yellow-500/10"
                        >
                            Gönder
                        </button>
                    </div>
                </div>

                {/* YORUM LİSTESİ */}
                <div className="bg-[#181a20] p-8 rounded-[2rem] border border-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Değerlendirmeler <span className="text-sm bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{reviews.length}</span>
                    </h2>

                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map(review => (
                                <div key={review.id} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-white font-bold border border-gray-600">
                                                {review.user ? review.user.fullName.charAt(0).toUpperCase() : "?"}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{review.user ? review.user.fullName : "Anonim"}</h4>
                                                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                                            <span className="text-yellow-500 text-xs font-bold">{review.rating}</span>
                                            <svg className="w-3 h-3 fill-yellow-500" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed pl-[3.25rem]">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* DİĞER ŞUBELER */}
            {branches.length > 0 && (
                <div className="w-full max-w-6xl mt-12">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
                        <h2 className="text-2xl font-bold text-white">Diğer Şubeler</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {branches.map((branch) => (
                            <div
                                key={branch.id}
                                onClick={() => { navigate(`/venue/${branch.id}`); window.scrollTo(0, 0); }}
                                className="group cursor-pointer"
                            >
                                <div className="relative h-40 rounded-2xl overflow-hidden mb-3">
                                    <img src={branch.imageUrl} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition"></div>
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 border border-white/10">
                                        {branch.rating.toFixed(1)}
                                    </div>
                                </div>
                                <h3 className="font-bold text-white text-md group-hover:text-yellow-400 transition truncate">{branch.name}</h3>
                                <p className="text-gray-500 text-xs mt-1">{branch.district}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default VenueDetailPage;