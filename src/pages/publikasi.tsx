"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, Trash2, BookOpen, Share2, Download, Pencil, Loader2 } from "lucide-react";
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

  // Fetch data on component mount
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

  // Apply pagination after sorting
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

  // Export data to XLSX
  const exportToXlsx = () => {
    if (publikasiList.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    try {
      // Prepare data for export
      const data = publikasiList.map(item => ({
        "Judul Publikasi": item.judul,
        "Media Publikasi": item.media,
        "Perusahaan Media": item.perusahaan,
        "Tanggal Publikasi": formatDate(item.tanggal),
        "Link Publikasi": item.link,
        "PR Value": item.prValue,
        "Nama Program": item.nama_program || "",
        "Nama Aktivitas": item.nama_aktivitas || "",
        "Tone": item.tone
      }));

      // Set column widths for better readability
      const columnWidths = [
        { wch: 30 }, // Judul Publikasi
        { wch: 15 }, // Media Publikasi
        { wch: 20 }, // Perusahaan Media
        { wch: 15 }, // Tanggal Publikasi
        { wch: 30 }, // Link Publikasi
        { wch: 15 }, // PR Value
        { wch: 20 }, // Nama Program
        { wch: 20 }, // Nama Aktivitas
        { wch: 10 }  // Tone
      ];

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      worksheet['!cols'] = columnWidths;

      // Create workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Publikasi");

      // Write to file and download
      XLSX.writeFile(workbook, "Publikasi.xlsx");

      toast.success("Berhasil mengunduh data publikasi");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Gagal mengunduh data publikasi");
    }
  };

  const [loading, setLoading] = useState(false);

  // GET - Fetch all publications
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

  if (loading) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-6 max-w-[70rem] p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Publikasi</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4 items-center">
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
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {/* Export Button */}
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center gap-1"
              onClick={exportToXlsx}
            >
              <Download className="h-4 w-4" />
              Unduh Publikasi
            </Button>

            {/* Add Publication Button */}
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto"
              onClick={() => setIsOpen(true)}
            >
              Tambah Publikasi
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
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
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-[#3A786D] text-white"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`${currentPage === i + 1 ? "bg-[#3A786D] text-white" : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                  }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-[#3A786D] text-white"
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