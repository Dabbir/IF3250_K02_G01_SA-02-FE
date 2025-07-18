import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

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
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_HOST_NAME;

  useEffect(() => {
    const processToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        toast.error("Login gagal: Token tidak ditemukan");
        navigate('/login');
        return;
      }

      localStorage.setItem('token', token);

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("Decoded Token:", decoded);
        const userId = decoded.id;

        if (!userId) {
          throw new Error("User ID tidak ditemukan dalam token");
        }

          try {
            const response = await fetch(`${API_URL}/api/users/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              }
            });

            const data = await response.json();
            
            if (response.ok) {
              console.log(data)
              if (data.user.nama_masjid) {
                console.log("test")
                toast.success("Login berhasil!");
                setTimeout(() => {
                  navigate("/dashboard");
                }, 1000);
              } else if (data.user && !data.user.nama_masjid) {
                toast.info("Silakan lengkapi data diri Anda");
                setTimeout(() => {
                  navigate("/register-datadiri", { state: { userId } });
                }, 1000);
              } else {
                toast.error("Terjadi kesalahan. Silakan coba lagi.");
                navigate('/login');
              }
            } else {
              toast.error(data.message || "Akun tidak ditemukan. Silakan coba lagi.");
              navigate('/login');
            }
          } catch (error) {
            console.error("Error:", error);
            toast.error("Terjadi kesalahan. Silakan coba lagi.");
            navigate('/login');
          }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Login gagal: Token tidak valid");
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    processToken();
  }, [location, navigate, API_URL]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        {isLoading ? "Memproses..." : "Mengalihkan..."}
      </h2>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-700 border-r-transparent"></div>
      <p className="mt-4 text-gray-600">Anda akan dialihkan dalam beberapa saat...</p>
    </div>
  );
};

export default GoogleCallback;