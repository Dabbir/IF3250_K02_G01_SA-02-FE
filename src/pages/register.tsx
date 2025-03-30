import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import DashboardDisplay from "@/assets/dashboard-display.png";
import Google from "@/assets/Google.svg";

const Register = () => {
    const API_URL = import.meta.env.VITE_HOST_NAME;
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");

    const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!termsAccepted) {
          setError("Anda harus menyetujui Syarat & Ketentuan.");
          return;
      }
      if (password.length < 6) {
          setError("Kata sandi harus memiliki minimal 6 karakter.");
          return;
      }
      if (password !== confirmPassword) {
          setError("Konfirmasi kata sandi tidak cocok.");
          return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              email: email,
              password: password,
              nama: `${firstName} ${lastName}`,
          }),
        });
      
        const data = await response.json();
        if (!response.ok) {
          setError(data.message || "Pendaftaran gagal. Silakan coba lagi.");
          return;
        }
        console.log(data.user.id)
        navigate("/register-datadiri", { state: { userId: data.user.id } });
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Pendaftaran gagal. Silakan coba lagi.");
        }
      }
    }; 

    const handleGoogleSignup = () => {
      window.location.href = `${import.meta.env.VITE_HOST_NAME}/api/auth/google?source=register`;
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-white min-h-screen">
          {/* Left Side - Form (Full width on mobile, half on desktop) */}
          <div className="w-full md:w-1/2 z-10 flex flex-col justify-start p-4 md:p-8 lg:p-12 order-2 md:order-1 overflow-y-auto no-scrollbar">
            <div className="max-w-[430px] w-full mx-auto md:mx-0 md:ml-auto md:mr-12 lg:mr-24">
              <h1 className="text-3xl md:text-4xl lg:text-[48px] font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-6 md:mb-8">Daftar</h1>
              
              <form onSubmit={handleNext} className="w-full">
                <div className="flex flex-col md:flex-row md:gap-4 mb-4">
                  <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <label className="block text-sm font-cooper mb-2">Nama Depan</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama depan" 
                      className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-cooper mb-2">Nama Belakang</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama belakang" 
                      className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-cooper mb-2">Alamat Email</label>
                  <input 
                    type="email" 
                    placeholder="Masukkan alamat email Anda" 
                    className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
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

                <div className="mb-4">
                  <label className="block text-sm font-cooper mb-2">Konfirmasi Kata Sandi</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi kata sandi Anda" 
                      className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mr-2 h-4 w-4"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="terms" className="text-sm">
                      Saya menyetujui Syarat & Ketentuan aplikasi
                    </label>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-md transition-colors h-10"
                >
                  Lanjut
                </button>
                
                <div className="flex items-center my-6">
                  <div className="flex-grow h-px bg-[#3A786D]"></div>
                  <div className="mx-4 text-[#3A786D]">ATAU</div>
                  <div className="flex-grow h-px bg-[#3A786D]"></div>
                </div>
                
                <button 
                  onClick={handleGoogleSignup}
                  type="button" 
                  className="w-full flex items-center justify-center border border-gray-300 py-3 rounded hover:bg-gray-50 transition h-12"
                >
                  <img src={Google} alt="Google Logo" className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="ml-2 text-sm md:text-base">Lanjut dengan Akun Google</span>
                </button>
                
                <div className="text-center mt-6 mb-8 md:mb-0">
                  <span className="text-sm font-cooper">Sudah memiliki akun? </span>
                  <a href="/login" className="text-sm text-teal-700 hover:underline">Masuk Di Sini</a>
                </div>
              </form>
            </div>
          </div>
          
          {/* Right Side - Image (Hidden on small screens, shown on md and up) */}
          <div className="relative w-full md:w-1/2 h-40 md:h-full order-1 md:order-2 overflow-hidden">
            {/* Skewed edge - Hidden on mobile */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-24 bg-white hidden md:block"
              style={{
                transform: 'skewX(-6deg) translateX(-50%)',
                zIndex: 5,
                height: '100vh'
              }}
            ></div>
            
            <div className="h-full w-full bg-[#E7DECD] flex flex-col items-center justify-center pt-4 md:pt-12 px-4 md:px-8">
              <img src="/logo-green.svg" className="w-40 md:w-70" />
              <div className="py-2 md:py-8 hidden md:block">
                <img src={DashboardDisplay} alt="Dashboard Preview" className="max-w-full" />
              </div>
            </div>
          </div>
        </div>
    );
};

export default Register;