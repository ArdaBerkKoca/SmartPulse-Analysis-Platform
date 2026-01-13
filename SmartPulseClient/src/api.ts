import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5084/api', // Senin backend portun
});

// BU KISIM ÇOK ÖNEMLİ: Her isteğe o "anahtarı" otomatik ekleyen interceptor
api.interceptors.request.use((config) => {
    // Tarayıcı hafızasından token'ı oku
    const token = localStorage.getItem('token');
    
    if (token) {
        // Eğer token varsa, isteğin başına "Bearer [token]" olarak ekle
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
