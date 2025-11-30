import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface BlogPost {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    author: { fullName: string };
}

function BlogDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Backend'den tekil yazıyı çek
        axios.get(`http://localhost:8081/api/blog/${id}`)
            .then((res) => {
                setPost(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white">Yükleniyor...</div>;
    if (!post) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white">Yazı bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-yellow-500/30 pb-20">

            {/* NAVBAR (Geri Dön) */}
            <nav className="px-6 py-5 border-b border-gray-800/50 sticky top-0 bg-[#0f1115]/90 backdrop-blur-md z-50">
                <button
                    onClick={() => navigate("/blog")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm tracking-wide group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    TÜM YAZILARA DÖN
                </button>
            </nav>

            {/* İÇERİK ALANI */}
            <article className="max-w-4xl mx-auto px-6 mt-10">

                {/* Kapak Resmi */}
                <div className="w-full h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 relative mb-10">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Başlık ve Yazar Bilgisi */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-[#181a20] px-4 py-2 rounded-full border border-white/10 mb-6 shadow-lg">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-sm">
                            {post.author ? post.author.fullName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Yazar</p>
                            <p className="text-sm font-bold text-white leading-none">{post.author ? post.author.fullName : "Anonim"}</p>
                        </div>
                        <div className="w-px h-6 bg-gray-700 mx-2"></div>
                        <div className="text-left">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Tarih</p>
                            <p className="text-sm font-bold text-white leading-none">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
                        {post.title}
                    </h1>
                </header>

                {/* Yazı İçeriği */}
                <div className="bg-[#181a20] p-8 md:p-12 rounded-[2rem] shadow-xl border border-white/5 text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>

            </article>
        </div>
    );
}

export default BlogDetailPage;