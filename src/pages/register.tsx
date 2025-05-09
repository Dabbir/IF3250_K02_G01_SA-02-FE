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
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");           
    const [confirmPasswordError, setconfirmPasswordError] = useState("");           
    const [lastnameError, setLastnameError] = useState("");
    const [firstnameError, setfirstnameError] = useState("");


    const validateEmail = (email: string) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
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
      if (!confirmPassword.trim()) {
        setconfirmPasswordError("Konfirmasi kata sandi wajib diisi.");
        isValid = false;
      } else {
        setconfirmPasswordError("");
      }
      if (!firstName.trim()) {
        setfirstnameError("Nama Depan wajib diisi.");
        isValid = false;
      } else {
        setfirstnameError("");
      }
      if (!lastName.trim()) {
        setLastnameError("Nama Belakang wajib diisi.");
        isValid = false;
      } else {
        setLastnameError("");
      }
  
      if (!isValid) return;

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
          {/* Left Side - Form */}
          <div className="w-full md:w-1/2 z-10 flex flex-col justify-start p-4 md:p-8 lg:p-12 order-2 md:order-1 overflow-y-auto no-scrollbar bg-gradient-to-br from-white to-gray-50">
            <div className="max-w-[430px] w-full mx-auto md:mx-0 md:ml-auto md:mr-12 lg:mr-24">
              <h1 className="text-3xl md:text-4xl lg:text-[48px] font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-6 md:mb-8 animate-[fade-in-up_0.6s_ease-out_forwards]">
                Daftar
              </h1>
              
              <form onSubmit={handleNext} className="w-full animate-[fade-in-up_0.6s_ease-out_forwards_200ms]">
                <div className="flex flex-col md:flex-row md:gap-4 mb-4">
                  <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <label className="block text-sm font-cooper mb-2 text-gray-700">Nama Depan</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama depan" 
                      className={`w-full p-3 border ${firstnameError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-400 pr-10`}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setfirstnameError("");
                      }}
                    />
                    {firstnameError && <p className="text-red-500 text-sm mt-1">{firstnameError}</p>}
                  </div>
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-cooper mb-2 text-gray-700">Nama Belakang</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama belakang" 
                      className={`w-full p-3 border ${lastnameError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-400 pr-10`}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setLastnameError("");
                      }}
                    />
                    {lastnameError && <p className="text-red-500 text-sm mt-1">{lastnameError}</p>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-cooper mb-2 text-gray-700">Alamat Email</label>
                  <input
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
                
                <div className="mb-4">
                  <label className="block text-sm font-cooper mb-2 text-gray-700">Kata Sandi</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi Anda" 
                      className={`w-full p-3 border ${passwordError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-400 pr-10`}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="mb-4">
                  <label className="block text-sm font-cooper mb-2 text-gray-700">Konfirmasi Kata Sandi</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Konfirmasi kata sandi Anda" 
                      className={`w-full p-3 border ${confirmPasswordError ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-400 pr-10`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center group">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mr-2 h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition-all"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer select-none group-hover:text-gray-700 transition-colors">
                      Saya menyetujui Syarat & Ketentuan aplikasi
                    </label>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2 animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]">{error}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full text-white py-3 rounded-lg transition-all duration-300 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  Lanjut
                </button>
                
                <div className="flex items-center my-6 animate-[fade-in-up_0.6s_ease-out_forwards_400ms]">
                  <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#3A786D] to-transparent"></div>
                  <div className="mx-4 text-[#3A786D] font-medium">ATAU</div>
                  <div className="flex-grow h-px bg-gradient-to-r from-transparent via-[#3A786D] to-transparent"></div>
                </div>
                
                <button 
                  onClick={handleGoogleSignup}
                  type="button" 
                  className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md animate-[fade-in-up_0.6s_ease-out_forwards_600ms]"
                >
                  <img src={Google} alt="Google Logo" className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="ml-2 text-sm md:text-base font-medium text-gray-700">Lanjut dengan Akun Google</span>
                </button>
                
                <div className="text-center mt-6 mb-8 md:mb-0 animate-[fade-in-up_0.6s_ease-out_forwards_800ms]">
                  <span className="text-sm font-cooper text-gray-600">Sudah memiliki akun? </span>
                  <a href="/login" className="text-sm text-teal-700 hover:text-teal-800 hover:underline font-medium transition-colors">
                    Masuk Di Sini
                  </a>
                </div>
              </form>
            </div>
          </div>
          
          <div className="relative w-full md:w-1/2 h-40 md:h-full order-1 md:order-2 overflow-hidden">
            <div 
              className="absolute top-0 bottom-0 left-0 w-24 bg-white hidden md:block shadow-2xl"
              style={{
                transform: 'skewX(-6deg) translateX(-50%)',
                zIndex: 5,
                height: '100vh'
              }}
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
                  className="max-w-full drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
    );
};

export default Register;