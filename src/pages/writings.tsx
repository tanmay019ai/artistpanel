'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, MoreVertical } from 'lucide-react';

interface Writing {
  id: number;
  title: string;
  type: string;
  date: string | null;
  content: string;
}

interface WritingsAdminProps {
  onBack: () => void;
}

export default function WritingsAdmin({ onBack }: WritingsAdminProps) {
  const [writings, setWritings] = useState<Writing[]>([
    { id: 1, title: '', type: '', date: '', content: '' },
    { id: 2, title: '', type: '', date: '', content: '' },
    { id: 3, title: '', type: '', date: '', content: '' },
    { id: 4, title: '', type: '', date: '', content: '' },
    { id: 5, title: '', type: '', date: '', content: '' },
    { id: 6, title: '', type: '', date: '', content: '' },
  ]);

  const [selectedId, setSelectedId] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile dropdown toggle

  useEffect(() => {
    const fetchWritings = async () => {
      try {
        const res = await axios.get('/api/writings');
        const data = res.data as { success: boolean; data: Writing[] };
        if (data.success && Array.isArray(data.data)) {
          const merged = writings.map((w, i) => ({
            ...w,
            ...(data.data[i] || {}),
          }));
          setWritings(merged);
        } else {
          console.warn('Admin API returned no writings.');
        }
      } catch (err) {
        console.error('Error fetching writings:', err);
        setMessage('❌ Failed to load writings from server.');
      }
    };
    fetchWritings();
  }, []);

  const handleChange = (id: number, field: keyof Writing, value: string) => {
    setWritings((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const cleanedWritings = writings.map((w) => ({
        ...w,
        date: w.date?.trim() === '' ? null : w.date,
      }));

      const res = await axios.post('/api/writings', { writings: cleanedWritings });
      const data = res.data as { success: boolean; message?: string };

      if (data.success) {
        setMessage('✅ Writings updated successfully!');
      } else {
        setMessage(`❌ Failed to update: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Save writings error:', err.response?.data || err.message || err);
      setMessage(`❌ Server error: ${err.response?.data?.message || err.message || 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedWriting = writings.find((w) => w.id === selectedId);

  return (
    <div className="min-h-screen bg-stone-50 p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-10">
        <h1 className="text-4xl font-bold text-amber-700">Edit Writings</h1>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Writing Selector */}
      {/* Desktop / Tablet: horizontal buttons */}
      <div className="hidden sm:flex flex-wrap gap-4 mb-6">
        {writings.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelectedId(w.id)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedId === w.id
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-stone-300 hover:bg-amber-100'
            } transition`}
          >
            Writing #{w.id}
          </button>
        ))}
      </div>

      {/* Mobile: three-dot dropdown */}
      <div className="sm:hidden relative mb-6">
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-2 bg-white border border-stone-300 rounded-full hover:bg-amber-100 transition"
        >
          <MoreVertical size={20} />
        </button>

        {mobileMenuOpen && (
          <div className="absolute mt-2 w-48 bg-white border border-stone-300 rounded-lg shadow-lg z-10">
            {writings.map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  setSelectedId(w.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-amber-100 ${
                  selectedId === w.id ? 'bg-amber-50 font-semibold' : ''
                }`}
              >
                Writing #{w.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Writing Form */}
      {selectedWriting && (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-amber-700">
            Editing Writing #{selectedWriting.id}
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={selectedWriting.title}
            onChange={(e) => handleChange(selectedWriting.id, 'title', e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <input
            type="text"
            placeholder="Type (Poem, Essay...)"
            value={selectedWriting.type}
            onChange={(e) => handleChange(selectedWriting.id, 'type', e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <input
            type="date"
            value={selectedWriting.date || ''}
            onChange={(e) => handleChange(selectedWriting.id, 'date', e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <textarea
            placeholder="Content"
            value={selectedWriting.content}
            onChange={(e) => handleChange(selectedWriting.id, 'content', e.target.value)}
            rows={6}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />

          {/* Save Button */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-amber-600 text-white py-3 px-8 rounded-xl hover:bg-amber-700 transition text-lg font-semibold"
            >
              {loading ? 'Saving...' : 'Save All Changes'}
            </button>
            {message && <p className="text-stone-700 text-center">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
