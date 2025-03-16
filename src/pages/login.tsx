import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff} from "lucide-react";
import DashboardDisplay from "@/assets/dashboard-display.png";
import Google from "@/assets/Google.svg";

const API_URL = import.meta.env.VITE_HOST_NAME;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsError, setTermsError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setTermsError("");

    if (!isChecked) {
      setTermsError("Anda harus menyetujui syarat & ketentuan.");
      return;
    }

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
          toast.success("Login berhasil!");

          localStorage.setItem("token", data.token);

          setTimeout(() => {
              window.location.href = "/dashboard";
          }, 3000);
      } else {
          setError(data.message || "Login gagal. Silakan coba lagi.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login gagal. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="colored" />

      <div className="w-1/2 z-10 flex flex-col justify-center p-12">
        <div className="max-w-[430px] w-full self-center">
          <h1 className="text-[48px] font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-8">Masuk</h1>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
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
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi Anda"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Checkbox Terms & Conditions */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm">
                  Saya menyetujui Syarat & Ketentuan aplikasi
                </label>
              </div>
              {termsError && <p className="text-red-500 text-sm mt-1">{termsError}</p>}
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

          <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded hover:bg-gray-50 transition">
            <img src={Google} alt="Google Logo" className="w-6 h-6" />
            <span className="ml-2">Masuk dengan Akun Google</span>
          </button>

          <div className="text-center mt-6">
            <span className="text-sm font-cooper">Belum memiliki akun? </span>
            <a href="/register" className="text-sm text-teal-700 hover:underline">Daftar Di Sini</a>
          </div>
        </div>
      </div>

      <div className="relative w-1/2 h-full">
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-white"
          style={{ transform: 'skewX(-6deg) translateX(-50%)', zIndex: 5, height: '100%' }}></div>

        <div className="h-full w-full bg-[#E7DECD] flex flex-col items-center justify-center pt-12 px-8">
          <img src="/logo-green.svg" className='w-70' />
          <div className='py-8'>
            <img src={DashboardDisplay} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;