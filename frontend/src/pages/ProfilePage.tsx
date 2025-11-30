import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- TİP TANIMLAMALARI (INTERFACES) ---

interface BlogPost {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

// 🔥 Profil güncelleme verisi için özel tip
interface UpdateProfilePayload {
    fullName: string;
    password?: string; // Soru işareti (?) koyduk çünkü şifre her zaman gönderilmiyor
}

function ProfilePage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'settings' | 'blog' | 'notes'>('settings');
    const [loading, setLoading] = useState(true);

    // --- STATE'LER ---
    // Profil
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Blog
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [blogTitle, setBlogTitle] = useState("");
    const [blogContent, setBlogContent] = useState("");

    // Notlar
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");

    // --- VERİ ÇEKME ---
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
            navigate("/login");
            return;
        }
        setUserId(storedUserId);

        const fetchData = async () => {
            try {
                // Kullanıcı Bilgisi
                const userRes = await axios.get(`http://localhost:8081/api/users/${storedUserId}`);
                setFullName(userRes.data.fullName);
                setEmail(userRes.data.email);

                // Blogları Çek
                const blogRes = await axios.get(`http://localhost:8081/api/blog/user/${storedUserId}`);
                setPosts(blogRes.data);

                // Notları Çek
                const notesRes = await axios.get(`http://localhost:8081/api/notes/user/${storedUserId}`);
                setNotes(notesRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Veri çekme hatası", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    // --- İŞLEM FONKSİYONLARI ---

    // 1. Profil Güncelle
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        try {
            // 🔥 DÜZELTİLEN KISIM: 'any' yerine Interface kullandık
            const payload: UpdateProfilePayload = { fullName };

            if (password) {
                payload.password = password;
            }

            await axios.put(`http://localhost:8081/api/users/${userId}`, payload);
            localStorage.setItem("fullName", fullName);
            alert("Profil güncellendi! ✅");
            setPassword("");
        } catch (error) {
            console.error(error);
            alert("Güncelleme hatası.");
        }
    };

    // 2. Blog Ekle / Sil
    const handleAddPost = async () => {
        if (!blogTitle || !blogContent) return alert("Başlık ve içerik giriniz.");
        try {
            await axios.post(`http://localhost:8081/api/blog/${userId}`, { title: blogTitle, content: blogContent });
            const res = await axios.get(`http://localhost:8081/api/blog/user/${userId}`);
            setPosts(res.data);
            setBlogTitle(""); setBlogContent("");
            alert("Yazı paylaşıldı.");
        } catch (e) { console.error(e); }
    };

    const handleDeletePost = async (id: number) => {
        if(!window.confirm("Silmek istiyor musun?")) return;
        try {
            await axios.delete(`http://localhost:8081/api/blog/${id}`);
            setPosts(posts.filter(p => p.id !== id));
        } catch(e) { console.error(e); }
    };

    // 3. Not Ekle / Sil
    const handleAddNote = async () => {
        if (!noteTitle || !noteContent) return alert("Başlık ve içerik giriniz.");
        try {
            await axios.post(`http://localhost:8081/api/notes/${userId}`, { title: noteTitle, content: noteContent });
            const res = await axios.get(`http://localhost:8081/api/notes/user/${userId}`);
            setNotes(res.data);
            setNoteTitle(""); setNoteContent("");
        } catch (e) { console.error(e); }
    };

    const handleDeleteNote = async (id: number) => {
        if(!window.confirm("Notu silmek istiyor musun?")) return;
        try {
            await axios.delete(`http://localhost:8081/api/notes/${id}`);
            setNotes(notes.filter(n => n.id !== id));
        } catch(e) { console.error(e); }
    };

    if (loading) return <div className="min-h-screen bg-[#0f1115] flex items-center justify-center text-white">Yükleniyor...</div>;

    return (
        <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-yellow-500/30 flex flex-col">

            {/* Üst Bar */}
            <nav className="px-6 py-5 border-b border-gray-800/50 sticky top-0 bg-[#0f1115]/90 backdrop-blur-md z-50 flex justify-between">
                <button onClick={() => navigate("/favorites")} className="flex items-center gap-2 text-gray-400 hover:text-white transition font-medium text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    PROFİLE DÖN
                </button>
                <div className="text-white font-bold tracking-wide">KONTROL PANELİ</div>
            </nav>

            <div className="flex flex-col lg:flex-row flex-grow max-w-7xl mx-auto w-full p-6 gap-8">

                {/* SOL MENÜ (Sidebar) */}
                <aside className="lg:w-1/4 flex flex-col gap-2">
                    {/* Profil Özeti */}
                    <div className="bg-[#181a20] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold text-black mb-4 shadow-lg">
                            {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <h2 className="text-xl font-bold text-white">{fullName}</h2>
                        <p className="text-gray-500 text-xs mt-1">{email}</p>
                    </div>

                    {/* Menü Butonları */}
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-[#181a20] text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Hesap Ayarları
                    </button>

                    <button
                        onClick={() => setActiveTab('blog')}
                        className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'blog' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-[#181a20] text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Blog Yönetimi
                    </button>

                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${activeTab === 'notes' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-[#181a20] text-gray-400 hover:text-white hover:bg-gray-800'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Not Defteri
                    </button>
                </aside>

                {/* SAĞ İÇERİK ALANI */}
                <main className="lg:w-3/4 bg-[#181a20] p-8 rounded-[2.5rem] shadow-2xl border border-white/5 min-h-[500px]">

                    {/* --- TAB 1: HESAP AYARLARI --- */}
                    {activeTab === 'settings' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Profil Bilgileri</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Ad Soyad</label>
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-[#0f1115] rounded-xl border border-gray-800 text-white focus:outline-none focus:border-yellow-500 transition-all" />
                                </div>
                                <div className="space-y-2 opacity-60">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">E-posta (Sabit)</label>
                                    <input type="text" value={email} readOnly className="w-full px-4 py-3 bg-[#0f1115] rounded-xl border border-gray-800 text-gray-400 cursor-not-allowed" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Yeni Şifre (İsteğe Bağlı)</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Değiştirmek istemiyorsan boş bırak" className="w-full px-4 py-3 bg-[#0f1115] rounded-xl border border-gray-800 text-white focus:outline-none focus:border-yellow-500 transition-all" />
                                </div>
                                <button type="submit" className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-1">
                                    Kaydet
                                </button>
                            </form>
                        </div>
                    )}

                    {/* --- TAB 2: BLOG YÖNETİMİ --- */}
                    {activeTab === 'blog' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4 flex justify-between items-center">
                                Blog Yönetimi
                                <button onClick={() => navigate("/blog")} className="text-xs text-yellow-500 hover:underline">Genel Akışı Gör →</button>
                            </h2>

                            <div className="flex flex-col gap-4 mb-10 bg-[#0f1115] p-6 rounded-2xl border border-gray-800">
                                <input type="text" placeholder="Yazı Başlığı..." className="w-full bg-[#181a20] p-4 rounded-xl text-white border border-gray-700 outline-none focus:border-yellow-500" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
                                <textarea placeholder="İçeriğini buraya yaz..." className="w-full bg-[#181a20] p-4 rounded-xl text-white border border-gray-700 outline-none focus:border-yellow-500 h-32 resize-none" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} />
                                <button onClick={handleAddPost} className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition shadow-lg self-end px-8">Paylaş</button>
                            </div>

                            <div className="space-y-4">
                                {posts.length === 0 ? <p className="text-gray-500 text-center">Henüz yazı paylaşmadın.</p> : posts.map(post => (
                                    <div key={post.id} className="bg-[#0f1115] p-5 rounded-2xl border border-gray-800 flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-bold text-yellow-400 text-lg">{post.title}</h4>
                                            <p className="text-gray-400 text-sm line-clamp-1">{post.content}</p>
                                            <span className="text-xs text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <button onClick={() => handleDeletePost(post.id)} className="text-red-500 bg-red-500/10 p-2 rounded-lg hover:bg-red-500 hover:text-white transition">Sil</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- TAB 3: NOT DEFTERİ --- */}
                    {activeTab === 'notes' && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Kişisel Notlar</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-[#0f1115] p-6 rounded-2xl border border-gray-800">
                                <input type="text" placeholder="Başlık" className="bg-[#181a20] text-white p-3 rounded-xl border border-gray-700 outline-none focus:border-yellow-500" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
                                <input type="text" placeholder="İçerik..." className="bg-[#181a20] text-white p-3 rounded-xl border border-gray-700 outline-none focus:border-yellow-500 md:col-span-2" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
                                <button onClick={handleAddNote} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition md:col-span-3">Not Ekle +</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {notes.length === 0 ? <p className="text-gray-500 col-span-2 text-center">Henüz notun yok.</p> : notes.map(note => (
                                    <div key={note.id} className="bg-[#0f1115] p-5 rounded-2xl border border-gray-800 relative group">
                                        <button onClick={() => handleDeleteNote(note.id)} className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition hover:bg-red-500/10 p-1 rounded">✖</button>
                                        <h3 className="font-bold text-yellow-400 mb-2">{note.title}</h3>
                                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{note.content}</p>
                                        <span className="text-xs text-gray-600 mt-3 block">{new Date(note.createdAt).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

export default ProfilePage;