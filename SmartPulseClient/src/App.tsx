import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
    // Hafızada token var mı kontrol et
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                {/* Giriş sayfası */}
                <Route path="/login" element={<Login />} />
                
                {/* Ana sayfa (Dashboard): Eğer giriş yapılmışsa göster, yoksa login'e at */}
                <Route 
                    path="/" 
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
                />
            </Routes>
        </Router>
    );
};

export default App;
