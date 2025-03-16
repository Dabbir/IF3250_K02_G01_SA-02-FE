import { FileText } from 'lucide-react';
import DashboardDisplay from "@/assets/dashboard-display.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_HOST_NAME;

const RegisterDataDiri = () => {
    const navigate = useNavigate();
    const [nama_masjid, setAsalMasjid] = useState("");
    const [alasan_bergabung, setAlasanBergabung] = useState("");
    const [short_bio, setBio] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const registerData = localStorage.getItem("registerData");
        if (!registerData) {
            toast.error("Silakan isi formulir pertama terlebih dahulu.");
            navigate("/register");
            return;
        }
    
        const { email, password } = JSON.parse(registerData);
        const finalData = {
            email,
            password,
            nama: `${firstName} ${lastName}`,
            nama_masjid,
            alasan_bergabung,
            short_bio
        };
    
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(finalData),
            });
    
            if (response.ok) {
                toast.success("Registrasi berhasil!");
                navigate("/wait-verification");
            } else {
                toast.error("Registrasi gagal. Silakan coba lagi.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan. Coba lagi nanti.");
        }
    };  

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white" >
          <div className="w-1/2 z-10 flex flex-col justify-start p-12 overflow-y-auto no-scrollbar">
            <div className="max-w-[430px] w-full self-center">
            <h1 className="text-[48px] font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-8">Data Diri</h1>
            
            <form onSubmit={handleRegister} className="">
                <div className="flex flex-col md:flex-row md:justify-between ">
                    <div className="mb-4">
                        <label className="block text-sm font-cooper mb-2">Nama Depan</label>
                        <input 
                        type="text" 
                        placeholder="Masukkan nama depan" 
                        className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        />
                    </div>
                    <div className="mb-4">
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
                    <label className="block text-sm font-cooper mb-2">Asal Masjid</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan alamat email Anda" 
                      className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={nama_masjid}
                      onChange={(e) => setAsalMasjid(e.target.value)}
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-cooper mb-2">Alasan Bergabung</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan kata sandi Anda" 
                      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={alasan_bergabung}
                      onChange={(e) => setAlasanBergabung(e.target.value)}
                      required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-cooper mb-2">Bio</label>
                    <input 
                      type="textarea" 
                      placeholder="Masukkan kata sandi Anda" 
                      className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={short_bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-cooper">Unggah Bukti Keanggotaan</label>
                    <p className='text-sm text-[#9E9E9E] py-2 font-cooper'>Lampirkan bukti keanggotaan dengan mengunggah surat keterangan aktif DKM  terkait atau bukti keanggotaan lainnya</p>
                    <div className="flex flex-col py-4 items-center justify-center w-full border gap-3 border-gray-300 rounded p-3 hover:bg-gray-100 cursor-pointer">
                        <FileText className="text-[#9E9E9E] mr-2 w-14 h-14" />
                        <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer text-[#9E9E9E]">
                        Dokumen PDF (maksimal 10 MB)
                        </label>
                    </div>
                </div>
                
                <Button className="w-full bg-teal-700 hover:bg-teal-800 text-[#FBFAF8] py-2 rounded-md transition-colors">
                    Daftar
                </Button>
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
export default RegisterDataDiri;