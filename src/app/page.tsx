'use client';
import { useState, useEffect } from 'react';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import AboutAdmin from '@/pages/about';
import WritingsAdmin from '@/pages/writings';
import GalleryAdmin from '@/pages/gallery'; // ✅ added gallery page

export default function Page() {
  // ✅ Login and page state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'about' | 'writings' | 'gallery'>('dashboard');

  // ✅ Check login from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  // ✅ Not logged in → show login
  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  // ✅ Logged in → show dashboard or selected section
  return (
    <>
      {currentPage === 'dashboard' && (
        <Dashboard
          onLogout={handleLogout}
          onNavigateAbout={() => setCurrentPage('about')}
          onNavigateWritings={() => setCurrentPage('writings')}
          onNavigateGallery={() => setCurrentPage('gallery')} // ✅ added
        />
      )}

      {currentPage === 'about' && (
        <AboutAdmin onBack={() => setCurrentPage('dashboard')} />
      )}

      {currentPage === 'writings' && (
        <WritingsAdmin onBack={() => setCurrentPage('dashboard')} />
      )}

      {currentPage === 'gallery' && (
        <GalleryAdmin onBack={() => setCurrentPage('dashboard')} />
      )}
    </>
  );
}
