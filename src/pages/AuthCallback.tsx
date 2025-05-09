import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          throw new Error('Token tidak ditemukan');
        }

        localStorage.setItem('token', token);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Error handling auth callback:', err);
        setError(err instanceof Error ? err.message : 'Otentikasi gagal');

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-700"></div>
        <p className="mt-4 text-lg text-teal-800">Memproses otentikasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <p className="text-sm mt-2">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;