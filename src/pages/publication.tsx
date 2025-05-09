"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, Trash2, BookOpen, Share2, Download, Pencil, Loader2, Menu, Filter, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ChooseMethodPublication from "@/components/publikasi/choosemethodpublication";
import * as XLSX from "xlsx";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FilterOptions {
  media: string[];
  programs: Array<{ id: string; nama_program: string }>;
  activities: Array<{ id: string; nama_aktivitas: string }>;
  tones: string[];
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

  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0
  });

  const [sortColumn, setSortColumn] = useState<string>("tanggal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [toneFilters, setToneFilters] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  const [mediaFilters, setMediaFilters] = useState<string[]>([]);
  const [programFilters, setprogramFilters] = useState<string[]>([]);
  const [activityFilters, setActivityFilters] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [prValueMin, setPrValueMin] = useState<number | undefined>();
  const [prValueMax, setPrValueMax] = useState<number | undefined>();
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);

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
    fetchData();
  }, [currentPage, sortColumn, sortOrder, toneFilters, mediaFilters, dateFrom, dateTo, prValueMin, prValueMax]);

  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchData();
    }, 500);

    setSearchTimer(timer);

    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const url = new URL(`${API_URL}/api/publication`);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', ITEMS_PER_PAGE.toString());

      if (search) {
        url.searchParams.append('search', search);
      }

      const columnMapping: Record<string, string> = {
        'judul': 'judul_publikasi',
        'tanggal': 'tanggal_publikasi',
        'prValue': 'pr_value',
        'tone': 'tone'
      };

      const backendSortColumn = columnMapping[sortColumn] || 'tanggal_publikasi';
      url.searchParams.append('sortBy', backendSortColumn);
      url.searchParams.append('sortOrder', sortOrder);

      if (toneFilters.length > 0) {
        url.searchParams.append('toneFilters', toneFilters.join(','));
      }
      if (mediaFilters.length > 0) {
        url.searchParams.append('mediaFilters', mediaFilters.join(','));
      }
      if (dateFrom) {
        url.searchParams.append('dateFrom', dateFrom);
      }
      if (dateTo) {
        url.searchParams.append('dateTo', dateTo);
      }
      if (prValueMin !== undefined) {
        url.searchParams.append('prValueMin', prValueMin.toString());
      }
      if (prValueMax !== undefined) {
        url.searchParams.append('prValueMax', prValueMax.toString());
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        const formattedData: Publikasi[] = result.data.map((item: {
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

        setPublikasiList(formattedData);
        setPagination(result.pagination);
      } else {
        throw new Error(result.message || "Gagal mengambil publikasi.");
      }
    } catch (error) {
      console.error("Error fetching publikasi:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error("Gagal memuat data, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }
    const response = await fetch(`${API_URL}/api/publication/filter-options`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setFilterOptions(data);
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const refreshData = async () => {
    setCurrentPage(1);
    await fetchData();
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

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const deletePublikasi = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Token tidak ditemukan, silakan login kembali");
        return false;
      }

      const response = await fetch(`${API_URL}/api/publication/${id}`, {
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

  // if (loading && currentPage === 1) {
  //   return (
  //     <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
  //       <CardContent className="flex justify-center items-center h-[400px]">
  //         <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
  //       </CardContent>
  //     </Card>
  //   );
  // }

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
                  <span className="max-md:text-[12px]">Filter</span>
                  {(toneFilters.length > 0 || mediaFilters.length > 0 || dateFrom || dateTo || prValueMin !== undefined || prValueMax !== undefined) && (
                    <Badge className="ml-1 bg-[#3A786D] text-white min-w-[20px] h-5 text-xs">
                      {toneFilters.length + mediaFilters.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + (prValueMin !== undefined ? 1 : 0) + (prValueMax !== undefined ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[calc(100vw-32px)] sm:w-[380px] p-0" align="end">
                <div className="max-h-[85vh] overflow-y-auto">
                  <div className="sticky top-0 z-10 bg-white border-b px-3 sm:px-4 py-3 flex items-center justify-between">
                    <h3 className="font-semibold text-base">Filter Publikasi</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs hover:bg-gray-100"
                        onClick={() => {
                          setToneFilters([]);
                          setMediaFilters([]);
                          setDateFrom("");
                          setDateTo("");
                          setPrValueMin(undefined);
                          setPrValueMax(undefined);
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                        onClick={() => setFilterOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">Tone</h4>
                      <div className="grid grid-cols-3 gap-1 sm:gap-2">
                        {TONE_OPTIONS.map((tone) => (
                          <div key={tone} className="flex items-center space-x-1 py-1.5 px-1 sm:px-2 rounded hover:bg-gray-50">
                            <Checkbox
                              id={`tone-${tone}`}
                              checked={toneFilters.includes(tone)}
                              onCheckedChange={() => toggleToneFilter(tone)}
                              className="data-[state=checked]:bg-[#3A786D] data-[state=checked]:border-[#3A786D] h-3.5 w-3.5"
                            />
                            <Label htmlFor={`tone-${tone}`} className="cursor-pointer text-xs sm:text-sm">
                              {getToneBadge(tone)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">Media</h4>
                      <div className="grid grid-cols-2 gap-x-1 gap-y-1 sm:gap-x-2">
                        {filterOptions?.media.map((media) => (
                          <div key={media} className="flex items-center space-x-1.5 py-1.5 px-1 sm:px-2 rounded hover:bg-gray-50">
                            <Checkbox
                              checked={mediaFilters.includes(media)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setMediaFilters([...mediaFilters, media]);
                                } else {
                                  setMediaFilters(mediaFilters.filter(m => m !== media));
                                }
                              }}
                              className="data-[state=checked]:bg-[#3A786D] data-[state=checked]:border-[#3A786D] h-3.5 w-3.5"
                            />
                            <Label className="text-xs sm:text-sm cursor-pointer leading-none truncate">{media}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-900">Tanggal & PR Value</h4>
                      <div className="space-y-3 border rounded-md p-2 sm:p-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="dateFrom" className="text-xs text-gray-600 mb-1 block">Dari</Label>
                            <Input
                              id="dateFrom"
                              type="date"
                              value={dateFrom}
                              onChange={(e) => setDateFrom(e.target.value)}
                              className="h-8 text-xs sm:text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="dateTo" className="text-xs text-gray-600 mb-1 block">Sampai</Label>
                            <Input
                              id="dateTo"
                              type="date"
                              value={dateTo}
                              onChange={(e) => setDateTo(e.target.value)}
                              className="h-8 text-xs sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="prValueMin" className="text-xs text-gray-600 mb-1 block">PR Min</Label>
                            <Input
                              id="prValueMin"
                              type="number"
                              value={prValueMin || ''}
                              onChange={(e) => setPrValueMin(e.target.value ? Number(e.target.value) : undefined)}
                              placeholder="0"
                              className="h-8 text-xs sm:text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="prValueMax" className="text-xs text-gray-600 mb-1 block">PR Max</Label>
                            <Input
                              id="prValueMax"
                              type="number"
                              value={prValueMax || ''}
                              onChange={(e) => setPrValueMax(e.target.value ? Number(e.target.value) : undefined)}
                              placeholder="999999999"
                              className="h-8 text-xs sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 z-10 bg-white border-t px-3 sm:px-4 py-3">
                    <Button
                      className="w-full bg-[#3A786D] hover:bg-[#2d5f56] text-white h-9 text-sm font-medium"
                      onClick={() => setFilterOpen(false)}
                    >
                      Terapkan Filter
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
            {(toneFilters.length > 0 || search || mediaFilters.length > 0 || programFilters.length > 0 || activityFilters.length > 0 || dateFrom || dateTo || prValueMin !== undefined || prValueMax !== undefined) && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setToneFilters([]);
                    setSearch("");
                    setMediaFilters([]);
                    setprogramFilters([]);
                    setActivityFilters([]);
                    setDateFrom("");
                    setDateTo("");
                    setPrValueMin(undefined);
                    setPrValueMax(undefined);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        ) : isMobileView ? (
          <div className="space-y-4">
            {publikasiList.map((item) => (
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : (
                  publikasiList.map((item) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
            >
              Previous
            </Button>
            {(() => {
              const pageButtons = [];
              const maxVisiblePages = 5;
              let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
              const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }

              if (startPage > 1) {
                pageButtons.push(
                  <Button
                    key="first"
                    onClick={() => setCurrentPage(1)}
                    className="h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                  >
                    1
                  </Button>
                );

                if (startPage > 2) {
                  pageButtons.push(
                    <span key="ellipsis1" className="flex items-center justify-center">
                      ...
                    </span>
                  );
                }
              }

              for (let i = startPage; i <= endPage; i++) {
                pageButtons.push(
                  <Button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm ${currentPage === i
                      ? "bg-[#3A786D] text-white"
                      : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                      }`}
                  >
                    {i}
                  </Button>
                );
              }

              if (endPage < pagination.totalPages) {
                if (endPage < pagination.totalPages - 1) {
                  pageButtons.push(
                    <span key="ellipsis2" className="flex items-center justify-center">
                      ...
                    </span>
                  );
                }

                pageButtons.push(
                  <Button
                    key="last"
                    onClick={() => setCurrentPage(pagination.totalPages)}
                    className="h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                  >
                    {pagination.totalPages}
                  </Button>
                );
              }

              return pageButtons;
            })()}
            <Button
              disabled={currentPage === pagination.totalPages}
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