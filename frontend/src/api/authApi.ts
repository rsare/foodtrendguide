import axios from 'axios';

// Eski hali ne olursa olsun sil ve bunu yapıştır:
const api = axios.create({
    baseURL: "/api", // <-- İŞTE SİHİRLİ KISIM BU
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;