'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, MoreVertical, X } from 'lucide-react';

interface GalleryAdminProps {
  onBack: () => void;
}

interface ImageData {
  id: number;
  title: string;
  medium: string;
  year: string;
  file: File | null;
  preview: string;
  image_url?: string;
}

export default function GalleryAdmin({ onBack }: GalleryAdminProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ Initialize gallery slots (always 6)
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get<{ success: boolean; data?: any[] }>('/api/gallery');
        if (res.data.success && res.data.data) {
          const fetched = res.data.data;

          // Ensure exactly 6 slots
          const filled = Array.from({ length: 6 }, (_, i) => {
            const existing = fetched.find((item) => item.id === i + 1);
            return (
              existing || {
                id: i + 1,
                title: '',
                medium: '',
                year: '',
                file: null,
                preview: '',
              }
            );
          });

          // Show preview from existing image_url if present
          const withPreviews = filled.map((img) => ({
            ...img,
            preview: img.image_url || img.preview || '',
          }));

          setImages(withPreviews);
        }
      } catch (err) {
        console.error('❌ Failed to fetch gallery data:', err);
      }
    };

    fetchGallery();
  }, []);

  // ✅ Update text fields
  const handleChange = (
    id: number,
    field: keyof Omit<ImageData, 'id' | 'file' | 'preview'>
  , value: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, [field]: value } : img))
    );
  };

  // ✅ Handle file upload
  const handleFileChange = (id: number, file: File | null) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? {
              ...img,
              file,
              preview: file ? URL.createObjectURL(file) : img.preview,
            }
          : img
      )
    );
  };

  // ✅ Remove file from a slot
  const removeFile = (id: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, file: null, preview: '', image_url: '' } : img
      )
    );
  };

  // ✅ Save only changed data
  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();

      // Append title, medium, year for all slots
      images.forEach((img) => {
        formData.append('title[]', img.title || '');
        formData.append('medium[]', img.medium || '');
        formData.append('year[]', img.year || '');
      });

      // Append only valid image files
      images.forEach((img) => {
        if (img.file && img.file.size > 0) {
          formData.append('image[]', img.file);
        } else {
          // Send an empty blob so server knows to skip update
          formData.append('image[]', new Blob([], { type: 'text/plain' }));
        }
      });

      const res = await axios.post<{ success: boolean; message?: string }>(
        '/api/gallery',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setMessage(
        res.data.success
          ? '✅ Gallery updated successfully!'
          : '❌ Update failed.'
      );
    } catch (err) {
      console.error('❌ Upload error:', err);
      setMessage('❌ Server error.');
    } finally {
      setLoading(false);
    }
  };

  const selectedImage = images.find((img) => img.id === selectedId);

  return (
    <div className="min-h-screen bg-stone-50 p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-10">
        <h1 className="text-4xl font-bold text-amber-700">Edit Gallery</h1>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-amber-700 transition"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      {/* Menu */}
      <div className="hidden sm:flex flex-wrap gap-4 mb-6">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelectedId(img.id)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedId === img.id
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-stone-300 hover:bg-amber-100'
            } transition`}
          >
            Image #{img.id}
          </button>
        ))}
      </div>

      {/* Mobile dropdown */}
      <div className="sm:hidden relative mb-6">
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="p-2 bg-white border border-stone-300 rounded-full hover:bg-amber-100 transition"
        >
          <MoreVertical size={20} />
        </button>
        {mobileMenuOpen && (
          <div className="absolute mt-2 w-48 bg-white border border-stone-300 rounded-lg shadow-lg z-10">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => {
                  setSelectedId(img.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-amber-100 ${
                  selectedId === img.id ? 'bg-amber-50 font-semibold' : ''
                }`}
              >
                Image #{img.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Editor form */}
      {selectedImage && (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-amber-700">
            Editing Image #{selectedImage.id}
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={selectedImage.title}
            onChange={(e) =>
              handleChange(selectedImage.id, 'title', e.target.value)
            }
            className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <input
            type="text"
            placeholder="Medium"
            value={selectedImage.medium}
            onChange={(e) =>
              handleChange(selectedImage.id, 'medium', e.target.value)
            }
            className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <input
            type="text"
            placeholder="Year"
            value={selectedImage.year}
            onChange={(e) =>
              handleChange(selectedImage.id, 'year', e.target.value)
            }
            className="border p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          />

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange(
                  selectedImage.id,
                  e.target.files ? e.target.files[0] : null
                )
              }
              className="w-full"
            />
            {selectedImage.file && (
              <button
                onClick={() => removeFile(selectedImage.id)}
                className="absolute top-1 right-1 bg-stone-100 rounded-full p-1 hover:bg-stone-200 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* ✅ Preview */}
          {selectedImage.preview && (
            <Image
              src={selectedImage.preview}
              alt={`Preview ${selectedImage.id}`}
              width={400}
              height={192}
              className="w-full h-48 object-cover rounded-xl shadow-md"
              loader={({ src }) => src}
              unoptimized
            />
          )}

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
