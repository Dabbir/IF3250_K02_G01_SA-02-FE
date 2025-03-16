import DashboardDisplay from "@/assets/dashboard-display.png";
import Google from "@/assets/Google.svg"

const Register = () => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white" >
          {/*Left Side*/}
          <div className="w-1/2 z-10 flex flex-col justify-center p-12">
            <div className="max-w-[430px] w-full self-center">
            <h1 className="text-[48px] font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-8">Daftar</h1>
            
            <form className="">
              <div className="mb-4">
                <label className="block text-sm font-cooper mb-2">Alamat Email</label>
                <input 
                  type="email" 
                  placeholder="Masukkan alamat email Anda" 
                  className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-cooper mb-2">Kata Sandi</label>
                <input 
                  type="password" 
                  placeholder="Masukkan kata sandi Anda" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-cooper mb-2">Konfirmasi Kata Sandi</label>
                <input 
                  type="email" 
                  placeholder="Masukkan kata sandi Anda" 
                  className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              
              <div className="flex items-center mb-6">
                <input type="checkbox" id="terms" className="mr-2" />
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