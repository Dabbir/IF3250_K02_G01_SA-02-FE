const NewsPublication = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Publikasi Berita</h2>
  
        <div className="flex justify-between items-center mb-4">
          <div className="text-left flex-1">
            <p className="text-gray-500 text-sm">Total Publikasi</p>
            <p className="text-xl font-bold text-black">18</p>
          </div>
  
          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-gray-500 text-sm">Total Media</p>
            <p className="text-xl font-bold text-black">31</p>
          </div>
  
          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-gray-500 text-sm">PR Value</p>
            <p className="text-xs font-bold text-black">
              Rp <span className="text-xl">678,87 Jt</span>
            </p>
          </div>
        </div>
  
        <div className="mt-4">
          <p className="text-gray-600 text-sm mb-1">Tone Publikasi</p>
  
          <div className="w-full h-2 rounded-full flex overflow-hidden">
            <div className="bg-[#6C9A8B]" style={{ width: "40%" }}></div>
            <div className="bg-[#9E9E9E]" style={{ width: "30%" }}></div>
            <div className="bg-[#CB5C5B]" style={{ width: "30%" }}></div>
          </div>
  
          <div className="flex justify-between mt-2">
            <span className="text-green-700 text-xl">😊</span>
            <span className="text-gray-600 text-xl">😐</span>
            <span className="text-red-600 text-xl">☹️</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default NewsPublication;  