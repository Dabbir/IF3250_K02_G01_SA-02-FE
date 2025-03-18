import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  id: number;
  email: string;
  peran: string;
  masjid_id: number | null;
  iat: number;
  exp: number;
}


const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processToken = () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      console.log("Token received:", token ? "Yes (hidden)" : "No");

      if (!token) {
        toast.error("Login gagal: Token tidak ditemukan");
        navigate('/login');
        return;
      }

      localStorage.setItem('token', token);
      toast.success("Login berhasil!");

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("Decoded Token:", decoded);
        const userId = decoded.id;


        if (!userId) {
          throw new Error("User ID tidak ditemukan dalam token");
        }

        setTimeout(() => {
          navigate("/register-datadiri", { state: { userId } });
        }, 2000);
      } catch (error) {
        toast.error("Login gagal: Token tidak valid");
        navigate('/login');
      }
    };

    processToken();
  }, [location, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Memproses login...</h2>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-700 border-r-transparent"></div>
      <p className="mt-4 text-gray-600">Anda akan dialihkan dalam beberapa saat...</p>
    </div>
  );
};

export default GoogleCallback;
