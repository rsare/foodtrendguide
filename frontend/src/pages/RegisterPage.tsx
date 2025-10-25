import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Burada ileride backend'e POST isteği göndereceğiz (/api/auth/register)
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Kayıt Ol 👋</h1>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Ad Soyad"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="E-posta"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Şifre"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition"
                    >
                        Kayıt Ol
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-4">
                    Zaten hesabın var mı?{" "}
                    <span
                        className="text-yellow-400 cursor-pointer hover:underline"
                        onClick={() => navigate("/login")}
                    >
            Giriş Yap
          </span>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
