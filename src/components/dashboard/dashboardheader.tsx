const DashboardHeader = () => {
    return (
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-sm">
            <span className="text-gray-500">Home</span>
            <span className="text-gray-700"> / Dashboard</span>
          </p>
        </div>
  
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600 text-right text-bold">Jun 2022 - Jun 2023</span>
            <span className="text-xs text-gray-500">Last Refresh: 17 Jun 2023 08:42:16</span>
          </div>
  
          <div className="h-10 w-px bg-black mx-2"></div>
  
          <button className="bg-gray-100 px-3 py-2 rounded-md font-medium flex items-center">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="6" y1="12" x2="18" y2="12" />
              <line x1="8" y1="18" x2="16" y2="18" />
            </svg>
            Filter Data
          </button>
        </div>
      </div>
    );
  };
  
  export default DashboardHeader;  