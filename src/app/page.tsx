'use client';
import { useState, useEffect } from 'react';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import AboutAdmin from '@/pages/about';
import WritingsAdmin from '@/pages/writings';

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'about' | 'writings'>('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <>
      {currentPage === 'dashboard' && (
        <Dashboard
          onLogout={handleLogout}
          onNavigateAbout={() => setCurrentPage('about')}
          onNavigateWritings={() => setCurrentPage('writings')} // ✅ new navigation
        />
      )}

      {currentPage === 'about' && (
        <AboutAdmin onBack={() => setCurrentPage('dashboard')} />
      )}

      {currentPage === 'writings' && (
        <WritingsAdmin onBack={() => setCurrentPage('dashboard')} />
      )}
    </>
  );
}
