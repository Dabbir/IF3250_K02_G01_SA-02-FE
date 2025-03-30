import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface AddKegiatanDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const ExportTemplate = ({ isOpen, setIsOpen }: AddKegiatanDialogProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const generateExcel = () => {
        const data = [{
            "Nama Aktivitas": "",
            "Nama Program": "",
            "Tanggal Mulai": "",
            "Tanggal Selesai": "",
            "Biaya Implementasi": "",
            "Status": "",
            "Deskripsi": ""
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
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Kegiatan berhasil ditambahkan!");
            setIsOpen(false);
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            toast.error("Gagal menambahkan kegiatan!");
        } finally {
            setIsSaving(false);
        }
    };

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
                                {selectedFile ? selectedFile.name : "Pilih File"}
                            </label>
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
