"use client"

import { useEffect, useRef, useState } from "react";
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
    media: string;
    perusahaan: string;
    tanggal: string;
    link: string;
    prValue: number;
    id_program?: number;
    nama_program?: string;
    id_aktivitas?: number;
    nama_aktivitas?: string;
    tone: string;
}

interface Program {
    id: number;
    nama_program: string;
}

interface Aktivitas {
    id: number;
    nama_aktivitas: string;
}

interface AddPublicationDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function AddPublicationDialog({ isOpen, setIsOpen, onSuccess }: AddPublicationDialogProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const inputRefProgram = useRef<HTMLInputElement>(null);
    const dropdownRefProgram = useRef<HTMLDivElement>(null);
    const [filteredProgram, setFilteredProgram] = useState<Program[]>([]);
    const [showDropdownProgram, setShowDropdownProgram] = useState(false);
    const [programs, setPrograms] = useState<Program[]>([]);

    const inputRefAktivitas = useRef<HTMLInputElement>(null);
    const dropdownRefAktivitas = useRef<HTMLDivElement>(null);
    const [filteredAktivitas, setFilteredAktivitas] = useState<Aktivitas[]>([]);
    const [showDropdownAktivitas, setShowDropdownAktivitas] = useState(false);
    const [aktivitasList, setAktivitasList] = useState<Aktivitas[]>([]);

    const [newPublikasi, setNewPublikasi] = useState<Partial<Publikasi>>({
        judul: "",
        media: "",
        perusahaan: "",
        tanggal: "",
        link: "",
        prValue: 0,
        id_program: 0,
        nama_program: "",
        id_aktivitas: 0,
        nama_aktivitas: "",
        tone: ""
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


    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const token = localStorage.getItem("token");

                // Handle missing token case
                if (!token) {
                    console.warn("Token tidak ditemukan");
                    return;
                }

                const response = await fetch(`${API_URL}/api/activity/idprogram`, {
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
                setPrograms(data.idProgram);
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

                const response = await fetch(`${API_URL}/api/activity/idactivity`, {
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
                setAktivitasList(data.idAktivitas || []);
            } catch (error) {
                console.error("Error fetching aktivitas:", error);
            }
        };

        if (isOpen) {
            fetchProgram();
            fetchAktivitas();
        }
    }, [isOpen]);

    const handleInputChangeProgram = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPublikasi({ ...newPublikasi, nama_program: value });
        setShowDropdownProgram(true);
        setFilteredProgram(programs.filter(p => p.nama_program.toLowerCase().includes(value.toLowerCase())));
    };

    const handleSelectProgram = (program: Program) => {
        setNewPublikasi((prev) => ({ ...prev, nama_program: program.nama_program, id_program: program.id }));
        setShowDropdownProgram(false);
    };

    const handleBlurProgram = (e: React.FocusEvent<HTMLDivElement>) => {
        if (
            !inputRefProgram.current?.contains(e.relatedTarget) &&
            !dropdownRefProgram.current?.contains(e.relatedTarget)
        ) {
            setShowDropdownProgram(false);
        }
    };

    const handleInputChangeActivity = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPublikasi({ ...newPublikasi, nama_aktivitas: value });
        setShowDropdownAktivitas(true);
        setFilteredAktivitas(aktivitasList.filter(p => p.nama_aktivitas.toLowerCase().includes(value.toLowerCase())));
    };

    const handleSelectActivity = (aktivitas: Aktivitas) => {
        setNewPublikasi((prev) => ({ ...prev, nama_aktivitas: aktivitas.nama_aktivitas, id_aktivitas: aktivitas.id }));
        setShowDropdownAktivitas(false);
    };

    const handleBlurAktivitas = (e: React.FocusEvent<HTMLDivElement>) => {
        if (
            !inputRefAktivitas.current?.contains(e.relatedTarget) &&
            !dropdownRefAktivitas.current?.contains(e.relatedTarget)
        ) {
            setShowDropdownAktivitas(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!newPublikasi.judul) {
            newErrors.judul = "Judul publikasi wajib diisi!";
        }
        if (!newPublikasi.nama_program || !programs.some(p => p.nama_program === newPublikasi.nama_program)) {
            newErrors.namaProgram = "Pilih program dari daftar!";
        }
        if (!newPublikasi.nama_aktivitas || !aktivitasList.some(p => p.nama_aktivitas === newPublikasi.nama_aktivitas)) {
            newErrors.namaAktivitas = "Pilih aktivitas dari daftar!";
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
        if (!newPublikasi.prValue) {
            newErrors.prValue = "PR Value publikasi wajib diisi!";
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
                    media_publikasi: newPublikasi.media || "Media Online",
                    nama_perusahaan_media: newPublikasi.perusahaan,
                    tanggal_publikasi: newPublikasi.tanggal,
                    url_publikasi: newPublikasi.link,
                    pr_value: newPublikasi.prValue,
                    program_id: newPublikasi.id_program || "",
                    aktivitas_id: newPublikasi.id_aktivitas || "",
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
                media: "",
                perusahaan: "",
                tanggal: "",
                link: "",
                prValue: 0,
                id_program: 0,
                nama_program: "",
                id_aktivitas: 0,
                nama_aktivitas: "",
                tone: ""
            });
            setErrors({});
            setPrograms([]);
            setAktivitasList([]);
            setShowDropdownProgram(false);
            setShowDropdownAktivitas(false);
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

                    <div className="relative space-y-2" onBlur={handleBlurProgram}>
                        <Label htmlFor="program">Nama Program</Label>
                        <Input
                            id="program"
                            ref={inputRefProgram}
                            value={newPublikasi.nama_program || ""}
                            onChange={handleInputChangeProgram}
                            onFocus={() => setShowDropdownProgram(true)}
                            placeholder="Pilih program"
                            className="w-full"
                        />
                        {errors.namaProgram && <p className="text-red-500 text-[12px]">{errors.namaProgram}</p>}

                        {showDropdownProgram && (
                            <div
                                ref={dropdownRefProgram}
                                className="text-s absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-auto"
                            >
                                {filteredProgram.length > 0 ? (
                                    filteredProgram.map((program) => (
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

                    <div className="relative space-y-2" onBlur={handleBlurAktivitas}>
                        <Label htmlFor="aktivitas">Nama Aktivitas</Label>
                        <Input
                            id="aktivitas"
                            ref={inputRefAktivitas}
                            value={newPublikasi.nama_aktivitas || ""}
                            onChange={handleInputChangeActivity}
                            onFocus={() => setShowDropdownAktivitas(true)}
                            placeholder="Pilih aktivitas"
                            className="w-full"
                        />
                        {errors.namaAktivitas && <p className="text-red-500 text-[12px]">{errors.namaAktivitas}</p>}

                        {showDropdownAktivitas && (
                            <div
                                ref={dropdownRefAktivitas}
                                className="text-s absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-auto"
                            >
                                {filteredAktivitas.length > 0 ? (
                                    filteredAktivitas.map((aktivitas) => (
                                        <div
                                            key={aktivitas.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSelectActivity(aktivitas);
                                            }}
                                        >
                                            {aktivitas.nama_aktivitas}
                                        </div>
                                    ))
                                ) : aktivitasList.length > 0 ? (
                                    aktivitasList.map((aktivitas) => (
                                        <div
                                            key={aktivitas.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSelectActivity(aktivitas);
                                            }}
                                        >
                                            {aktivitas.nama_aktivitas}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 cursor-pointer text-gray-500">
                                        Tidak ada aktivitas
                                    </div>
                                )}
                            </div>
                        )}
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
                            {errors.prValue && <p className="text-red-500 text-[12px]">{errors.prValue}</p>}
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