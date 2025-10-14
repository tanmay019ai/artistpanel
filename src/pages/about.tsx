'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react'; // 🆕 Back icon

export default function AboutAdmin({ onBack }: { onBack: () => void }) { // 🆕 Accept onBack prop
  const [formData, setFormData] = useState({
    name: '',
    bio1: '',
    bio2: '',
    bio3: '',
    years: '',
    exhibitions: '',
    collectors: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing About data
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get('/api/about/');
        const aboutRes = res.data as {
          success: boolean;
          data: {
            name: string;
            bio1: string;
            bio2: string;
            bio3: string;
            stats: {
              years: string;
              exhibitions: string;
              collectors: string;
            };
          };
        };
        if (aboutRes.success) {
          const data = aboutRes.data;
          setFormData({
            name: data.name,
            bio1: data.bio1,
            bio2: data.bio2,
            bio3: data.bio3,
            years: data.stats.years,
            exhibitions: data.stats.exhibitions,
            collectors: data.stats.collectors,
          });
        }
      } catch (err) {
        console.error('Error fetching about:', err);
      }
    };
    fetchAbout();
  }, []);

  // Handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updates to API
  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        name: formData.name,
        bio1: formData.bio1,
        bio2: formData.bio2,
        bio3: formData.bio3,
        stats: {
          years: Number(formData.years),
          exhibitions: Number(formData.exhibitions),
          collectors: Number(formData.collectors),
        },
      };
      const res = await axios.post('/api/about', payload);
      const data = res.data as { success: boolean };
      if (data.success) {
        setMessage('✅ About section updated successfully!');
      } else {
        setMessage('❌ Update failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-10">
      {/* 🆕 Top bar with back button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-amber-700">Edit About Section</h1>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl p-8">
        {/* Left Side: Text Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-stone-600 mb-2">Artist Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 mb-2">Bio Line 1</label>
            <textarea
              name="bio1"
              value={formData.bio1}
              onChange={handleChange}
              rows={2}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 mb-2">Bio Line 2</label>
            <textarea
              name="bio2"
              value={formData.bio2}
              onChange={handleChange}
              rows={2}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 mb-2">Bio Line 3</label>
            <textarea
              name="bio3"
              value={formData.bio3}
              onChange={handleChange}
              rows={2}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        {/* Right Side: Stats */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-stone-700 mb-4">Stats</h2>

          <div>
            <label className="block text-stone-600 mb-2">Years</label>
            <input
              type="number"
              name="years"
              value={formData.years}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 mb-2">Exhibitions</label>
            <input
              type="number"
              name="exhibitions"
              value={formData.exhibitions}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 mb-2">Collectors</label>
            <input
              type="number"
              name="collectors"
              value={formData.collectors}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          {message && <p className="text-center mt-3 text-stone-700">{message}</p>}
        </div>
      </div>
    </div>
  );
}
