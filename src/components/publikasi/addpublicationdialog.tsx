"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_HOST_NAME

interface Publikasi {
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

interface AddPublicationDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function AddPublicationDialog({ isOpen, setIsOpen, onSuccess }: AddPublicationDialogProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [programList, setProgramList] = useState<Program[]>([]);
    const [aktivitasList, setAktivitasList] = useState<Aktivitas[]>([]);

    const [newPublikasi, setNewPublikasi] = useState<Partial<Publikasi>>({
        judul: "",
        media: "Media Online",
        perusahaan: "",
        tanggal: new Date().toISOString().split("T")[0],
        link: "",
        prValue: 0,
        nama_program: "",
        nama_aktivitas: "",
        tone: "Netral"
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "prValue") {
            const numericValue = Number(value.replace(/\D/g, "")) || 0;
            setNewPublikasi((prev) => ({ ...prev, prValue: numericValue }));
        } else {
            setNewPublikasi((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setNewPublikasi((prev) => ({ ...prev, [name]: value }));
    };

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const token = localStorage.getItem("token");
                
                // Handle missing token case
                if (!token) {
                    console.warn("Token tidak ditemukan");
                    return;
                }
                
                const response = await fetch(`${API_URL}/api/program`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (!response.ok) {
                    throw new Error(`Gagal mengambil program: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data && Array.isArray(data)) {
                    const formattedData: Program[] = data.map((item: any) => ({
                        id: item.id || "",
                        nama_program: item.nama_program || "",
                    }));
                    setProgramList(formattedData);
                }
            } catch (error) {
                console.error("Error fetching program:", error);
            }
        };

        const fetchAktivitas = async () => {
            try {
                const token = localStorage.getItem("token");
                
                if (!token) {
                    console.warn("Token tidak ditemukan");
                    return;
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
                
                if (data && data.activity && Array.isArray(data.activity)) {
                    const formattedData: Aktivitas[] = data.activity.map((item: any) => ({
                        id: item.id || "",
                        nama_aktivitas: item.nama_aktivitas || "",
                    }));
                    setAktivitasList(formattedData);
                }
            } catch (error) {
                console.error("Error fetching aktivitas:", error);
            }
        };

        if (isOpen) {
            fetchProgram();
            fetchAktivitas();
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!newPublikasi.judul) {
            newErrors.judul = "Judul publikasi wajib diisi!";
        }
        if (!newPublikasi.perusahaan) {
            newErrors.perusahaan = "Nama perusahaan media wajib diisi!";
        }
        if (!newPublikasi.tanggal) {
            newErrors.tanggal = "Tanggal publikasi wajib diisi!";
        }
        if (!newPublikasi.link) {
            newErrors.link = "Link publikasi wajib diisi!";
        } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(newPublikasi.link)) {
            newErrors.link = "Format link tidak valid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                toast.error("Token tidak ditemukan, silakan login kembali");
                return;
            }
            
            const response = await fetch(`${API_URL}/api/publikasi`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    judul_publikasi: newPublikasi.judul,
                    media_publikasi: newPublikasi.media,
                    nama_perusahaan_media: newPublikasi.perusahaan,
                    tanggal_publikasi: newPublikasi.tanggal,
                    url_publikasi: newPublikasi.link,
                    pr_value: newPublikasi.prValue,
                    nama_program: newPublikasi.nama_program || "",
                    nama_aktivitas: newPublikasi.nama_aktivitas || "",
                    tone: newPublikasi.tone || "Netral",
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan data");
            }

            toast.success("Publikasi berhasil ditambahkan!");
            
            if (onSuccess) {
                onSuccess();
            }
            
            setIsOpen(false);

        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            toast.error("Gagal menambahkan publikasi!");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setNewPublikasi({
                judul: "",
                media: "Media Online",
                perusahaan: "",
                tanggal: new Date().toISOString().split("T")[0],
                link: "",
                prValue: 0,
                nama_program: "",
                nama_aktivitas: "",
                tone: "Netral"
            });
            setErrors({});
            // Removed setImages([]) call as it's not needed
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                key={isOpen ? "open" : "closed"}
                className="max-w-[600px] max-h-[95vh] overflow-y-auto"
            >
                <DialogHeader>
                    <DialogTitle className="text-center">Tambah Publikasi</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="judul">Judul Publikasi</Label>
                        <Input
                            name="judul"
                            id="judul"
                            placeholder="Judul Publikasi"
                            value={newPublikasi.judul}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                        {errors.judul && <p className="text-red-500 text-[12px]">{errors.judul}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="media">Media Publikasi</Label>
                        <Select 
                            value={newPublikasi.media}
                            onValueChange={(value) => handleSelectChange("media", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Media Publikasi" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {["Televisi", "Koran", "Radio", "Media Online", "Sosial Media", "Lainnya"].map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_program">Program</Label>
                        <Select 
                            value={newPublikasi.nama_program || ""}
                            onValueChange={(value) => handleSelectChange("nama_program", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Program" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama_aktivitas">Aktivitas</Label>
                        <Select 
                            value={newPublikasi.nama_aktivitas || ""}
                            onValueChange={(value) => handleSelectChange("nama_aktivitas", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Aktivitas" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="perusahaan">Perusahaan Media</Label>
                        <Input
                            name="perusahaan"
                            id="perusahaan"
                            placeholder="Nama Perusahaan Media"
                            value={newPublikasi.perusahaan}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                        {errors.perusahaan && <p className="text-red-500 text-[12px]">{errors.perusahaan}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tanggal">Tanggal Publikasi</Label>
                        <Input
                            name="tanggal"
                            id="tanggal"
                            type="date"
                            value={newPublikasi.tanggal}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                        {errors.tanggal && <p className="text-red-500 text-[12px]">{errors.tanggal}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="link">Link Publikasi</Label>
                        <Input
                            name="link"
                            id="link"
                            placeholder="https://example.com/publikasi"
                            value={newPublikasi.link}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                        {errors.link && <p className="text-red-500 text-[12px]">{errors.link}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="prValue">PR Value</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-black text-sm">Rp</span>
                            <Input
                                name="prValue"
                                id="prValue"
                                type="text"
                                placeholder="100000"
                                value={newPublikasi.prValue ? newPublikasi.prValue.toLocaleString("id-ID") : ""}
                                onChange={handleInputChange}
                                className="pl-8 w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tone">Tone Publikasi</Label>
                        <Select 
                            value={newPublikasi.tone}
                            onValueChange={(value) => handleSelectChange("tone", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Tone" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                {["Positif", "Netral", "Negatif"].map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={() => setIsOpen(false)}
                        className="border-[#3A786D] text-[#3A786D]"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-[#3A786D] hover:bg-[var(--blue)] text-white"
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
}