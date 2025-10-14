'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

interface Writing {
  id: number;
  title: string;
  type: string;
  date: string | null; // date can now be null
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

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch writings from admin API
  useEffect(() => {
    const fetchWritings = async () => {
      try {
        const res = await axios.get('/api/writings'); // ✅ admin API
        const data = res.data as { success: boolean; data: Writing[] };
        if (data.success && Array.isArray(data.data)) {
          // Merge fetched data with initial IDs to keep 6 rows
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

  // Handle input changes
  const handleChange = (id: number, field: keyof Writing, value: string) => {
    setWritings((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  // Save writings to admin API
  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Convert empty date strings to null to prevent DB error
      const cleanedWritings = writings.map(w => ({
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

  return (
    <div className="min-h-screen bg-stone-50 p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-amber-700">Edit Writings</h1>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Writings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {writings.map((writing, index) => (
          <div
            key={writing.id}
            className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-amber-700">
              Writing #{index + 1}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={writing.title}
              onChange={(e) => handleChange(writing.id, 'title', e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />

            <input
              type="text"
              placeholder="Type (Poem, Essay...)"
              value={writing.type}
              onChange={(e) => handleChange(writing.id, 'type', e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />

            <input
              type="date"
              value={writing.date || ''}
              onChange={(e) => handleChange(writing.id, 'date', e.target.value)}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />

            <textarea
              placeholder="Content"
              value={writing.content}
              onChange={(e) => handleChange(writing.id, 'content', e.target.value)}
              rows={4}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-10 flex flex-col items-center gap-3">
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
  );
}
