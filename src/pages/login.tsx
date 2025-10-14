'use client';
import { useState } from 'react';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email:username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        onLogin();
      } else {
        setError(data.message);
      }
    } catch {
      setError('Something went wrong. Try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-xl rounded-2xl p-8 w-96 space-y-5"
      >
        <h1 className="text-3xl font-bold text-center text-amber-700">
          Admin Login
        </h1>

        {error && (
          <p className="text-center text-red-600 text-sm font-medium">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
