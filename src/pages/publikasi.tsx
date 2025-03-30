"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, Download, Upload, Pencil, Trash2, BookOpen, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_HOST_NAME;

const SORTABLE_COLUMNS = ["judul", "media", "perusahaan", "tanggal", "link", "prValue", "nama_program", "nama_aktivitas", "tone"];

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

interface Program {
  id: string;
  nama_program: string;
}

interface Aktivitas {
  id: string;
  nama_aktivitas: string;
}


const formatRupiah = (value: number) => {
  return `Rp ${value.toLocaleString("id-ID")}`;
};

const ITEMS_PER_PAGE = 20;

export default function PublikasiPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>([]);
  const [programList, setProgramList] = useState<Program[]>([]);
  const [aktivitasList, setAktivitasList] = useState<Aktivitas[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>("tanggal"); 
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const loadData = async () => {
      const publikasiData = await fetchPublikasi();
      setPublikasiList(publikasiData);
    };
    loadData();
  }, []);

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
  
  // Terapkan paginasi setelah sorting
  const displayedPublikasi = sortedPublikasi.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );  

  useEffect(() => {
    const loadData = async () => {
      const publikasiData = await fetchPublikasi();
      setPublikasiList(publikasiData);
      
      const programData = await fetchProgram();
      setProgramList(programData);

      const aktivitasData = await fetchAktivitas();
      setAktivitasList(aktivitasData);
    };
    
    loadData();
  }, []);

  const [newPublikasi, setNewPublikasi] = useState<Partial<Publikasi>>({
    judul: "",
    media: "Media Online",
    perusahaan: "",
    tanggal: new Date().toISOString(),
    link: "",
    prValue: 0,
    nama_program: "",
    nama_aktivitas: "",
    tone: "Netral",
  });
  
  const totalPages = Math.ceil(filteredPublikasi.length / ITEMS_PER_PAGE);

  const shareToWhatsApp = (item: Publikasi) => {
    const message = `Cek publikasi ini: ${item.judul} - ${item.link}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  
    window.open(whatsappUrl, "_blank");
  };  

  // GET
  const fetchPublikasi = async (): Promise<Publikasi[]> => {
    try {
      const response = await fetch(`${API_URL}/api/publikasi`);
      const data = await response.json();
      
      if (response.ok) {
        const formattedData: Publikasi[] = data.map((item: any) => ({
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
      return [];
    }
  };

  const fetchProgram = async (): Promise<Program[]> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/program`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal mengambil program: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Program Data:", data);
  
      if (data && Array.isArray(data)) {
        const formattedData: Program[] = data.map((item: any) => ({
          id: item.id || "",
          nama_program: item.nama_program || "",
        }));
        return formattedData;
      } else {
        console.warn("Format data program tidak sesuai:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching program:", error);
      return [];
    }
  }

  const fetchAktivitas = async (): Promise<Aktivitas[]> => {
    try {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.warn("Token tidak ditemukan, mencoba tanpa token...");
        return [];
      }
    
      const response = await fetch(`${API_URL}/api/activity/getactivity/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    
      if (!response.ok) {
        throw new Error(`Gagal mengambil aktivitas: ${response.status}`);
      }
    
      const data = await response.json();
      console.log("Aktivitas Data:", data);
      
      if (data && data.activity && Array.isArray(data.activity)) {
        const formattedData: Aktivitas[] = data.activity.map((item: any) => ({
          id: item.id || "",
          nama_aktivitas: item.nama_aktivitas || "",
        }));
        return formattedData;
      } else {
        console.warn("Format data aktivitas tidak sesuai:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching aktivitas:", error);
      return [];
    }
  };

  // Handle Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "prValue") {
      const numericValue = Number(value.replace(/\D/g, "")) || 0;
      setNewPublikasi((prev) => ({ ...prev, prValue: numericValue }));
    } else {
      setNewPublikasi((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", { 
        day: "2-digit",
        month: "long", 
        year: "numeric" 
      });
    } catch (e) {
      return dateString;
    }
  };

  // POST
  const addPublikasi = async (publikasi: Partial<Publikasi>): Promise<Publikasi | null> => {
    try {
      const token = localStorage.getItem("token");
      
      if (!publikasi.judul || !publikasi.perusahaan || !publikasi.link) {
        throw new Error("Data tidak lengkap");
      }
  
      const response = await fetch(`${API_URL}/api/publikasi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          judul_publikasi: publikasi.judul,
          media_publikasi: publikasi.media,
          nama_perusahaan_media: publikasi.perusahaan,
          tanggal_publikasi: publikasi.tanggal,
          url_publikasi: publikasi.link,
          pr_value: publikasi.prValue,
          nama_program: publikasi.nama_program || "",
          nama_aktivitas: publikasi.nama_aktivitas,
          tone: publikasi.tone || "Netral",
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return {
          id: data.id || "",
          judul: data.judul_publikasi || "",
          media: data.media_publikasi || "Media Online",
          perusahaan: data.nama_perusahaan_media || "",
          tanggal: data.tanggal_publikasi || "",
          link: data.url_publikasi || "",
          prValue: data.pr_value || 0,
          nama_program: data.nama_program || "",
          nama_aktivitas: data.nama_aktivitas || "",
          tone: data.tone || "Netral",
        };
      } else {
        throw new Error(data.message || "Gagal menambahkan publikasi.");
      }
    } catch (error) {
      console.error("Error adding publikasi:", error);
      return null;
    }
  };  

  const handleAddPublikasi = async () => {
    if (!newPublikasi.judul || !newPublikasi.perusahaan || !newPublikasi.link) {
      alert("Harap isi semua bidang yang diperlukan.");
      return;
    }
  
    const added = await addPublikasi(newPublikasi);
    if (added) {
      const refreshedData = await fetchPublikasi();
      setPublikasiList(refreshedData);
      setIsOpen(false);
      
      setNewPublikasi({
        judul: "",
        media: "Media Online",
        perusahaan: "",
        tanggal: new Date().toISOString().split("T")[0],
        link: "",
        prValue: 0,
        nama_program: "",
        nama_aktivitas: "",
        tone: "Netral",
      });
    }
  };  

  // PUT - Perbarui publikasi berdasarkan ID
  const updatePublikasi = async (id: string, publikasi: Partial<Publikasi>): Promise<Publikasi | null> => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/publikasi/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          judul_publikasi: publikasi.judul,
          media_publikasi: publikasi.media,
          nama_perusahaan_media: publikasi.perusahaan,
          tanggal_publikasi: publikasi.tanggal
          ? new Date(publikasi.tanggal).toISOString().split("T")[0] 
          : null,
          url_publikasi: publikasi.link,
          pr_value: publikasi.prValue,
          nama_program: publikasi.nama_program,
          nama_aktivitas: publikasi.nama_aktivitas,
          tone: publikasi.tone || "Netral",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          id: data.id || id,
          judul: data.judul_publikasi || "",
          media: data.media_publikasi || "Media Online",
          perusahaan: data.nama_perusahaan_media || "",
          tanggal: data.tanggal_publikasi || "",
          link: data.url_publikasi || "",
          prValue: data.pr_value || 0,
          nama_program: data.nama_program || "",
          nama_aktivitas: data.nama_aktivitas || "",
          tone: data.tone || "Netral",
        };
      } else {
        throw new Error(data.message || "Gagal memperbarui publikasi.");
      }
    } catch (error) {
      console.error("Error updating publikasi:", error);
      return null;
    }
  };

  const handleSavePublikasi = async () => {
    if (!newPublikasi.judul || !newPublikasi.perusahaan) {
      alert("Harap isi semua bidang yang diperlukan.");
      return;
    }
  
    if (editingId) {
      // Mode Edit (PUT)
      const updated = await updatePublikasi(editingId, newPublikasi);
      if (updated) {
        const refreshedData = await fetchPublikasi();
        setPublikasiList(refreshedData);
        alert("Publikasi berhasil diperbarui!");
      }
    } else {
      // Mode Tambah (POST)
      const added = await addPublikasi(newPublikasi);
      if (added) {
        const refreshedData = await fetchPublikasi();
        setPublikasiList(refreshedData);
        alert("Publikasi berhasil ditambahkan!");
      }
    }
  
    setIsOpen(false);
    setEditingId(null); // Reset mode edit setelah simpan
    resetNewPublikasi(); // Reset form setelah simpan
  };
  
  const resetNewPublikasi = () => {
    setNewPublikasi({
      judul: "",
      media: "Media Online",
      perusahaan: "",
      tanggal: new Date().toISOString().split("T")[0],
      link: "",
      prValue: 0,
      nama_program: "",
      nama_aktivitas: "",
      tone: "Netral",
    });
  };  

  // DELETE
  const deletePublikasi = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${API_URL}/api/publikasi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token || ""}`,
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
        const refreshedData = await fetchPublikasi();
        setPublikasiList(refreshedData);
      } else {
        alert("Gagal menghapus publikasi. Silakan coba lagi.");
      }
    }
  };  

  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const responseProgram = await fetch(`${API_URL}/api/program`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const programData = await responseProgram.json();
      const namaProgramList = programData.map((item: any) => [item.nama_program]);
  
      const responseActivity = await fetch(`${API_URL}/api/activity/getactivity/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });
      const activityData = await responseActivity.json();
      const namaAktivitasList = activityData.activity.map((item: any) => [item.nama_aktivitas]);
  
      const uploadData = [
        ["judul", "media", "perusahaan", "tanggal", "link", "prValue", "nama_program", "nama_aktivitas", "tone"],
        ["", "", "", "YYYY-MM-DD", "", 0, "", "", ""], 
      ];
      const wsUpload = XLSX.utils.aoa_to_sheet(uploadData);

      const mediaList = [["Media yang dapat digunakan"], ["Televisi"], ["Koran"], ["Radio"], ["Media Online"], ["Sosial Media"], ["Lainnya"]];
      const wsMedia = XLSX.utils.aoa_to_sheet(mediaList);

      const toneList = [["Tone yang dapat digunakan"], ["Positif"], ["Netral"], ["Negatif"]];
      const wsTone = XLSX.utils.aoa_to_sheet(toneList);
  
      const wsProgram = XLSX.utils.aoa_to_sheet([["Nama Program"], ...namaProgramList]);
  
      const wsActivity = XLSX.utils.aoa_to_sheet([["Nama Aktivitas"], ...namaAktivitasList]);
  
      wsUpload["!dataValidation"] = [
        {
          sqref: "B2:B100",
          type: "list",
          formula1: "Info Media!A2:A7", 
          showDropDown: true,
        },
        {
          sqref: "I2:I100",
          type: "list",
          formula1: "Info Tone!A2:A4", 
          showDropDown: true,
        },
        {
          sqref: "G2:G100",
          type: "list",
          formula1: "Info Nama Program!A2:A" + (namaProgramList.length + 1), 
          showDropDown: true,
        },
        {
          sqref: "H2:H100",
          type: "list",
          formula1: "Info Nama Aktivitas!A2:A" + (namaAktivitasList.length + 1), 
          showDropDown: true,
        },
      ];
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, wsUpload, "Upload Data");
      XLSX.utils.book_append_sheet(wb, wsMedia, "Info Media");
      XLSX.utils.book_append_sheet(wb, wsTone, "Info Tone");
      XLSX.utils.book_append_sheet(wb, wsProgram, "Info Nama Program");
      XLSX.utils.book_append_sheet(wb, wsActivity, "Info Nama Aktivitas");
  
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(fileData, "Template_Publikasi.xlsx");
  
    } catch (error) {
      console.error("Error saat mengambil data atau membuat file:", error);
    }
  };   

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedExtensions = [".xlsx", ".csv"];

      const isValidFile = allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
  
      if (!isValidFile) {
        alert("Hanya file dengan format .xlsx atau .csv yang diperbolehkan!");
        event.target.value = "";
        return;
      }
  
      console.log("File valid:", file.name);
      handleFileUpload(event); 
    }
  };  

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      // Hanya baca tab pertama (Upload Data)
      const sheetName = workbook.SheetNames[0]; 
      if (sheetName !== "Upload Data") {
        alert("Error: Pastikan tab pertama bernama 'Upload Data'");
        return;
      }
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      const convertExcelDate = (value: any) => {
        if (!value) return "";
      
        if (typeof value === "number") {
          const date = XLSX.SSF.parse_date_code(value);
          return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
        }
      
        if (typeof value === "string") {
          const parts = value.split(/[\/\-\.]/).map((p) => p.padStart(2, "0"));
      
          if (parts.length === 3) {
            let [day, month, year] = parts;
      
            if (year.length === 2) {
              year = `20${year}`; 
            }
      
            if (parseInt(day) > 12 && parseInt(month) <= 12) {
              return `${year}-${month}-${day}`;
            } else if (parseInt(month) > 12 && parseInt(day) <= 12) {
              return `${year}-${day}-${month}`;
            } else {
              return `${year}-${month}-${day}`;
            }
          }
        }
      
        return value; 
      };         

      const parsePrValue = (value: any): number => {
        console.log("Nilai prValue sebelum parsing:", value);
      
        if (typeof value === "number") return value; 
      
        if (typeof value === "string") {
          let cleanValue = value.trim().replace(".", "").replace(",", "."); 
          let parsedNumber = parseFloat(cleanValue); 
      
          console.log("Nilai prValue setelah parsing:", parsedNumber);
          return isNaN(parsedNumber) ? 0 : parsedNumber; 
        }
      
        return 0; 
      };        
  
      const formattedData: Partial<Publikasi>[] = jsonData.map((row) => ({
        judul: row["judul"] || "",
        media: row["media"] || "Media Online",
        perusahaan: row["perusahaan"] || "",
        tanggal: convertExcelDate(row["tanggal"]),
        link: row["link"] || "",
        prValue: parsePrValue(row["prValue"]), 
        nama_program: row["nama_program"] || "",
        nama_aktivitas: row["nama_aktivitas"] || "",
        tone: row["tone"] || "Netral",
      }));   
  
      try {
        const uploadedPublikasi = await Promise.all(
          formattedData.map(async (publikasi) => {
            try {
              return await addPublikasi(publikasi);
            } catch (err) {
              console.error("Gagal menambahkan publikasi:", publikasi, err);
              return null; 
            }
          })
        );

        const successfulPublikasi = uploadedPublikasi.filter((p): p is Publikasi => p !== null);

        if (successfulPublikasi.length > 0) {
          const refreshedData = await fetchPublikasi();
          setPublikasiList(refreshedData);

          alert(`Berhasil mengunggah ${successfulPublikasi.length} data publikasi!`);
        } else {
          alert("Tidak ada data yang berhasil diunggah.");
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengunggah data:", error);
        alert("Terjadi kesalahan saat mengunggah data.");
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
    };
  
    reader.readAsArrayBuffer(file);
  };

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
          <div className="flex relative w-2/5 gap-2">
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

            {/* Tombol Sort Ascending/Descending */}
            <Button variant="outline" onClick={() => handleSortChange(sortColumn)} className="flex items-center">
              <ArrowUpDown className="w-4 h-4 mr-2" /> Sort
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={downloadTemplate} ><Download className="w-4 h-4 mr-2" /> Download Template</Button>
            <Button variant="outline" onClick={handleButtonClick}><Upload className="w-4 h-4 mr-2" /> Upload Data</Button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.csv"
              onChange={handleFileChange}
              style={{ display: "none" }} 
            />
            <Button className="bg-[#3A786D] text-white" onClick={() => {
                setEditingId(null);
                resetNewPublikasi(); 
                setIsOpen(true);
              }}>
              Tambah Publikasi
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Judul Publikasi</TableHead>
                <TableHead>Media Publikasi</TableHead>
                <TableHead>Perusahaan Media</TableHead>
                <TableHead>Tanggal Publikasi</TableHead>
                <TableHead>Link Publikasi</TableHead>
                <TableHead>PR Value</TableHead>
                <TableHead>Nama Program</TableHead>
                <TableHead>Nama Aktivitas</TableHead>
                <TableHead>Tone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedPublikasi.length > 0 ? (
                displayedPublikasi.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.judul}</TableCell>
                    <TableCell>{item.media}</TableCell>
                    <TableCell>{item.perusahaan}</TableCell>
                    <TableCell>{formatDate(item.tanggal)}</TableCell>
                    <TableCell>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {item.link}
                      </a>
                    </TableCell>
                    <TableCell>{formatRupiah(item.prValue)}</TableCell>
                    <TableCell>{item.nama_program}</TableCell>
                    <TableCell>{item.nama_aktivitas}</TableCell>
                    <TableCell>{item.tone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-200 transition cursor-pointer"
                          onClick={() => {
                            setNewPublikasi({
                              judul: item.judul,
                              media: item.media,
                              perusahaan: item.perusahaan,
                              tanggal: item.tanggal,
                              link: item.link,
                              prValue: item.prValue,
                              nama_program: item.nama_program,
                              nama_aktivitas: item.nama_aktivitas,
                              tone: item.tone,
                            });
                            setEditingId(item.id); 
                            setIsOpen(true);
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
                         onClick={() => handleDeletePublikasi(item.id)}>
                          <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
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
                className={`${
                  currentPage === i + 1 ? "bg-[#3A786D] text-white" : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{newPublikasi.id ? "Edit Publikasi" : "Tambah Publikasi"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input name="judul" placeholder="Judul Publikasi" value={newPublikasi.judul} onChange={handleInputChange} />
              <Select 
                value={newPublikasi.media}
                onValueChange={(value: string) => setNewPublikasi({ ...newPublikasi, media: value as Publikasi["media"] })}
              >
                <SelectTrigger><SelectValue placeholder="Pilih Media Publikasi" /></SelectTrigger>
                <SelectContent>
                  {["Televisi", "Koran", "Radio", "Media Online", "Sosial Media", "Lainnya"].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={newPublikasi.nama_aktivitas}
                onValueChange={(value: string) => {
                  const selectedAktivitas = aktivitasList.find(
                    (aktivitas) => aktivitas.nama_aktivitas === value
                  );
                  setNewPublikasi((prev) => ({
                    ...prev,
                    nama_aktivitas: value,
                    aktivitas_id: selectedAktivitas?.id || "",
                  }));
                }}
              >
                <SelectTrigger><SelectValue placeholder="Pilih Aktivitas" /></SelectTrigger>
                <SelectContent>
                  {aktivitasList && aktivitasList.length > 0 ? (
                    aktivitasList.map((aktivitas) => (
                      <SelectItem 
                        key={aktivitas.id} 
                        value={aktivitas.nama_aktivitas || ""}
                      >
                        {aktivitas.nama_aktivitas || "Unnamed Activity"}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      Tidak ada data aktivitas
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Select 
                value={newPublikasi.nama_program}
                onValueChange={(value: string) => {
                  const selectedProgram = programList.find(
                    (program) => program.nama_program === value
                  );
                  setNewPublikasi((prev) => ({
                    ...prev,
                    nama_program: value,
                    program_id: selectedProgram?.id || "",
                  }));
                }}
              >
                <SelectTrigger><SelectValue placeholder="Pilih Program" /></SelectTrigger>
                <SelectContent>
                  {programList && programList.length > 0 ? (
                    programList.map((program) => (
                      <SelectItem 
                        key={program.id} 
                        value={program.nama_program || ""}
                      >
                        {program.nama_program || "Unnamed Program"}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      Tidak ada data program
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Input name="perusahaan" placeholder="Perusahaan Media" value={newPublikasi.perusahaan} onChange={handleInputChange} />
              <Input
                type="date"
                name="tanggal"
                placeholder="Tanggal Publikasi"
                value={newPublikasi.tanggal ? new Date(newPublikasi.tanggal).toISOString().split("T")[0] : ""}
                onChange={(e) => setNewPublikasi({ ...newPublikasi, tanggal: e.target.value })}
              />
              <Input name="link" placeholder="Link Publikasi" value={newPublikasi.link} onChange={handleInputChange} />
              <div className="relative">
                <span className="absolute left-3 top-2 text-black text-sm">Rp</span>
                <Input
                  name="prValue"
                  type="text"
                  placeholder="PR Value"
                  value={newPublikasi.prValue ? newPublikasi.prValue.toLocaleString("id-ID") : ""}
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>
              <Select
                value={newPublikasi.tone}
                onValueChange={(value: string) => setNewPublikasi({ ...newPublikasi, tone: value as Publikasi["tone"] })}
              >
                <SelectTrigger><SelectValue placeholder="Pilih Tone" /></SelectTrigger>
                <SelectContent>
                  {["Positif", "Netral", "Negatif"].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsOpen(false);
                setNewPublikasi({
                  judul: "",
                  media: "Media Online",
                  perusahaan: "",
                  link: "",
                  prValue: 0,
                });
              }}>Batal</Button>
              <Button 
                className="bg-[#3A786D] text-white" 
                onClick={handleSavePublikasi}
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}