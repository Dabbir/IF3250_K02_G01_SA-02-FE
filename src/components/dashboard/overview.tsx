import React from "react";

const DashboardOverview: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border w-full max-w-md">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Cakupan Geografis</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="text-left flex-1">
            <p className="text-gray-500 text-xs">Provinsi</p>
            <p className="text-xl font-bold text-black">18</p>
          </div>
  
          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-gray-500 text-xs">Kota</p>
            <p className="text-xl font-bold text-black">31</p>
          </div>

          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-gray-500 text-xs">Desa</p>
            <p className="text-xl font-bold text-black">172</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700">Overview Program</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="text-left flex-1">
            <p className="text-gray-500 text-xs">Jumlah Program</p>
            <p className="text-xl font-bold text-black">16</p>
          </div>
  
          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-gray-500 text-xs">Program Berjalan</p>
            <p className="text-xl font-bold text-black">12</p>
          </div>

          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-gray-500 text-xs">Program Selesai</p>
            <p className="text-xl font-bold text-black">18</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700">Overview Kegiatan</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="text-left flex-1">
            <p className="text-xs text-gray-500">Jumlah Kegiatan</p>
            <p className="text-xl font-bold">78</p>
          </div>
  
          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-xs text-gray-500">Kegiatan Berjalan</p>
            <p className="text-xl font-bold">41</p>
          </div>

          <div className="w-[2px] h-10 bg-black mx-4"></div>
  
          <div className="text-left flex-1">
            <p className="text-xs text-gray-500">Realisasi Anggaran</p>
            <p className="text-2xl font-bold">
              <span className="text-base">Rp</span> <span className="text-2xl">5,98 M</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;