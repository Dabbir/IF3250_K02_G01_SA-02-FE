"use client"

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";

interface Kegiatan {
    namaKegiatan: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    status: string;
    biayaImplementasi: string;
    deskripsi: string;
    dokumentasi: File[];
}

type ImageData = {
    url: string;
    file: File;
};

interface AddKegiatanDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function AddActivityDialog({ isOpen, setIsOpen }: AddKegiatanDialogProps) {
    const [newKegiatan, setNewKegiatan] = useState<Kegiatan>({
        namaKegiatan: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        status: "",
        biayaImplementasi: "",
        deskripsi: "",
        dokumentasi: [],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewKegiatan({ ...newKegiatan, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setNewKegiatan((prev) => ({ ...prev, [name]: value }));
    };

    const [programTerafiliasi, setProgramTerafiliasi] = useState("");
    const [filteredPrograms, setFilteredPrograms] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false)

    const programs = Array.from({ length: 100 }, (_, i) => `Program ${i + 1}`);

    const handleInputChangeProgram = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProgramTerafiliasi(value);
        if (value.trim() === "") {
            setFilteredPrograms([]);
        } else {
            const filtered = programs.filter((p) =>
                p.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredPrograms(filtered);
        }
        setShowDropdown(true);
    };

    const handleSelectProgram = (program: string) => {
        setProgramTerafiliasi(program);
        setShowDropdown(false);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (
            !inputRef.current?.contains(e.relatedTarget) &&
            !dropdownRef.current?.contains(e.relatedTarget)
        ) {
            setShowDropdown(false);
        }
    };

    const [images, setImages] = useState<ImageData[]>([]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newImages: ImageData[] = files.map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("Data yang dikirim:", newKegiatan);

            setNewKegiatan({
                namaKegiatan: "",
                tanggalMulai: "",
                tanggalSelesai: "",
                status: "",
                biayaImplementasi: "",
                deskripsi: "",
                dokumentasi: [],
            });
            setImages([]);
            setProgramTerafiliasi("");
            setIsOpen(false);
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
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
                    <div className="space-y-2">
                        <Label htmlFor="namaKegiatan">Nama Kegiatan</Label>
                        <Input
                            name="namaKegiatan"
                            id="namaKegiatan"
                            placeholder="Nama Kegiatan"
                            value={newKegiatan.namaKegiatan}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    <div className="relative space-y-2" onBlur={handleBlur}>
                        <Label htmlFor="programTerafiliasi">Program Terafiliasi</Label>
                        <Input
                            id="programTerafiliasi"
                            ref={inputRef}
                            value={programTerafiliasi}
                            onChange={handleInputChangeProgram}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Ketik untuk mencari..."
                            className="w-full"
                        />

                        {showDropdown && (
                            <div
                                ref={dropdownRef}
                                className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-auto"
                            >
                                {filteredPrograms.length > 0 ? (
                                    filteredPrograms.map((program) => (
                                        <div
                                            key={program}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSelectProgram(program)}
                                        >
                                            {program}
                                        </div>
                                    ))
                                ) : (
                                    programs.map((program) => (
                                        <div
                                            key={program}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSelectProgram(program)}
                                        >
                                            {program}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-left space-x-5">
                        <div className="space-y-2 width-full">
                            <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
                            <Input
                                name="tanggalMulai"
                                id="tanggalMulai"
                                type="date"
                                value={newKegiatan.tanggalMulai}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tanggalSelesai">Tanggal Selesai</Label>
                            <Input
                                name="tanggalSelesai"
                                id="tanggalSelesai"
                                type="date"
                                value={newKegiatan.tanggalSelesai}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="biayaImplementasi">Biaya Implementasi</Label>
                        <div className="flex items-center space-x-2">
                            <span>
                                Rp.
                            </span>
                            <Input
                                name="biayaImplementasi"
                                id="biayaImplementasi"
                                type="number"
                                placeholder="100000"
                                value={newKegiatan.biayaImplementasi}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            name="status"
                            onValueChange={(value) => handleSelectChange("status", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectItem value="Unstarted">Unstarted</SelectItem>
                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                <SelectItem value="Finished">Finished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Textarea
                            name="deskripsi"
                            id="deskripsi"
                            placeholder="Deskripsi kegiatan..."
                            value={newKegiatan.deskripsi}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dokumentasi">Upload Dokumentasi</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50">
                            <input
                                id="dokumentasi"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="dokumentasi"
                                className="text-gray-600"
                            >
                                <div className="mb-3 text-[var(--green)] flex items-center justify-center space-x-2 text-[12px] cursor-pointer transition-transform duration-200 hover:scale-105 hover:text-blue-900">
                                    <Upload className="h-4 w-4" />
                                    <span>Klik untuk mengunggah dokumentasi!</span>
                                </div>
                            </label>

                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={img.url}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <Button
                                                size="icon"
                                                className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Mencegah klik dari memicu input file
                                                    removeImage(index);
                                                }}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button className="border-[var(--green)] text-[var(--green)] px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-[var(--green)] hover:bg-[var(--blue)] text-white px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
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
}
