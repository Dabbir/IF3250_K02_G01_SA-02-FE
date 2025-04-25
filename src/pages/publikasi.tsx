"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, Trash2, BookOpen, Share2, Download, Pencil, Loader2, Menu, Filter } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ChooseMethodPublication from "@/components/publikasi/choosemethodpublication";
import * as XLSX from "xlsx";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const API_URL = import.meta.env.VITE_HOST_NAME;

const TONE_OPTIONS = ["Positif", "Netral", "Negatif"];

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
  return valueInt.toLocaleString("id-ID", { maximumFractionDigits: 0 });
};

const ITEMS_PER_PAGE = 20;

export default function PublikasiPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
  // Sort states
  const [sortColumn, setSortColumn] = useState<string>("tanggal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Filter states
  const [toneFilters, setToneFilters] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const publikasiData = await fetchPublikasi();
      setPublikasiList(publikasiData);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
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

  const toggleToneFilter = (tone: string) => {
    setToneFilters(prev => {
      if (prev.includes(tone)) {
        return prev.filter(t => t !== tone);
      } else {
        return [...prev, tone];
      }
    });
    setCurrentPage(1);
  };

  // Filter publikasi by search and tone
  const filteredPublikasi = publikasiList.filter((item) => {
    const matchesSearch = item.judul?.toLowerCase().includes(search.toLowerCase()) ?? false;
    const matchesTone = toneFilters.length === 0 || toneFilters.includes(item.tone);
    
    return matchesSearch && matchesTone;
  });

  // Sort the filtered publikasi
  const sortedPublikasi = [...filteredPublikasi].sort((a, b) => {
    let valueA = a[sortColumn as keyof Publikasi];
    let valueB = b[sortColumn as keyof Publikasi];

    // Handle date sorting
    if (sortColumn === "tanggal") {
      const dateA = new Date(valueA as string).getTime();
      const dateB = new Date(valueB as string).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Handle string sorting
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Handle number sorting
    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  // Apply pagination to sorted publikasi
  const displayedPublikasi = sortedPublikasi.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPublikasi.length / ITEMS_PER_PAGE);

  const shareToWhatsApp = (item: Publikasi) => {
    event?.stopPropagation();
    
    const formattedDate = formatDisplayDate(item.tanggal);
    
    const shareText = `*Detail Publikasi*\n\n` +
      `*Judul:* ${item.judul}\n` +
      `*Media:* ${item.media}\n` +
      `*Perusahaan:* ${item.perusahaan}\n` +
      `*Tanggal:* ${formattedDate}\n` +
      `*PR Value:* Rp${formatRupiah(item.prValue)}\n` +
      `*Tone:* ${item.tone}\n` +
      `*Link:* ${item.link}\n` +
      (item.nama_program ? `*Program:* ${item.nama_program}\n` : '') +
      (item.nama_aktivitas ? `*Aktivitas:* ${item.nama_aktivitas}\n` : '');

    const encodedText = encodeURIComponent(shareText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
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

  const getToneBadge = (tone: string) => {
    let color = "";
  
    switch (tone) {
      case "Positif":
        color = "bg-emerald-50 text-emerald-700 border border-emerald-200";
        break;
      case "Netral":
        color = "bg-blue-50 text-blue-700 border border-blue-200";
        break;
      case "Negatif":
        color = "bg-red-50 text-red-700 border border-red-200";
        break;
      default:
        color = "bg-gray-100 text-gray-700 border border-gray-200";
    }
  
    return (
      <Badge className={`px-3 py-1 text-xs font-medium rounded-md min-w-[90px] text-center ${color}`}>
        {tone}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
        <CardContent className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#3A786D] text-white"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
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

            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="max-md:h-8 flex items-center gap-1 md:w-auto">
                  <Filter className="h-3 w-3 md:-h4 md:w-4" />
                  <span className="max-md:text-[12px]">Filter Tone</span>
                  {toneFilters.length > 0 && (
                    <Badge className="ml-1 bg-[#3A786D]">{toneFilters.length}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4">
                <h4 className="text-[12px] font-medium mb-3">Filter berdasarkan tone</h4>
                <div className="space-y-2">
                  {TONE_OPTIONS.map((tone) => (
                    <div key={tone} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tone-${tone}`}
                        checked={toneFilters.includes(tone)}
                        onCheckedChange={() => toggleToneFilter(tone)}
                      />
                      <Label htmlFor={`tone-${tone}`} className="flex items-center">
                        {getToneBadge(tone)}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setToneFilters([])}
                    disabled={toneFilters.length === 0}
                    className="text-[12px]"
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setFilterOpen(false)}
                    className="bg-[#3A786D] text-[12px]"
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* Export Button */}
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center justify-center gap-1"
              onClick={exportToXlsx}
            >
              <Download className="h-4 w-4" />
              Unduh Publikasi
            </Button>

            {/* Add Publikasi Button */}
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              Tambah Publikasi
            </Button>
          </div>
        </div>

        {filteredPublikasi.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No publications found</p>
            {(toneFilters.length > 0 || search) && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setToneFilters([]);
                    setSearch("");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        ) : isMobileView ? (
          // Mobile card view
          <div className="space-y-4">
            {displayedPublikasi.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 space-y-3 bg-white"
                onClick={() => navigate(`/publikasi/${item.id}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-[var(--blue)] truncate pr-2">{item.judul}</h3>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Menu className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-auto max-h-[30vh] rounded-t-xl">
                      <div className="grid gap-4 py-4">
                        <Button
                          className="w-full flex justify-start items-center space-x-2 bg-transparent text-blue-500 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/publikasi/${item.id}`);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Edit Publikasi</span>
                        </Button>
                        <Button
                          className="w-full flex justify-start items-center space-x-2 bg-transparent text-green-500 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareToWhatsApp(item);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Bagikan ke WhatsApp</span>
                        </Button>
                        <Button
                          className="w-full flex justify-start items-center space-x-2 bg-transparent text-red-500 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePublikasi(item.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Hapus Publikasi</span>
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-4">
                    <div>
                      <span className="block text-gray-500 text-xs">Tanggal</span>
                      <span className="text-[12px]">
                        {formatDisplayDate(item.tanggal)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs">Tone</span>
                      {getToneBadge(item.tone)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="block text-gray-500 text-xs">Media</span>
                      <span className="text-[12px]">
                        {item.media}
                      </span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs">PR Value</span>
                      <span className="font-medium">Rp{formatRupiah(item.prValue)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="block text-gray-500 text-xs">Link</span>
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm truncate block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.link.length > 40 ? `${item.link.substring(0, 40)}...` : item.link}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop table view
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead 
                    className="pl-7 w-[200px] cursor-pointer"
                    onClick={() => handleSortChange("judul")}
                  >
                    <div className="flex items-center">
                      Judul Publikasi
                      {sortColumn === "judul" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[120px] text-center cursor-pointer"
                    onClick={() => handleSortChange("tanggal")}
                  >
                    <div className="flex items-center justify-center">
                      Tanggal
                      {sortColumn === "tanggal" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[180px]">
                    <div className="flex items-center">
                      Link
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[150px] cursor-pointer"
                    onClick={() => handleSortChange("prValue")}
                  >
                    <div className="flex items-center">
                      PR Value
                      {sortColumn === "prValue" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="w-[120px] text-center cursor-pointer"
                    onClick={() => handleSortChange("tone")}
                  >
                    <div className="flex items-center justify-center">
                      Tone
                      {sortColumn === "tone" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[140px] text-right pr-9">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {displayedPublikasi.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => {
                      navigate(`/publikasi/${item.id}`);
                    }}
                  >
                    <TableCell className="pl-7 truncate max-w-[180px]">{item.judul}</TableCell>
                    <TableCell className="text-center truncate">
                      {formatDisplayDate(item.tanggal)}
                    </TableCell>
                    <TableCell className="truncate max-w-[180px]">
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
                    <TableCell className="text-left truncate max-w-[180px]">
                      Rp{formatRupiah(item.prValue)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getToneBadge(item.tone)}
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-200 transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/publikasi/${item.id}`);
                          }}
                        >
                          <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
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
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm ${currentPage === i + 1
                  ? "bg-[#3A786D] text-white"
                  : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                  }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
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