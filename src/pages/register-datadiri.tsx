import { FileText } from 'lucide-react';

const RegisterDataDiri = () => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white" >
          {/* Left Side - Register Data Diri */}
          <div className="w-1/2 z-10 flex flex-col justify-start p-12 overflow-y-auto no-scrollbar">
            <div className="max-w-[430px] w-full self-center">
            <h1 className="text-[48px] font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-8">Data Diri</h1>
            
            <form className="">
                <div className="flex flex-col md:flex-row md:justify-between ">
                    <div className="mb-4">
                        <label className="block text-sm font-cooper mb-2">Nama Depan</label>
                        <input 
                        type="email" 
                        placeholder="Masukkan nama depan" 
                        className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-cooper mb-2">Nama Belakang</label>
                        <input 
                        type="email" 
                        placeholder="Masukkan nama belakang" 
                        className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-cooper mb-2">Asal Masjid</label>
                    <input 
                    type="email" 
                    placeholder="Masukkan alamat email Anda" 
                    className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-cooper mb-2">Alasan Bergabung</label>
                    <input 
                    type="password" 
                    placeholder="Masukkan kata sandi Anda" 
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-cooper mb-2">Bio</label>
                    <input 
                    type="email" 
                    placeholder="Masukkan kata sandi Anda" 
                    className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
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
                
                <button className="w-full btn-[#3A786D] hover:btn-black text-white py-2 rounded-md transition-colors">
                    Daftar
                </button>
            </form>
            </div>
          </div>
          
          {/* Right Side - Dashboard Preview */}
          <div className="relative w-1/2 h-full">
            {/* Angled divider */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-24 bg-white" 
              style={{
                transform: 'skewX(-6deg) translateX(-50%)',
                zIndex: 5,
                height: '100%'
              }}
            ></div>
            
            {/* Content area */}
            <div className="h-full w-full bg-[#E7DECD] flex flex-col items-center justify-start pt-12 px-8">
            </div>
          </div>
        </div>
      );
    };
export default RegisterDataDiri;