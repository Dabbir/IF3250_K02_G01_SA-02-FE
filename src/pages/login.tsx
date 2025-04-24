import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import DashboardDisplay from "@/assets/dashboard-display.png";
import Google from "@/assets/Google.svg";

const API_URL = import.meta.env.VITE_HOST_NAME;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (localStorage.getItem("showSuccessLogoutToast") === "true") {
      toast.success("Logout berhasil!");
      localStorage.removeItem("showSuccessLogoutToast");
    }
  }, []);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("showSuccessLoginToast", "true");
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Login gagal. Silakan coba lagi.");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Login gagal. Silakan coba lagi.");
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_HOST_NAME}/api/auth/google?source=login`;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-white">
      {/* Left Side - Form (Full width on mobile, half on desktop) */}
      <div className="w-full md:w-1/2 z-10 flex flex-col justify-center p-4 md:p-8 lg:p-12 order-2 md:order-1">
        <div className="max-w-[430px] w-full mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-6 md:mb-8">Masuk</h1>

          <form onSubmit={handleLogin}>
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-cooper mb-2">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan alamat email Anda"
                className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-sm font-cooper mb-2">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi Anda"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Checkbox Terms & Conditions */}
            <div className="mb-6">
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full text-white py-2 rounded-md transition-colors bg-teal-700 hover:bg-teal-800">
              Masuk
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-[#3A786D]"></div>
            <div className="mx-4 text-[#3A786D]">ATAU</div>
            <div className="flex-grow h-px bg-[#3A786D]"></div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center border border-gray-300 py-3 rounded hover:bg-gray-50 transition"
          >
            <img src={Google} alt="Google Logo" className="w-5 h-5 md:w-6 md:h-6" />
            <span className="ml-2 text-sm md:text-base">Masuk dengan Akun Google</span>
          </button>

          <div className="text-center mt-6">
            <span className="text-sm font-cooper">Belum memiliki akun? </span>
            <a href="/register" className="text-sm text-teal-700 hover:underline">Daftar Di Sini</a>
          </div>
        </div>
      </div>

      {/* Right Side - Image (Hidden on small screens, shown on md and up) */}
      <div className="relative w-full md:w-1/2 h-40 md:h-full order-1 md:order-2">
        <div 
          className="absolute top-0 bottom-0 left-0 w-24 bg-white hidden md:block"
          style={{ transform: 'skewX(-6deg) translateX(-50%)', zIndex: 5, height: '100%' }}
        ></div>
        <div className="h-full w-full bg-[#E7DECD] flex flex-col items-center justify-center pt-4 md:pt-12 px-4 md:px-8">
          <img src="/logo-green.svg" className="w-40 md:w-70" />
          <div className="py-2 md:py-8 hidden md:block">
            <img src={DashboardDisplay} alt="Dashboard Preview" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;