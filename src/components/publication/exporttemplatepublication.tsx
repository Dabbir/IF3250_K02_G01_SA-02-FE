import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2, Upload, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface ExportTemplatePublicationProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess?: () => void;
}

interface PublikasiData {
    judul: string,
    media: string,
    perusahaan: string,
    tanggal: string,
    link: string,
    prValue: number,
    nama_program: string,
    nama_aktivitas: string,
    tone: string
}

const ExportTemplatePublication = ({ isOpen, setIsOpen, onSuccess }: ExportTemplatePublicationProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [extractedData, setExtractedData] = useState<PublikasiData[] | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [programList, setProgramList] = useState<{ id: string, nama_program: string }[]>([]);
    const [aktivitasList, setAktivitasList] = useState<{ id: string, nama_aktivitas: string }[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetchPrograms();
            fetchActivities();
        }
    }, [isOpen]);

    const fetchPrograms = async () => {
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

            if (data && Array.isArray(data)) {
                const formattedData = data.map((item: { 
                    id: string; 
                    nama_program: string 
                }) => ({
                    id: item.id || "",
                    nama_program: item.nama_program || "",
                }));
                setProgramList(formattedData);
            }
        } catch (error) {
            console.error("Error fetching program:", error);
        }
    };

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("Token tidak ditemukan");
                return;
            }

            const response = await fetch(`${API_URL}/api/activity/getreport/`, {
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

            if (data && data.activity && Array.isArray(data.activity)) {
                const formattedData = data.activity.map((item: { 
                    id: string; 
                    nama_aktivitas: string 
                }) => ({
                    id: item.id || "",
                    nama_aktivitas: item.nama_aktivitas || "",
                }));
                setAktivitasList(formattedData);
            }
        } catch (error) {
            console.error("Error fetching aktivitas:", error);
        }
    };

    const generateExcel = () => {
        try {
          const worksheetData = [
            ["judul_publikasi", "media_publikasi", "nama_perusahaan_media", "tanggal_publikasi", "url_publikasi", "pr_value", "nama_program", "nama_aktivitas", "tone"], 
            ["(HAPUS TEKS INI) IKUTI PANDUAN PENGISIAN PADA SHEETS '(PENTING!) Panduan Unggah' DAN '(PENTING!) Media & Tone'"]
          ];
          
          const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
          
          const mediaList = [
            ["Media yang dapat digunakan"], 
            ["Televisi"], 
            ["Koran"], 
            ["Radio"], 
            ["Media Online"], 
            ["Sosial Media"], 
            ["Lainnya"],
            [""],
            ["Tone yang dapat digunakan"], 
            ["Positif"], 
            ["Netral"], 
            ["Negatif"]
          ];
          const wsMediaTone = XLSX.utils.aoa_to_sheet(mediaList);
          
          const namaProgramList = programList.map((item: any) => [item.nama_program]);
          const wsProgram = XLSX.utils.aoa_to_sheet([["Nama Program yang tersedia"], ...namaProgramList]);
          
          const namaAktivitasList = aktivitasList.map((item: any) => [item.nama_aktivitas]);
          const wsActivity = XLSX.utils.aoa_to_sheet([["Nama Aktivitas yang tersedia"], ...namaAktivitasList]);
      
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
            ["nama_program : TEXT bebas, disarankan menggunakan nama program yang tersedia"],
            ["nama_aktivitas : TEXT bebas, disarankan menggunakan nama aktivitas yang tersedia"],
            ["tone : Pilih salah satu pilihan pada sheet '(PENTING!) Media & Tone' (WAJIB)"],
            [""],
            ["[2] Hanya melakukan perubahan di sheet 'Upload Data' tanpa mengubah sheet lainnya"],
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
              formula1: "'(PENTING!) Media & Tone'!A2:A7", 
              showDropDown: true,
            },
            {
              sqref: "I2:I100",
              type: "list",
              formula1: "'(PENTING!) Media & Tone'!A10:A12", 
              showDropDown: true,
            },
            {
              sqref: "G2:G100",
              type: "list",
              formula1: "'(PENTING!) Nama Program'!A2:A" + (namaProgramList.length + 1), 
              showDropDown: true,
            },
            {
              sqref: "H2:H100",
              type: "list",
              formula1: "'(PENTING!) Nama Aktivitas'!A2:A" + (namaAktivitasList.length + 1), 
              showDropDown: true,
            },
          ];
          
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, worksheet, "Upload Data");
          XLSX.utils.book_append_sheet(wb, guidanceSheet, "(PENTING!) Panduan Unggah");
          XLSX.utils.book_append_sheet(wb, wsMediaTone, "(PENTING!) Media & Tone");
          XLSX.utils.book_append_sheet(wb, wsProgram, "(PENTING!) Nama Program");
          XLSX.utils.book_append_sheet(wb, wsActivity, "(PENTING!) Nama Aktivitas");
          
          const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
          const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
          saveAs(fileData, "Template_Publikasi.xlsx");
          
          toast.success("Berhasil mengunduh template publikasi");
        } catch (error) {
          console.error("Error saat mengambil data atau membuat file:", error);
          toast.error("Gagal membuat template. Silakan coba lagi.");
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            // Validasi tipe file
            const allowedExtensions = [".xlsx", ".csv"];
            const isValidFile = allowedExtensions.some((ext) =>
                file.name.toLowerCase().endsWith(ext)
            );

            if (!isValidFile) {
                toast.error("Hanya file dengan format .xlsx atau .csv yang diperbolehkan!");
                event.target.value = "";
                return;
            }

            setSelectedFile(null);
            setExtractedData(null);

            setTimeout(() => {
                setSelectedFile(file);

                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target?.result as ArrayBuffer);
                        const workbook = XLSX.read(data, { type: "array" });

                        // Verifikasi sheet name
                        const sheetName = workbook.SheetNames[0];
                        if (sheetName !== "Upload Data") {
                            toast.error("Error: Pastikan tab pertama bernama 'Upload Data'");
                            setSelectedFile(null);
                            return;
                        }

                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json<PublikasiData>(worksheet, { raw: false });
                        console.log("Data yang akan dikirim ke backend:", jsonData);
                        setExtractedData(jsonData);
                    } catch (error) {
                        console.error("Error parsing file:", error);
                        toast.error("Gagal membaca file. Pastikan format file sesuai template.");
                        setSelectedFile(null);
                    }
                };
            }, 0);

            event.target.value = "";
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setExtractedData(null);
    };

    const convertExcelDate = (value: number | string | null | undefined) => {
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

    const parsePrValue = (value: string | number | null | undefined): number => {
        if (typeof value === "number") return value;

        if (typeof value === "string") {
            const cleanValue = value.trim().replace(".", "").replace(",", ".");
            const parsedNumber = parseFloat(cleanValue);
            return isNaN(parsedNumber) ? 0 : parsedNumber;
        }

        return 0;
    };

    const handleSubmit = async () => {
        if (!extractedData || extractedData.length === 0) {
            toast.error("Tidak ada data yang dapat diimpor.");
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication token not found");

            // Format data untuk API
            const formattedData = extractedData.map(item => {
                const aktivitas = aktivitasList.find(a => a.nama_aktivitas === item.nama_aktivitas);
                const program = programList.find(p => p.nama_program === item.nama_program);

                return {
                    judul_publikasi: item.judul || "",
                    media_publikasi: item.media || "Media Online",
                    nama_perusahaan_media: item.perusahaan || "",
                    tanggal_publikasi: convertExcelDate(item.tanggal) || new Date().toISOString().split("T")[0],
                    url_publikasi: item.link || "",
                    pr_value: parsePrValue(item.prValue),
                    tone: item.tone || "Netral",
                    aktivitas_id: aktivitas?.id || null,
                    program_id: program?.id || null,
                };
            });

            // Kirim data satu per satu
            let successCount = 0;
            for (const item of formattedData) {
                try {
                    const response = await fetch(`${API_URL}/api/publication`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(item),
                    });

                    if (response.ok) {
                        successCount++;
                    }
                } catch (error) {
                    console.error("Error adding item:", error);
                }
            }

            if (successCount > 0) {
                toast.success(`Berhasil menambahkan ${successCount} publikasi dari ${formattedData.length} data!`);

                if (onSuccess) {
                    onSuccess();
                }

                setIsOpen(false);
            } else {
                toast.error("Tidak ada publikasi yang berhasil ditambahkan.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Gagal menambahkan publikasi! Cek koneksi atau format data.");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setExtractedData(null);
            setIsSaving(false);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[600px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center">Import Data Publikasi</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Button
                        onClick={generateExcel}
                        className="bg-[#3A786D] hover:bg-[var(--blue)] hover:scale-95 text-white"
                    >
                        Download Template
                    </Button>
                    <Card className="p-4 border border-gray-300 rounded-lg transition-transform duration-200 hover:scale-95 active:scale-90">
                        <CardContent className="flex flex-col items-center justify-center gap-2">
                            <input type="file" onChange={handleFileChange} className="hidden" id="file-upload-publikasi" accept=".xlsx,.csv" />
                            <label
                                htmlFor="file-upload-publikasi"
                                className="cursor-pointer text-[#3A786D] transition-colors duration-200 hover:text-[var(--blue)] flex flex-col items-center justify-center gap-2"
                            >
                                <Upload className="h-7 w-7 text-gray-500 transition-transform duration-200 hover:scale-105 active:scale-95" />
                                {!selectedFile && "Pilih File Excel"}
                            </label>

                            {selectedFile && (
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-gray-700">{selectedFile.name}</span>
                                    <button onClick={handleRemoveFile} className="text-red-500 hover:text-red-700">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="text-[#3A786D] border-[#3A786D] hover:scale-95"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-[#3A786D] hover:bg-[var(--blue)] hover:scale-95 text-white"
                        disabled={isSaving || !selectedFile}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Import Data"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExportTemplatePublication;