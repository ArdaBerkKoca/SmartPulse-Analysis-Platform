import React, { useState } from 'react';
import api from '../api'; // Az önce oluşturduğun api.ts

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/Auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            
            // window.navigate yerine window.location.href kullanıyoruz ki 
            // App.tsx en baştan yüklensin ve token'ı görsün.
            window.location.href = '/'; 
        } catch (err: any) {
            alert("Giriş hatası: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h2 style={{ textAlign: 'center', color: '#333' }}>SmartPulse Giriş</h2>
                
                <div style={styles.inputGroup}>
                    <label>Kullanıcı Adı</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                </div>
                
                <div style={styles.inputGroup}>
                    <label>Şifre</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={styles.input}
                    />
                </div>
                
                <button type="submit" style={styles.button}>Giriş Yap</button>
            </form>
        </div>
    );
};

// Basit inline stiller (Dilersen CSS dosyasına taşıyabilirsin)
const styles: { [key: string]: React.CSSProperties } = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100vw',  // Ekran genişliğinin tamamı
        height: '100vh', // Ekran yüksekliğinin tamamı
        backgroundColor: '#1a1a1a', // Sağdaki siyah boşlukla uyumlu olsun diye
        position: 'fixed', // Her şeyi arkada bırak ve öne gel
        top: 0,
        left: 0,
        zIndex: 9999
    },
    form: { 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)', 
        width: '100%',
        maxWidth: '400px', // Çok yayılmasın ama dar da kalmasın
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px' 
    },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ddd' },
    button: { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;
