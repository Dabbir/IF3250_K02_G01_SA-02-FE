import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2, Upload, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface AddKegiatanDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

interface KegiatanData {
    nama_aktivitas: string,
    tanggal_mulai: string,
    tanggal_selesai: string,
    biaya_implementasi: string,
    status: string,
    deskripsi: string
}

const ExportTemplate = ({ isOpen, setIsOpen }: AddKegiatanDialogProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [extractedData, setExtractedData] = useState<KegiatanData[] | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const generateExcel = () => {
        const data = [{
            nama_aktivitas: "",
            tanggal_mulai: "",
            tanggal_selesai: "",
            biaya_implementasi: "",
            status: "",
            deskripsi: ""
        }];

        const columnWidths = [
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 15 },
            { wch: 20 },
            { wch: 15 },
            { wch: 30 }
        ];

        const worksheet = XLSX.utils.json_to_sheet(data);
        worksheet['!cols'] = columnWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template Kegiatan");

        XLSX.writeFile(workbook, "Template_Kegiatan.xlsx");
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            setSelectedFile(null);
            setExtractedData(null);

            setTimeout(() => {
                setSelectedFile(file);

                const reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = (e) => {
                    const binaryStr = e.target?.result;
                    const workbook = XLSX.read(binaryStr, { type: "binary" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json<KegiatanData>(worksheet);

                    console.log("Data yang akan dikirim ke backend:", jsonData);
                    setExtractedData(jsonData);
                };
            }, 0);

            event.target.value = "";
        }
    };


    const handleRemoveFile = () => {
        setSelectedFile(null);
        setExtractedData(null);
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication token not found");

            console.log(extractedData);
            const response = await fetch(`${API_URL}/api/activity/add/sheet`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ data: extractedData }),
            });

            if (!response.ok) throw new Error("Gagal menyimpan data");

            toast.success("Kegiatan berhasil ditambahkan!");
            setIsOpen(false);

            setTimeout(() => window.location.reload(), 500)
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Gagal menambahkan kegiatan!");
            toast.error("Pastikan input pada Xlsx benar!");
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
                    <DialogTitle className="text-center">Tambah Kegiatan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Button onClick={generateExcel} className="bg-[var(--green)] hover:bg-[var(--blue)] hover:scale-95 text-white">
                        Download Template
                    </Button>
                    <Card className="p-4 border border-gray-300 rounded-lg transition-transform duration-200 hover:scale-95 active:scale-90">
                        <CardContent className="flex flex-col items-center justify-center gap-2">
                            <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer text-[var(--green)] transition-colors duration-200 hover:[var(--blue)] flex flex-col items-center justify-center gap-2"
                            >
                                <Upload className="h-7 w-7 text-gray-500 transition-transform duration-200 hover:scale-105 active:scale-95" />
                                {!selectedFile && "Pilih File"}
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
                    <Button variant="outline" onClick={() => setIsOpen(false)} className="text-[var(--green)] border-[var(--green)] hover:scale-95">
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-[var(--green)] hover:bg-[var(--blue)] hover:scale-95 text-white"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Simpan"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ExportTemplate;
