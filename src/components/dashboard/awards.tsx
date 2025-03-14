const Awards = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-xl">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Awards</h2>
  
        <div className="flex justify-between items-center mb-4">
          <div className="text-left flex-1">
            <p className="text-gray-500 text-sm">Total Award</p>
            <p className="text-xl font-bold text-black">45</p>
          </div>
  
          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-gray-500 text-sm">Internasional</p>
            <p className="text-xl font-bold text-black">8</p>
          </div>

          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-gray-500 text-sm">Nasional</p>
            <p className="text-xl font-bold text-black">29</p>
          </div>

          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-gray-500 text-sm">Regional</p>
            <p className="text-xl font-bold text-black">8</p>
          </div>
          
        </div>
      </div>
    );
  };
  
  export default Awards;  