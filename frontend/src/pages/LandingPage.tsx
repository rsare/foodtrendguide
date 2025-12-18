function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to FoodTrend Guide 🍽️</h1>
            <p className="text-gray-300 mb-8 text-center px-4">Discover top-rated venues and share your favorites.</p>

            {/* Mevcut Keşfet Butonu */}
            <a
                href="/home"
                className="px-8 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition mb-12 shadow-lg"
            >
                Explore Venues
            </a>

            {/* İSTEDİĞİN EKSTRA BUTONLAR / LİNKLER */}
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-6">
                    <a
                        href="/admin"
                        className="text-gray-400 hover:text-red-500 text-sm font-medium transition flex items-center gap-1 border-b border-transparent hover:border-red-500"
                    >
                         Yönetici Paneli
                    </a>
                    <a
                        href="/info"
                        className="text-gray-400 hover:text-blue-500 text-sm font-medium transition flex items-center gap-1 border-b border-transparent hover:border-blue-500"
                    >
                         Sistem Bilgisi
                    </a>
                </div>

                {/* Admin sayfasındaki gibi küçük bir geri dönüş linki stili */}
                <p className="text-[10px] text-gray-500 mt-4 opacity-50 italic">
                    Server-Side Rendered (SSR) Pages
                </p>
            </div>
        </div>
    );
}

export default LandingPage;