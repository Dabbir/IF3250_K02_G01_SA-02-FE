import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
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
      const source = params.get('source') || 'login'; // Default to login if not specified

      console.log("Token received:", token ? "Yes (hidden)" : "No");
      console.log("Source:", source);

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

        if (source === 'register') {
          toast.success("Registrasi berhasil! Silakan lengkapi data diri Anda");
          setTimeout(() => {
            navigate("/register-datadiri", { state: { userId } });
          }, 1500);
        } else {
          try {
            const response = await fetch(`${API_URL}/api/users/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              }
            });

            const data = await response.json();
            console.log("User Profile Data:", data);
            
            if (response.ok) {
              if (data.user && data.user.short_bio) {
                toast.success("Login berhasil!");
                setTimeout(() => {
                  navigate("/dashboard");
                }, 1500);
              } else if (data.user && !data.user.nama_masjid) {
                toast.info("Silakan lengkapi data diri Anda");
                setTimeout(() => {
                  navigate("/register-datadiri", { state: { userId } });
                }, 1500);
              } else {
                toast.error("Terjadi kesalahan. Silakan coba lagi.");
                navigate('/login');
              }
            } else {
              toast.error(data.message || "Akun tidak ditemukan. Silakan coba lagi.");
              navigate('/login');
            }
          } catch (error) {
            console.error("Error checking user profile:", error);
            toast.error("Terjadi kesalahan. Silakan coba lagi.");
            navigate('/login');
          }
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        toast.error("Login gagal: Token tidak valid");
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    processToken();
  }, [location, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        {isLoading ? "Memproses..." : "Mengalihkan..."}
      </h2>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-700 border-r-transparent"></div>
      <p className="mt-4 text-gray-600">Anda akan dialihkan dalam beberapa saat...</p>
    </div>
  );
};

export default GoogleCallback;