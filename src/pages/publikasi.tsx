"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, Trash2, BookOpen, Share2, Download, Pencil, Loader2, Menu } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ChooseMethodPublication from "@/components/publikasi/choosemethodpublication";
import * as XLSX from "xlsx";

const API_URL = import.meta.env.VITE_HOST_NAME;

const SORTABLE_COLUMNS = ["judul", "tanggal", "link", "prValue", "tone"];

interface Publikasi {
  id: string;
  judul: string;
  media: "Televisi" | "Koran" | "Radio" | "Media Online" | "Sosial Media" | "Lainnya";
  perusahaan: string;
  tanggal: string;
  link: string;
  prValue: number;
  nama_program?: string;
  nama_aktivitas?: string;
  tone: "Positif" | "Netral" | "Negatif";
}

const formatRupiah = (value: number) => {
  const valueInt = Math.round(value);
  return `Rp${valueInt.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
};

const ITEMS_PER_PAGE = 20;

export default function PublikasiPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>([]);
  const [sortColumn, setSortColumn] = useState<string>("tanggal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const publikasiData = await fetchPublikasi();
      setPublikasiList(publikasiData);
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Gagal memuat data, silakan coba lagi");
    }
  };

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredPublikasi = publikasiList.filter((item) =>
    item.judul?.toLowerCase().includes(search.toLowerCase()) ?? false
  );

  const sortedPublikasi = [...filteredPublikasi].sort((a, b) => {
    let valueA = a[sortColumn as keyof Publikasi];
    let valueB = b[sortColumn as keyof Publikasi];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  const displayedPublikasi = sortedPublikasi.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPublikasi.length / ITEMS_PER_PAGE);

  const shareToWhatsApp = (item: Publikasi) => {
    const message = `Cek publikasi ini: ${item.judul} - ${item.link}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

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
      
      const toneList = [
        ["Tone yang dapat digunakan"], 
        ["Positif"], 
        ["Netral"], 
        ["Negatif"]
      ];
      const wsTone = XLSX.utils.aoa_to_sheet(toneList);
      
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
      ], {origin: "A25"});
  
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

  const [loading, setLoading] = useState(false);

  const fetchPublikasi = async (): Promise<Publikasi[]> => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/publikasi`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        const formattedData: Publikasi[] = data.map((item: {
          id?: string;
          judul_publikasi?: string;
          media_publikasi?: "Televisi" | "Koran" | "Radio" | "Media Online" | "Sosial Media" | "Lainnya";
          nama_perusahaan_media?: string;
          tanggal_publikasi?: string;
          url_publikasi?: string;
          pr_value?: number;
          nama_program?: string;
          nama_aktivitas?: string;
          tone?: "Positif" | "Netral" | "Negatif";
        }): Publikasi => ({
          id: item.id || "",
          judul: item.judul_publikasi || "",
          media: item.media_publikasi || "Media Online",
          perusahaan: item.nama_perusahaan_media || "",
          tanggal: item.tanggal_publikasi || "",
          link: item.url_publikasi || "",
          prValue: item.pr_value || 0,
          nama_program: item.nama_program || "",
          nama_aktivitas: item.nama_aktivitas || "",
          tone: item.tone || "Netral",
        }));
        return formattedData;
      } else {
        throw new Error(data.message || "Gagal mengambil publikasi.");
      }
    } catch (error) {
      console.error("Error fetching publikasi:", error);
      toast.error("Gagal memuat data publikasi");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // DELETE - Delete publication by ID
  const deletePublikasi = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Token tidak ditemukan, silakan login kembali");
        return false;
      }

      const response = await fetch(`${API_URL}/api/publikasi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus publikasi.");
      }

      return true;
    } catch (error) {
      console.error("Error deleting publikasi:", error);
      return false;
    }
  };

  const handleDeletePublikasi = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus publikasi ini?")) {
      const deleted = await deletePublikasi(id);
      if (deleted) {
        await refreshData();
        toast.success("Publikasi berhasil dihapus!");
      } else {
        toast.error("Gagal menghapus publikasi. Silakan coba lagi.");
      }
    }
  };

  const handleViewDetail = (id: string) => {
    navigate(`/publikasi/${id}`);
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "Positif":
        return "bg-green-100 text-green-800";
      case "Netral":
        return "bg-blue-100 text-blue-800";
      case "Negatif":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Mobile card component for each publikasi item
  const PublikasiCard = ({ item }: { item: Publikasi }) => (
    <div 
      className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleViewDetail(item.id)}
    >
      <h3 className="font-medium text-base mb-2 line-clamp-2">{item.judul}</h3>
      
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm mb-3">
        <div className="text-gray-500">Tanggal:</div>
        <div>{formatDate(item.tanggal)}</div>
        
        <div className="text-gray-500">PR Value:</div>
        <div>{formatRupiah(item.prValue)}</div>
        
        <div className="text-gray-500">Tone:</div>
        <div>
          <span className={`px-2 py-1 rounded-full text-xs ${getToneColor(item.tone)}`}>
            {item.tone}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 mb-2">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm truncate max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {item.link.length > 40 ? `${item.link.substring(0, 40)}...` : item.link}
        </a>
      </div>
      
      <div className="flex justify-end gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-blue-100 transition cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/publikasi/${item.id}`);
          }}
        >
          <Pencil className="h-4 w-4 text-blue-500" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-green-100 transition cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            shareToWhatsApp(item);
          }}
        >
          <Share2 className="w-4 h-4 text-green-500" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-red-100 transition cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleDeletePublikasi(item.id);
          }}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[70rem] p-3 md:p-6">
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader className="px-2 md:px-6">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Publikasi</h2>
        </div>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        {/* Mobile View: Search and Filter */}
        <div className="md:hidden mb-4">
          <div className="relative w-full mb-2">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Mobile Filter button */}
          <div className="flex mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Menu className="w-4 h-4 mr-2" /> 
              Filter
            </Button>
          </div>
          
          {/* Mobile Export and Add buttons - stacked vertically */}
          <div className="flex flex-col gap-2">
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full flex items-center justify-center gap-1"
              size="sm"
              onClick={exportToXlsx}
            >
              <Download className="h-4 w-4" />
              Unduh Publikasi
            </Button>
            
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full flex items-center justify-center"
              size="sm"
              onClick={() => setIsOpen(true)}
            >
              Tambah Publikasi
            </Button>
          </div>
          
          {isFilterOpen && (
            <div className="mt-2 p-3 border rounded-md bg-white shadow-sm space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs font-medium mb-1">Sort By</p>
                  <Select value={sortColumn} onValueChange={setSortColumn}>
                    <SelectTrigger className="text-sm h-8">
                      <SelectValue placeholder="Pilih Kolom" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORTABLE_COLUMNS.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col.charAt(0).toUpperCase() + col.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <p className="text-xs font-medium mb-1">Order</p>
                  <Button 
                    variant="outline" 
                    onClick={() => handleSortChange(sortColumn)}
                    className="flex items-center justify-center w-full h-8 text-sm"
                  >
                    <ArrowUpDown className="w-4 h-4 mr-1" /> 
                    {sortOrder === "asc" ? "Asc" : "Desc"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop View: Search and Filter */}
        <div className="hidden md:flex justify-between mb-4 items-center">
          <div className="flex relative w-3/5 gap-2">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Select value={sortColumn} onValueChange={setSortColumn}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Pilih Kolom" />
              </SelectTrigger>
              <SelectContent>
                {SORTABLE_COLUMNS.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => handleSortChange(sortColumn)} className="flex items-center">
              <ArrowUpDown className="w-4 h-4 mr-2" /> Sort
              {sortOrder === "asc" ? " Ascending" : " Descending"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center gap-1"
              onClick={exportToXlsx}
            >
              <Download className="h-4 w-4" />
              Unduh Publikasi
            </Button>

            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto"
              onClick={() => setIsOpen(true)}
            >
              Tambah Publikasi
            </Button>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden">
          {displayedPublikasi.length > 0 ? (
            displayedPublikasi.map((item, index) => (
              <PublikasiCard key={index} item={item} />
            ))
          ) : (
            <div className="text-center py-8 border rounded-lg">
              Tidak ada data publikasi
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Judul Publikasi</TableHead>
                <TableHead>Tanggal Publikasi</TableHead>
                <TableHead>Link Publikasi</TableHead>
                <TableHead>PR Value</TableHead>
                <TableHead>Tone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedPublikasi.length > 0 ? (
                displayedPublikasi.map((item, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleViewDetail(item.id)}
                  >
                    <TableCell className="font-medium">{item.judul}</TableCell>
                    <TableCell>{formatDate(item.tanggal)}</TableCell>
                    <TableCell>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.link.length > 25 ? `${item.link.substring(0, 25)}...` : item.link}
                      </a>
                    </TableCell>
                    <TableCell>{formatRupiah(item.prValue)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getToneColor(item.tone)}`}>
                        {item.tone}
                      </span>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-blue-100 transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/publikasi/${item.id}`);
                          }}
                        >
                          <Pencil className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-green-100 transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareToWhatsApp(item);
                          }}
                        >
                          <Share2 className="w-4 h-4 text-green-500 hover:text-green-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-100 transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePublikasi(item.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Tidak ada data publikasi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 0 && (
          <div className="flex justify-center mt-4 space-x-2 flex-wrap">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-[#3A786D] text-white"
              size="sm"
            >
              Previous
            </Button>
            
            {totalPages <= 5 ? (
              // Show all pages if there are 5 or fewer
              Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`${
                    currentPage === i + 1 
                      ? "bg-[#3A786D] text-white" 
                      : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                  }`}
                  size="sm"
                >
                  {i + 1}
                </Button>
              ))
            ) : (
              // Show first, current, and last page with ellipsis when appropriate
              <>
                <Button
                  onClick={() => setCurrentPage(1)}
                  className={`${
                    currentPage === 1 
                      ? "bg-[#3A786D] text-white" 
                      : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                  }`}
                  size="sm"
                >
                  1
                </Button>
                
                {currentPage > 3 && <span className="px-2">...</span>}
                
                {currentPage > 2 && currentPage < totalPages && (
                  <Button
                    onClick={() => setCurrentPage(currentPage)}
                    className="bg-[#3A786D] text-white"
                    size="sm"
                  >
                    {currentPage}
                  </Button>
                )}
                
                {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                
                <Button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`${
                    currentPage === totalPages 
                      ? "bg-[#3A786D] text-white" 
                      : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                  }`}
                  size="sm"
                >
                  {totalPages}
                </Button>
              </>
            )}
            
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-[#3A786D] text-white"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}

        <ChooseMethodPublication
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onRefreshData={refreshData}
        />
      </CardContent>
    </Card>
  );
}