import { FileText, ChevronDown, ChevronUp, Search } from 'lucide-react';
import DashboardDisplay from "@/assets/dashboard-display.png";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface Masjid {
  id: number;
  nama_masjid: string;
  alamat?: string;
}

const RegisterDataDiri = () => {
    const navigate = useNavigate();
    const [masjidId, setMasjidId] = useState<number | null>(null);
    const [nama_masjid, setNamaMasjid] = useState("");
    const [alasan_bergabung, setAlasanBergabung] = useState("");
    const [short_bio, setBio] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [masjidList, setMasjidList] = useState<Masjid[]>([]);
    const [filteredMasjidList, setFilteredMasjidList] = useState<Masjid[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const location = useLocation();
    const userId = location.state?.userId;

    useEffect(() => {
        const fetchMasjids = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/masjid`);
                if (!response.ok) {
                    throw new Error('Failed to fetch masjid data');
                }
                const data = await response.json();
                if (data.success && Array.isArray(data.data)) {
                    setMasjidList(data.data);
                    setFilteredMasjidList(data.data);
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                console.error('Error fetching masjid data:', error);
                toast.error('Gagal mengambil data masjid');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMasjids();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredMasjidList(masjidList);
        } else {
            const filtered = masjidList.filter(masjid => 
                masjid.nama_masjid.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredMasjidList(filtered);
        }
    }, [searchTerm, masjidList]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    
    const handleMasjidSelect = (masjid: Masjid) => {
        setMasjidId(masjid.id);
        setNamaMasjid(masjid.nama_masjid);
        setIsDropdownOpen(false);
        setSearchTerm("");
    };
    
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!nama_masjid) {
            toast.error("Silakan pilih masjid.");
            return;
        }
        
        if (alasan_bergabung.length < 8) {
            toast.error("Alasan bergabung harus lebih dari 8 karakter.");
            return;
        }

        try {

            if (localStorage.getItem('token')) {
                localStorage.removeItem('token');
                console.log('Token lama berhasil dihapus dari localStorage');
            }
            
            const response = await fetch(`${API_URL}/api/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    masjid_id: masjidId,
                    alasan_bergabung,
                    short_bio
                }),
            });
    
            if (response.ok) {
                toast.success("Registrasi berhasil!");
                navigate("/wait-verification");
            } else {
                const data = await response.json();
                toast.error(data.message || "Registrasi gagal. Silakan coba lagi.");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan. Coba lagi nanti.");
        }
    };  

    return (
        <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-white min-h-screen">
            <div className="w-full md:w-1/2 z-10 flex flex-col justify-start p-4 md:p-8 lg:p-12 order-2 md:order-1 overflow-y-auto no-scrollbar bg-gradient-to-br from-white to-gray-50">
                <div className="max-w-[430px] w-full mx-auto md:mx-0 md:ml-auto md:mr-12 lg:mr-24">
                    <h1 className="text-3xl md:text-4xl lg:text-[48px] font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-4 md:mb-8 animate-[fade-in-up_0.6s_ease-out_forwards]">
                        Data Diri
                    </h1>
                    
                    <form onSubmit={handleRegister} className="w-full animate-[fade-in-up_0.6s_ease-out_forwards_200ms]">
                        <div className="mb-4">
                            <label className="block text-sm font-cooper mb-2 text-gray-700">Asal Masjid</label>
                            <div className="relative" ref={dropdownRef}>
                                <div 
                                    className="flex items-center justify-between font-cooper w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-400 cursor-pointer"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span className={nama_masjid ? "text-black" : "text-gray-400"}>
                                        {nama_masjid || "Pilih Masjid"}
                                    </span>
                                    {isDropdownOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                                </div>
                                
                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                                        <div className="p-2 sticky top-0 bg-white border-b">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    placeholder="Cari masjid..."
                                                    className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="overflow-y-auto max-h-52">
                                            {isLoading ? (
                                                <div className="p-4 text-center text-gray-500">Memuat data masjid...</div>
                                            ) : filteredMasjidList.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500">Tidak ada masjid yang ditemukan</div>
                                            ) : (
                                                filteredMasjidList.map((masjid) => (
                                                    <div
                                                        key={masjid.id}
                                                        className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors"
                                                        onClick={() => handleMasjidSelect(masjid)}
                                                    >
                                                        <div className="font-medium text-gray-900">{masjid.nama_masjid}</div>
                                                        {masjid.alamat && (
                                                            <div className="text-sm text-gray-500">{masjid.alamat}</div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-cooper mb-2 text-gray-700">Alasan Bergabung</label>
                            <textarea 
                                placeholder="Masukkan alasan bergabung" 
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-400 resize-none h-24"
                                value={alasan_bergabung}
                                onChange={(e) => setAlasanBergabung(e.target.value)}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-cooper mb-2 text-gray-700">Bio</label>
                            <textarea 
                                placeholder="Masukkan bio Anda" 
                                className="font-cooper w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 hover:border-teal-400 resize-none h-24"
                                value={short_bio}
                                onChange={(e) => setBio(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-cooper text-gray-700">Unggah Bukti Keanggotaan</label>
                            <p className='text-sm text-[#9E9E9E] py-2 font-cooper'>Lampirkan bukti keanggotaan dengan mengunggah surat keterangan aktif DKM terkait atau bukti keanggotaan lainnya</p>
                            <div 
                                className="flex flex-col py-6 items-center justify-center w-full border-2 border-dashed gap-3 border-gray-300 rounded-lg p-3 hover:bg-teal-50 hover:border-teal-300 cursor-pointer transition-all duration-200 group"
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                <FileText className="text-[#9E9E9E] w-10 h-10 md:w-14 md:h-14 group-hover:text-teal-600 transition-colors" />
                                <input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer text-[#9E9E9E] text-center group-hover:text-teal-600 transition-colors">
                                    {selectedFile ? 
                                        <span className="text-teal-600 font-medium">{selectedFile.name}</span> : 
                                        "Dokumen PDF (maksimal 10 MB)"
                                    }
                                </label>
                            </div>
                        </div>
                        
                        <Button 
                            type="submit"
                            className="w-full text-white py-3 rounded-lg transition-all duration-300 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 transform hover:scale-[1.02] hover:shadow-lg h-11 mb-8 md:mb-0"
                        >
                            Daftar
                        </Button>
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

export default RegisterDataDiri;