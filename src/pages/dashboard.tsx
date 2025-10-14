'use client';
import { useState } from 'react';
import { Brush, BookOpen, ImageIcon, Mail, LogOut } from 'lucide-react';

export default function Dashboard({
  onLogout,
  onNavigateAbout,
  onNavigateWritings, // ✅ Added new prop
}: {
  onLogout: () => void;
  onNavigateAbout: () => void;
  onNavigateWritings: () => void;
}) {
  const [message] = useState('Welcome to Your Artist Dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-stone-50 to-white p-10 flex flex-col items-center">
      {/* Header Section */}
      <header className="w-full max-w-6xl text-center mb-12">
        <h1 className="text-5xl font-extrabold text-amber-700 mb-2">{message}</h1>
        <p className="text-stone-600 text-lg">
          Manage your{' '}
          <span className="font-medium text-amber-700">About</span>,{' '}
          <span className="font-medium text-amber-700">Writings</span>,{' '}
          <span className="font-medium text-amber-700">Gallery</span>, and{' '}
          <span className="font-medium text-amber-700">Contact Messages</span>.
        </p>
      </header>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl mb-12">
        {/* About */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center">
          <Brush size={40} className="text-amber-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-stone-800">About</h2>
          <p className="text-stone-500 text-sm">Edit your bio and artist profile.</p>
          <button
            onClick={onNavigateAbout}
            className="mt-4 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition"
          >
            Edit
          </button>
        </div>

        {/* Writings */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center">
          <BookOpen size={40} className="text-amber-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-stone-800">Writings</h2>
          <p className="text-stone-500 text-sm">Manage blogs, essays, or notes.</p>
          <button
            onClick={onNavigateWritings}
            className="mt-4 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition"
          >
            Edit
          </button>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center">
          <ImageIcon size={40} className="text-amber-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-stone-800">Gallery</h2>
          <p className="text-stone-500 text-sm">Upload or modify artworks.</p>
          <button
            className="mt-4 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition"
            disabled
          >
            Coming Soon
          </button>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center text-center">
          <Mail size={40} className="text-amber-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2 text-stone-800">Contacts</h2>
          <p className="text-stone-500 text-sm">View messages from your website.</p>
          <button
            className="mt-4 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition"
            disabled
          >
            Coming Soon
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="bg-gray-600 text-white py-3 px-8 rounded-xl hover:bg-gray-700 transition text-lg shadow-md flex items-center gap-2"
      >
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
}
