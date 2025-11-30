import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface BlogPost {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    author: { fullName: string };
}

function BlogPage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8081/api/blog")
            .then((res) => {
                setPosts(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-yellow-500/30">
            {/* Navbar */}
            <nav className="px-6 py-5 border-b border-gray-800/50 sticky top-0 bg-[#0f1115]/90 backdrop-blur-md z-50 flex justify-between items-center">
                <button onClick={() => navigate("/home")} className="flex items-center gap-2 text-gray-400 hover:text-white transition font-medium text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    ANA SAYFA
                </button>
                <h1 className="text-xl font-bold">Lezzet <span className="text-yellow-500">Blogu</span></h1>
                <div className="w-20"></div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Topluluk Deneyimleri ✍️</h2>
                    <p className="text-gray-400">Diğer gurmelerin keşiflerini ve hikayelerini oku.</p>
                </div>

                <div className="space-y-12">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            // 🔥 BU İKİ SATIR TIKLAMAYI SAĞLIYOR:
                            onClick={() => navigate(`/blog/${post.id}`)}
                            className="bg-[#181a20] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 group hover:border-yellow-500/30 transition duration-500 cursor-pointer relative hover:-translate-y-2"
                        >
                            {/* Kapak Resmi */}
                            <div className="h-64 overflow-hidden relative">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#181a20] to-transparent"></div>
                                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg">
                                        {post.author ? post.author.fullName.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold drop-shadow-md">{post.author ? post.author.fullName : "Anonim"}</p>
                                        <p className="text-xs text-gray-300">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* İçerik */}
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-400 transition">{post.title}</h3>
                                <p className="text-gray-300 leading-relaxed line-clamp-3">
                                    {post.content}
                                </p>
                                <span className="text-yellow-500 text-sm font-bold mt-4 inline-block group-hover:underline">Devamını Oku →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BlogPage;