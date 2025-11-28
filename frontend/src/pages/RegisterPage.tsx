import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
    const navigate = useNavigate();

    // Form verilerini tutacak state
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    // ✅ DÜZELTİLEN KISIM: handleChange fonksiyonu
    // Inputun "name" özelliğine göre state'i günceller.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8081/api/auth/register", formData);
            alert("Kayıt başarılı! Giriş yapabilirsiniz.");
            navigate("/login");
        } catch (error) {
            console.error("Kayıt hatası", error);
            alert("Kayıt başarısız. E-posta kullanılıyor olabilir.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Kayıt Ol 👋</h1>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        name="fullName"  // 👈 EKLENDİ: State'teki isimle aynı olmalı
                        placeholder="Ad Soyad"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={formData.fullName}
                        onChange={handleChange} // 👈 EKLENDİ: Fonksiyonu buraya bağladık
                        required
                    />
                    <input
                        type="email"
                        name="email" // 👈 EKLENDİ
                        placeholder="E-posta"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={formData.email}
                        onChange={handleChange} // 👈 EKLENDİ
                        required
                    />
                    <input
                        type="password"
                        name="password" // 👈 EKLENDİ
                        placeholder="Şifre"
                        className="w-full p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={formData.password}
                        onChange={handleChange} // 👈 EKLENDİ
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