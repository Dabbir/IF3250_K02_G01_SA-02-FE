"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_HOST_NAME

interface Kegiatan {
    namaKegiatan: string;
    programTerafiliasi: string;
    idProgram: number;
    tanggalMulai: string;
    tanggalSelesai: string;
    status: string;
    biayaImplementasi: string;
    deskripsi: string;
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
    const [isSaving, setIsSaving] = useState(false);

    const [newKegiatan, setNewKegiatan] = useState<Kegiatan>({
        namaKegiatan: "",
        programTerafiliasi: "",
        idProgram: 0,
        tanggalMulai: "",
        tanggalSelesai: "",
        status: "",
        biayaImplementasi: "",
        deskripsi: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewKegiatan({ ...newKegiatan, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setNewKegiatan((prev) => ({ ...prev, [name]: value }));
    };

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [filteredPrograms, setFilteredPrograms] = useState<{ id: number; nama_program: string }[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [programs, setPrograms] = useState<{ id: number; nama_program: string }[]>([]);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/api/activity/idprogram`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Gagal mengambil data program");

                const data = await response.json();
                setPrograms(data.idProgram);
            } catch (error) {
                console.error(error);
            }
        };

        if (isOpen) fetchPrograms();
    }, [isOpen]);

    const handleInputChangeProgram = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewKegiatan({ ...newKegiatan, programTerafiliasi: value });
        setShowDropdown(true);
        setFilteredPrograms(programs.filter(p => p.nama_program.toLowerCase().includes(value.toLowerCase())));
    };

    const handleSelectProgram = (program: { id: number; nama_program: string }) => {
        setNewKegiatan((prev) => ({ ...prev, programTerafiliasi: program.nama_program, idProgram: program.id }));
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

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!newKegiatan.namaKegiatan) {
            newErrors.namaKegiatan = "Nama kegiatan wajib diisi!";
        }
        if (!newKegiatan.programTerafiliasi || !programs.some(p => p.nama_program === newKegiatan.programTerafiliasi)) {
            newErrors.programTerafiliasi = "Pilih program dari daftar!";
        }
        if (!newKegiatan.tanggalMulai || !newKegiatan.tanggalSelesai) {
            newErrors.tanggal = "Tanggal mulai dan selesai wajib diisi!";
        }
        if (!newKegiatan.status) {
            newErrors.status = "Status wajib dipilih";
        }
        if (!newKegiatan.biayaImplementasi || parseInt(newKegiatan.biayaImplementasi) < 0) {
            newErrors.biayaImplementasi = "Biaya implementasi harus 0 atau lebih!";
        }
        if (!newKegiatan.deskripsi) {
            newErrors.deskripsi = "Deskripsi harus lebih dari 10 karakter!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("nama_aktivitas", newKegiatan.namaKegiatan);
            formData.append("programTerafiliasi", newKegiatan.programTerafiliasi);
            formData.append("program_id", String(newKegiatan.idProgram));
            formData.append("tanggal_mulai", newKegiatan.tanggalMulai);
            formData.append("tanggal_selesai", newKegiatan.tanggalSelesai);
            formData.append("status", newKegiatan.status);
            formData.append("biaya_implementasi", String(newKegiatan.biayaImplementasi));
            formData.append("deskripsi", newKegiatan.deskripsi);

            images.forEach((image) => {
                formData.append("dokumentasi", image.file);
            });

            console.log("Form data:", formData.get("dokumentasi"));

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/activity/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan data");
            }

            console.log("Data berhasil dikirim");

            setIsOpen(false);
            setTimeout(() => window.location.reload(), 500)

            toast.success("Kegiatan berhasil ditambahkan!")

        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            toast.error("Gagal menambahkan kegiatan!")
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setNewKegiatan({
                namaKegiatan: "",
                programTerafiliasi: "",
                idProgram: 0,
                tanggalMulai: "",
                tanggalSelesai: "",
                status: "",
                biayaImplementasi: "",
                deskripsi: "",
            });
            setErrors({});
            setImages([]);
            setPrograms([]);
            setShowDropdown(false);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                key={isOpen ? "open" : "closed"}
                className="max-w-[600px] max-h-[95vh] overflow-y-auto"
            >

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
                        {errors.namaKegiatan && <p className="text-red-500 text-[12px]">{errors.namaKegiatan}</p>}
                    </div>

                    <div className="relative space-y-2" onBlur={handleBlur}>
                        <Label htmlFor="programTerafiliasi">Program Terafiliasi</Label>
                        <Input
                            id="programTerafiliasi"
                            ref={inputRef}
                            value={newKegiatan.programTerafiliasi}
                            onChange={handleInputChangeProgram}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Pilih program"
                            className="w-full"
                        />
                        {errors.programTerafiliasi && <p className="text-red-500 text-[12px]">{errors.programTerafiliasi}</p>}

                        {showDropdown && (
                            <div
                                ref={dropdownRef}
                                className="text-[12px] absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-auto"
                            >
                                {filteredPrograms.length > 0 ? (
                                    filteredPrograms.map((program) => (
                                        <div
                                            key={program.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSelectProgram(program);
                                            }}
                                        >
                                            {program.nama_program}
                                        </div>
                                    ))
                                ) : programs.length > 0 ? (
                                    programs.map((program) => (
                                        <div
                                            key={program.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSelectProgram(program);
                                            }}
                                        >
                                            {program.nama_program}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 cursor-pointer text-gray-500">
                                        Tidak ada program
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
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
                        {errors.tanggal && <p className="text-red-500 text-[12px]">{errors.tanggal}</p>}
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
                        {errors.biayaImplementasi && <p className="text-red-500 text-[12px]">{errors.biayaImplementasi}</p>}
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
                                <SelectItem value="Belum Mulai">Belum Mulai</SelectItem>
                                <SelectItem value="Berjalan">Berjalan</SelectItem>
                                <SelectItem value="Selesai">Selesai</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-red-500 text-[12px]">{errors.status}</p>}
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
                        {errors.deskripsi && <p className="text-red-500 text-[12px]">{errors.deskripsi}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dokumentasi">Upload Dokumentasi</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50">
                            <input
                                id="dokumentasi"
                                type="file"
                                multiple
                                accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
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
                                                    e.stopPropagation();
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
