import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-[#101418] text-white flex justify-between items-center px-8 py-4 border-b border-gray-700">
            <Link to="/explore">
                <h1 className="text-2xl font-bold text-green-400">
                    FoodTrend <span className="text-gray-200">Guide 🍴</span>
                </h1>
            </Link>
            <nav className="flex gap-6">
                <Link to="/explore" className="hover:text-green-400">Keşfet</Link>
                <Link to="/bookmarks" className="hover:text-green-400">Favoriler</Link>
                <Link to="/profile" className="hover:text-green-400">Profil</Link>
            </nav>
        </header>
    );
};

export default Header;
