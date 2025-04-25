import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Upload, XCircle, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_HOST_NAME;

const PILAR_OPTIONS = [
    "Tanpa Kemiskinan",
    "Tanpa Kelaparan",
    "Kehidupan Sehat dan Sejahtera",
    "Pendidikan Berkualitas",
    "Kesetaraan Gender",
    "Air Bersih dan Sanitasi Layak",
    "Energi Bersih dan Terjangkau",
    "Pekerjaan Layak dan Pertumbuhan Ekonomi",
    "Industri, Inovasi dan Infrastruktur",
    "Berkurangnya Kesenjangan",
    "Kota dan Pemukiman yang Berkelanjutan",
    "Konsumsi dan Produksi yang Bertanggung Jawab",
    "Penanganan Perubahan Iklim",
    "Ekosistem Lautan",
    "Ekosistem Daratan",
    "Perdamaian, Keadilan dan Kelembagaan yang Tangguh",
    "Kemitraan untuk Mencapai Tujuan",
];

interface ExportTemplateProgramProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function ExportTemplateProgram({isOpen,setIsOpen}: ExportTemplateProgramProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [parsedRows, setParsedRows] = useState<any[] | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
    if (!isOpen) {
        setSelectedFile(null);
        setParsedRows(null);
        setIsSaving(false);
    }
    }, [isOpen]);

    const downloadTemplate = () => {
    const sheet1 = XLSX.utils.aoa_to_sheet([
        [
        "nama_program",
        "deskripsi_program",
        "pilar_program",
        "kriteria_program",
        "tanggal_mulai",
        "tanggal_selesai",
        "rancangan_anggaran",
        "aktualisasi_anggaran",
        "status_program",
        ],
        [
        "(HAPUS TEKS INI) IKUTI PANDUAN PENGISIAN PADA SHEETS '(PENTING!) Panduan Unggah' DAN '(PENTING!) Pilar Program'",
        ],
    ]);

    const guidance = XLSX.utils.aoa_to_sheet([
        ["Panduan Pengisian Data Program dengan Mekanisme Unggah File"],
        [""],
        ["[1] Isi setiap kolom sesuai dengan kategori yang tertera. Perhatikan format pengisian data untuk setiap kolom sebagai berikut :"],
        ["nama_program : TEXT bebas"],
        ["deskripsi_program : TEXT bebas"],
        ["pilar_program : Format mengikuti instruksi pada sheet '(PENTING!) Pilar Program'"],
        ["kriteria_program : TEXT bebas"],
        ["tanggal_mulai : Format YYYY-MM-DD"],
        ["tanggal_selesai : Format YYYY-MM-DD"],
        ["rancangan_anggaran : ANGKA positif"],
        ["aktualisasi_anggaran : ANGKA positif"],
        ["status_program : Belum Mulai/Berjalan/Selesai"],
        [""],
        ["[2] Hanya melakukan perubahan di sheets 'Template Program' tanpa mengubah sheets lainnya (sheets '(PENTING!) Pilar Program' dan sheets '(PENTING!) Panduan Unggah')"],
        [""],
        ["[3] Tidak diperbolehkan untuk memindah-mindahkan posisi sheets"],
        [""],
        ["[4] Simpan file dalam format xlsx atau xls dengan nama bebas"],
        [""],
        ["[5] Kunjungi laman 'Data Program' pada website Salman Sustainability Report"],
        [""],
        ["[6] Unggah file xlsx atau xls pada tombol 'Upload Data'"],
        [""],
        ["[CONTOH]"]
    ]);

    const pilarSheet = XLSX.utils.aoa_to_sheet(
        PILAR_OPTIONS.map((p) => [p])
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet1, "Template Program");
    XLSX.utils.book_append_sheet(workbook, guidance, "(PENTING!) Panduan Unggah");
    XLSX.utils.book_append_sheet(workbook, pilarSheet, "(PENTING!) Pilar Program");

    XLSX.utils.sheet_add_aoa(guidance, [
        ["nama_program", "deskripsi_program", "pilar_program", "kriteria_program", "tanggal_mulai", "tanggal_selesai", "rancangan_anggaran", "aktualisasi_anggaran", "status_program"],
        ["Program Jumat Berkah", "Kegiatan rutin membagikan bahan sembako untuk warga sekitar", "Tanpa Kemiskinan,Tanpa Kelaparan,Kehidupan Sehat dan Sejahtera", "Program Penyejahteraan Umat", "2025-03-20", "2025-09-24", "50000000", "45000000", "Selesai"],
        ["Pesantren Kilat", "Malam bina takwa untuk sekolah sekitar", "Pendidikan Berkualitas", "Program Pencerdasan Umat", "2025-03-20", "2025-09-24", "50000000", "45000000", "Berjalan"]
    ], {origin: "A25"});

    const excelBuffer = XLSX.write(workbook, { 
        bookType: "xlsx", 
        type: "array",
        bookSST: false,
        Props: {
            Title: "Template Program",
            Subject: "Template untuk input program",
            Author: "Sistem Sustainability"
        } 
    });

    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "Template_Program.xlsx");
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onload = (ev) => {
        const data = new Uint8Array(ev.target!.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array", cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { raw: false });
        setParsedRows(json as any[]);
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
    };

    const parseExcelDate = (dateStr: any) => {
    if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }

    let d: Date;
    if (typeof dateStr === "number") {
        const epoch = new Date(1899, 11, 30);
        d = new Date(epoch.getTime() + dateStr * 24 * 60 * 60 * 1000);
    } else {
        d = new Date(dateStr);
    }

    if (isNaN(d.getTime())) throw new Error("Format tanggal tidak valid");
    return d.toISOString().split("T")[0];
    };

    const handleImport = async () => {
    if (!parsedRows || parsedRows.length === 0) {
        toast.error("Tidak ada baris untuk diimpor");
        return;
    }
    setIsSaving(true);

    try {
        const transformed = parsedRows.map((row: any, i) => {
        if (Object.keys(row).length > 9)
            throw new Error(`Baris ${i + 1}: kolom terlalu banyak`);
        const {
            nama_program,
            deskripsi_program,
            pilar_program,
            kriteria_program,
            tanggal_mulai,
            tanggal_selesai,
            rancangan_anggaran,
            aktualisasi_anggaran,
            status_program,
        } = row;

        if (!nama_program || !pilar_program || !tanggal_mulai || !tanggal_selesai) {
            throw new Error(
            `Baris ${i + 1}: nama, pilar, tanggal mulai & selesai wajib`
            );
        }

        const rAng = Number(rancangan_anggaran);
        if (isNaN(rAng) || rAng < 0 || !Number.isInteger(rAng)) {
            throw new Error(`Baris ${i + 1}: rancangan_anggaran tidak valid.`);
        }
        const aAng = Number(aktualisasi_anggaran);
        if (isNaN(aAng) || aAng < 0 || !Number.isInteger(aAng)) {
            throw new Error(`Baris ${i + 1}: aktualisasi_anggaran tidak valid.`);
        }

        if (
            status_program &&
            !["Belum Mulai", "Berjalan", "Selesai"].includes(status_program)
        ) {
            throw new Error(`Baris ${i + 1}: status_program tidak valid.`);
        }

        const pilars = (pilar_program as string).split(",").map((s) => s.trim());
        const invalid = pilars.filter((p) => !PILAR_OPTIONS.includes(p));
        if (invalid.length) {
            throw new Error(`Baris ${i + 1}: pilar_program berisi nilai tak dikenal (${invalid.join(", ")})`);
        }

        const start = parseExcelDate(tanggal_mulai);
        const end = parseExcelDate(tanggal_selesai);
        if (end < start) {
            throw new Error(`Baris ${i + 1}: tanggal_selesai < tanggal_mulai`);
        }

        return {
            nama_program,
            deskripsi_program: deskripsi_program || "",
            pilar_program: pilars,
            kriteria_program: kriteria_program || "",
            waktu_mulai: start,
            waktu_selesai: end,
            rancangan_anggaran: rAng,
            aktualisasi_anggaran: aAng,
            status_program: status_program || "Belum Mulai",
        };
        });

        let success = 0;
        const token = localStorage.getItem("token");
        for (const rec of transformed) {
        const res = await fetch(`${API_URL}/api/program`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(rec),
        });
        if (res.ok) success++;
        }
        toast.success(`Berhasil impor ${success}/${transformed.length}`);
        setIsOpen(false);
    } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Gagal memproses file");
    } finally {
        setIsSaving(false);
    }
    };

    return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle className="text-center">Import Program</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
            <Button
            onClick={downloadTemplate}
            className="bg-[#3A786D] text-white"
            >
            Download Template
            </Button>
            <Card>
            <CardContent className="flex flex-col items-center p-6">
                <input
                id="file-upload-program"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFile}
                className="hidden"
                />
                <label
                htmlFor="file-upload-program"
                className="cursor-pointer text-[#3A786D] flex flex-col items-center"
                >
                <Upload className="w-8 h-8 mb-2" />
                {selectedFile ? selectedFile.name : "Pilih File Excel"}
                </label>
                {selectedFile && (
                <button onClick={() => setSelectedFile(null)}>
                    <XCircle className="w-6 h-6 text-red-500" />
                </button>
                )}
            </CardContent>
            </Card>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
            <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSaving}
            >
            Batal
            </Button>
            <Button
            onClick={handleImport}
            disabled={isSaving || !parsedRows}
            >
            {isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Import
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    );
    }
