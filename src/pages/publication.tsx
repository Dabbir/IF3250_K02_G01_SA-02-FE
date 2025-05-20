"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, BookOpen, Download, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import ChooseMethodPublication from "@/components/publication/choosemethodpublication";
import usePublication from "@/hooks/use-publication";
import useResponsive from "@/hooks/use-responsive";
import ErrorState from "@/components/error/error";
import Pagination from "@/components/pagination/pagination";
import FilterPublication from "@/components/publication/filterpublication";
import MobilePublicationCard from "@/components/publication/mobilepublicationcard";
import PublicationTable from "@/components/publication/publicationtable";

export default function PublikasiPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobileView } = useResponsive();

  const {
    loading,
    error,
    search,
    setSearch,
    publikasiList,
    pagination,
    currentPage,
    setCurrentPage,
    sortColumn,
    handleSortChange,
    
    // Filters
    toneFilters,
    toggleToneFilter,
    mediaFilters,
    setMediaFilters,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    prValueMin,
    setPrValueMin,
    prValueMax,
    setPrValueMax,
    filterOptions,
    filterOpen,
    setFilterOpen,
    clearAllFilters,
    
    // Actions
    handleSharePublication,
    handleDeletePublication,
    handleNavigate,
    refreshData,
  } = usePublication();

  const exportToXlsx = () => {
    if (publikasiList.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    try {
      const worksheetData = [
        ["judul_publikasi", "media_publikasi", "nama_perusahaan_media", "tanggal_publikasi", "url_publikasi", "pr_value", "nama_program", "nama_aktivitas", "tone"],
        ["(HAPUS TEKS INI) IKUTI PANDUAN PENGISIAN PADA SHEETS '(PENTING!) Panduan Unggah' DAN '(PENTING!) Media & Tone'"]
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      const columnWidths = [
        { wch: 30 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 30 },
        { wch: 15 },
        { wch: 20 },
        { wch: 20 },
        { wch: 10 }
      ];
      worksheet['!cols'] = columnWidths;

      const mediaList = [
        ["Media yang dapat digunakan"],
        ["Televisi"],
        ["Koran"],
        ["Radio"],
        ["Media Online"],
        ["Sosial Media"],
        ["Lainnya"]
      ];
      const wsMedia = XLSX.utils.aoa_to_sheet(mediaList);

      const guidanceSheet = XLSX.utils.aoa_to_sheet([
        ["Panduan Pengisian Data Publikasi dengan Mekanisme Unggah File"],
        [""],
        ["[1] Isi setiap kolom sesuai dengan kategori yang tertera. Perhatikan format pengisian data untuk setiap kolom sebagai berikut:"],
        ["judul_publikasi : TEXT bebas (WAJIB)"],
        ["media_publikasi : Pilih salah satu pilihan pada sheet '(PENTING!) Media & Tone' (WAJIB)"],
        ["nama_perusahaan_media : TEXT bebas (WAJIB)"],
        ["tanggal_publikasi : Format YYYY-MM-DD (WAJIB)"],
        ["url_publikasi : TEXT url lengkap (WAJIB)"],
        ["pr_value : ANGKA positif (WAJIB)"],
        ["nama_program : TEXT bebas"],
        ["nama_aktivitas : TEXT bebas"],
        ["tone : Pilih salah satu pilihan pada sheet '(PENTING!) Media & Tone' (WAJIB)"],
        [""],
        ["[2] Hanya melakukan perubahan di sheet 'Template Publikasi' tanpa mengubah sheet lainnya"],
        [""],
        ["[3] Tidak diperbolehkan untuk memindah-mindahkan posisi sheet"],
        [""],
        ["[4] Simpan file dalam format xlsx atau xls dengan nama bebas"],
        [""],
        ["[5] Unggah file xlsx atau xls pada tombol 'Upload Data' di halaman Publikasi"],
        [""],
        ["[CONTOH]"]
      ]);

      XLSX.utils.sheet_add_aoa(guidanceSheet, [
        ["judul_publikasi", "media_publikasi", "nama_perusahaan_media", "tanggal_publikasi", "url_publikasi", "pr_value", "nama_program", "nama_aktivitas", "tone"],
        ["Peluncuran Program Kebersihan Masjid", "Media Online", "Republika Online", "2025-03-15", "https://republika.co.id/berita/123456", "5000000", "Program Kebersihan", "Bersih-bersih Masjid", "Positif"],
        ["Liputan Kegiatan Bakti Sosial", "Televisi", "Metro TV", "2025-03-20", "https://metrotv.com/watch/123456", "7500000", "Bakti Sosial", "Pembagian Sembako", "Positif"]
      ], { origin: "A25" });

      worksheet["!dataValidation"] = [
        {
          sqref: "B2:B100",
          type: "list",
          formula1: "'(PENTING!) Media & Tone'!A2:A8",
          showDropDown: true,
        },
        {
          sqref: "I2:I100",
          type: "list",
          formula1: "'(PENTING!) Media & Tone'!A10:A12",
          showDropDown: true,
        }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template Publikasi");
      XLSX.utils.book_append_sheet(workbook, guidanceSheet, "(PENTING!) Panduan Unggah");
      XLSX.utils.book_append_sheet(workbook, wsMedia, "(PENTING!) Media & Tone");

      XLSX.writeFile(workbook, "Template_Publikasi.xlsx");
      toast.success("Berhasil mengunduh template publikasi");
    } catch (error) {
      console.error("Error exporting template:", error);
      toast.error("Gagal mengunduh template publikasi");
    }
  };

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Publikasi"
        Icon={BookOpen}
      />
    );
  }

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Publikasi</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 md:items-center">
          <div className="flex flex-col md:flex-row w-full md:w-2/3 gap-2">
            <div className="relative flex-grow items-top">
              <Search className="absolute left-3 top-2.5 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 max-md:h-8 max-md:text-[12px]"
              />
            </div>

            <FilterPublication
              open={filterOpen}
              onOpenChange={setFilterOpen}
              toneFilters={toneFilters}
              onToggleToneFilter={toggleToneFilter}
              mediaFilters={mediaFilters}
              onMediaFiltersChange={setMediaFilters}
              dateFrom={dateFrom}
              onDateFromChange={setDateFrom}
              dateTo={dateTo}
              onDateToChange={setDateTo}
              prValueMin={prValueMin}
              onPrValueMinChange={setPrValueMin}
              prValueMax={prValueMax}
              onPrValueMaxChange={setPrValueMax}
              filterOptions={filterOptions}
              onClearFilters={clearAllFilters}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center justify-center gap-1"
              onClick={exportToXlsx}
            >
              <Download className="h-4 w-4" />
              Unduh Publikasi
            </Button>

            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              Tambah Publikasi
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
          </div>
        ) : publikasiList.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No publications found</p>
            {(toneFilters.length > 0 || search || mediaFilters.length > 0 || dateFrom || dateTo || prValueMin !== undefined || prValueMax !== undefined) && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        ) : isMobileView ? (
          <div className="space-y-4">
            {publikasiList.map((item) => (
              <MobilePublicationCard
                key={item.id}
                item={item}
                onNavigate={handleNavigate}
                onShare={handleSharePublication}
                onDelete={handleDeletePublication}
              />
            ))}
          </div>
        ) : (
          <PublicationTable
            publikasiList={publikasiList}
            loading={loading}
            sortColumn={sortColumn}
            onSortChange={handleSortChange}
            onNavigate={handleNavigate}
            onShare={handleSharePublication}
            onDelete={handleDeletePublication}
          />
        )}

        <Pagination 
          currentPage={currentPage} 
          totalPages={pagination.totalPages} 
          onPageChange={setCurrentPage} 
        />

        <ChooseMethodPublication
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onRefreshData={refreshData}
        />
      </CardContent>
    </Card>
  );
}