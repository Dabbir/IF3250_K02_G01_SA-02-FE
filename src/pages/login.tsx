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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("showSuccessLogoutToast") === "true") {
      toast.success("Logout berhasil!");
      localStorage.removeItem("showSuccessLogoutToast");
    }
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    let isValid = true;
  
    if (!email.trim()) {
      setEmailError("Alamat email wajib diisi.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Format email tidak valid.");
      isValid = false;
    } else {
      setEmailError("");
    }
  
    if (!password.trim()) {
      setPasswordError("Kata sandi wajib diisi.");
      isValid = false;
    } else {
      setPasswordError("");
    }
  
    if (!isValid) return;
  
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
      toast.error(err instanceof Error ? err.message : "Login gagal. Silakan coba lagi.");
    }
  };
  
  

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_HOST_NAME}/api/auth/google?source=login`;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-white">
      <div className="w-full md:w-1/2 z-10 flex flex-col justify-center p-4 md:p-8 lg:p-12 order-2 md:order-1 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-[430px] w-full mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-6 md:mb-8 animate-[fade-in-up_0.6s_ease-out_forwards]">
            Masuk
          </h1>

          <form onSubmit={handleLogin} className="animate-[fade-in-up_0.6s_ease-out_forwards_200ms]">
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-cooper mb-2 text-gray-700">Alamat Email</label>
              <input
                data-cy="email-input"
                className={`w-full p-3 border ${emailError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-400 pr-10`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                placeholder="Masukkan alamat email Anda"
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div className="mb-4 relative">
              <label className="block text-sm font-cooper mb-2 text-gray-700">Kata Sandi</label>
              <div className="relative">
                <input
                  data-cy="password-input"
                  className={`w-full p-3 border ${passwordError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-400 pr-10`}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError("")
                  }}
                  placeholder="Masukkan kata sandi Anda"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>

            <div className="mb-6">
              {error && <p className="text-red-500 text-sm mt-2 animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]">{error}</p>}
            </div>

            <button
              data-cy="login-button"
              type="submit"
              className="w-full text-white py-3 rounded-lg transition-all duration-300 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transform hover:scale-[1.02] hover:shadow-lg">
              Masuk
            </button>
          </form>

          <div className="flex items-center my-6 animate-[fade-in-up_0.6s_ease-out_forwards_400ms]">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#3A786D] to-transparent"></div>
            <div className="mx-4 text-[#3A786D] font-medium">ATAU</div>
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#3A786D] to-transparent"></div>
          </div>

          <button
            data-cy="google-login-button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md animate-[fade-in-up_0.6s_ease-out_forwards_600ms]"
          >
            <img src={Google} alt="Google Logo" className="w-5 h-5 md:w-6 md:h-6" />
            <span className="ml-2 text-sm md:text-base font-medium text-gray-700">Masuk dengan Akun Google</span>
          </button>

          <div className="text-center mt-6 animate-[fade-in-up_0.6s_ease-out_forwards_800ms]">
            <span className="text-sm font-cooper text-gray-600">Belum memiliki akun? </span>
            <a href="/register" className="text-sm text-teal-700 hover:text-teal-800 hover:underline font-medium transition-colors">
              Daftar Di Sini
            </a>
          </div>
        </div>
      </div>

      <div className="relative w-full md:w-1/2 h-40 md:h-full order-1 md:order-2">
        <div
          className="absolute top-0 bottom-0 left-0 w-24 bg-white hidden md:block shadow-2xl"
          style={{ transform: 'skewX(-6deg) translateX(-50%)', zIndex: 5, height: '100%' }}
        ></div>
        
        <div className="h-full w-full bg-gradient-to-br from-[#E7DECD] via-[#F0E6D9] to-[#D8CCBA] flex flex-col items-center justify-center pt-4 md:pt-12 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl animate-[blob_10s_infinite]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-[blob_10s_infinite_2s]"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl animate-[blob_10s_infinite_4s]"></div>
          </div>

          <img 
            src="/logo-green.svg" 
            className="w-40 md:w-70 animate-[scale-in_0.6s_ease-out_forwards] drop-shadow-2xl" 
            alt="Logo"
          />
          
          <div className="py-2 md:py-8 hidden md:block animate-[fade-in-up_0.6s_ease-out_forwards_600ms]">
            <img 
              src={DashboardDisplay} 
              alt="Dashboard Preview" 
              className="drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;