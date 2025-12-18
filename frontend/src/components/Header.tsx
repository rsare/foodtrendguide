import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-[#101418] text-white flex justify-between items-center px-8 py-4 border-b border-gray-700">
            {/* Logo Alanı */}
            <Link to="/explore">
                <h1 className="text-2xl font-bold text-green-400">
                    FoodTrend <span className="text-gray-200">Guide 🍴</span>
                </h1>
            </Link>

            {/* Navigasyon ve Butonlar */}
            <nav className="flex items-center gap-4">
                <Link to="/explore" className="text-sm hover:text-green-400">Keşfet</Link>

                {/* Küçük ve Sade Butonlar */}
                <a href="/admin" className="text-[10px] bg-red-900/30 border border-red-500 px-2 py-1 rounded hover:bg-red-500 transition">
                    ADMIN
                </a>
                <a href="/info" className="text-[10px] bg-blue-900/30 border border-blue-500 px-2 py-1 rounded hover:bg-blue-500 transition">
                    INFO
                </a>
            </nav>
        </header>
    );
};

export default Header;