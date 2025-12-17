import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Импорт компонентов
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Импорт страниц
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Простая главная страница
const Home = () => (
  <div className="page" style={{ textAlign: 'center', padding: '60px 20px' }}>
    <h1 style={{ fontSize: '42px', color: 'var(--blue)', marginBottom: '20px' }}>
      🚀 Добро пожаловать в Трекер Технологий
    </h1>
    <p style={{ fontSize: '18px', color: 'var(--marengo)', marginBottom: '30px' }}>
      Отслеживайте свой прогресс в изучении React и других технологий
    </p>
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '40px'
    }}>
      <a href="/technologies" style={{
        padding: '15px 30px',
        backgroundColor: 'var(--pink)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        transition: 'background-color 0.3s'
      }}>
        Начать работу
      </a>
    </div>
  </div>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверка авторизации при запуске
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    localStorage.setItem('username', user);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Навигация отображается на всех страницах */}
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <main className="main-content">
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/technologies" element={<TechnologyList />} />
            <Route path="/technology/:techId" element={<TechnologyDetail />} />

            {/* Защищенные маршруты */}
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Statistics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Settings onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;