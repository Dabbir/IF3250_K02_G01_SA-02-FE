import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import DashboardDisplay from "@/assets/dashboard-display.png";
import Google from "@/assets/Google.svg";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleNext = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!termsAccepted) {
            toast.error("Anda harus menyetujui Syarat & Ketentuan.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Konfirmasi kata sandi tidak cocok.");
            return;
        }
        localStorage.setItem("registerData", JSON.stringify({ email, password }));
        navigate("/register-datadiri");
    };  

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white" >
          {/*Left Side*/}
          <ToastContainer position="top-center" autoClose={3000} />
          <div className="w-1/2 z-10 flex flex-col justify-center p-12">
            <div className="max-w-[430px] w-full self-center">
            <h1 className="text-[48px] font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-8">Daftar</h1>
            
            <form onSubmit={handleNext} className="">
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

              <div className="mb-4 relative">
                <label className="block text-sm font-cooper mb-2">Konfirmasi Kata Sandi</label>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi kata sandi Anda" 
                  className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" className="absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              <div className="flex items-center mb-6">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mr-2" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                <label htmlFor="terms" className="text-sm">Saya menyetujui Syarat & Ketentuan aplikasi</label>
              </div>
              
              <button className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2 rounded-md transition-colors">
                Lanjut
              </button>

              
              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-[#3A786D]"></div>
                <div className="mx-4 text-[#3A786D]">ATAU</div>
                <div className="flex-grow h-px bg-[#3A786D]"></div>
              </div>
              
              <button 
                type="button" 
                className="w-full flex items-center justify-center border border-gray-300 py-3 rounded hover:bg-gray-50 transition"
              >
                <img src={Google} alt="Google Logo" className="w-6 h-6"/>
                <span className="ml-2">Lanjut dengan Akun Google</span>
              </button>
              
              <div className="text-center mt-6">
                <span className="text-sm font-cooper">Belum memiliki akun? </span>
                <a href="/login" className="text-sm text-teal-700 hover:underline">Masuk Di Sini</a>
              </div>
            </form>
            </div>
          </div>
          
          {/* Right Side */}
          <div className="relative w-1/2 h-full">
            <div 
              className="absolute top-0 bottom-0 left-0 w-24 bg-white" 
              style={{
                transform: 'skewX(-6deg) translateX(-50%)',
                zIndex: 5,
                height: '100%'
              }}
            ></div>
            
            <div className="h-full w-full bg-[#E7DECD] flex flex-col items-center justify-center pt-12 px-8">
              <img src="/logo-green.svg" className='w-70'/>

              <div className='py-8'>
                <img src={DashboardDisplay}/>
              </div>
            </div>
          </div>
        </div>
      );
    };
export default Register;