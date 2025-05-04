"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const API_URL = import.meta.env.VITE_HOST_NAME

interface Stakeholder {
    id: string;
    nama_stakeholder: string;
    jenis: string;
    telepon: string;
    email: string;
    foto: string;
    masjid_id: string;
    created_by: string;
}

interface AddStakeholderDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function AddStakeholderDialog({ isOpen, setIsOpen }: AddStakeholderDialogProps) {
    const [isSaving, setIsSaving] = useState(false);

    const [newStakeholder, setNewStakeholder] = useState<Stakeholder>({
        id: "",
        nama_stakeholder: "",
        jenis: "",
        telepon: "",
        email: "",
        foto: "",
        masjid_id: "",
        created_by: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewStakeholder({ ...newStakeholder, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setNewStakeholder((prev) => ({ ...prev, [name]: value }));
    };

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!newStakeholder.nama_stakeholder) {
            newErrors.nama_stakeholder = "Nama pemangku kepentingan wajib diisi!";
        }
        if (!newStakeholder.jenis) {
            newErrors.jenis = "Jenis pemangku kepentingan wajib diisi!";
        }
        if (!newStakeholder.telepon || newStakeholder.telepon.trim() === "") {
            newErrors.telepon = "Telepon wajib diisi!";
        } else if (!/^\d{10,15}$/.test(newStakeholder.telepon)) {
            newErrors.telepon = "Nomor telepon harus berupa angka (10-15 digit)!";
        }
        if (!newStakeholder.email.trim()) {
            newErrors.email = "Email tidak boleh kosong!";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStakeholder.email)) {
            newErrors.email = "Format email tidak valid!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const body = {
                nama_stakeholder: newStakeholder.nama_stakeholder,
                jenis: newStakeholder.jenis,
                telepon: newStakeholder.telepon,
                email: newStakeholder.email,
            };            

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/stakeholder/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan data");
            }

            console.log("Data berhasil dikirim");

            setIsOpen(false);
            setTimeout(() => window.location.reload(), 500)

            toast.success("Pemangku kepentingan berhasil ditambahkan!")

        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            toast.error("Gagal menambahkan pemangku kepentingan!")
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setNewStakeholder({
                id: "",
                nama_stakeholder: "",
                jenis: "",
                telepon: "",
                email: "",
                foto: "",
                masjid_id: "",
                created_by: "",
            });
            setErrors({});
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                key={isOpen ? "open" : "closed"}
                className="max-w-[600px] max-h-[95vh] overflow-y-auto"
            >

                <DialogHeader>
                    <DialogTitle className="text-center">Tambah Pemangku Kepentingan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama_stakeholder">Nama Pemangku Kepentingan</Label>
                        <Input
                            name="nama_stakeholder"
                            id="nama_stakeholder"
                            placeholder="Nama Pemangku Kepentingan"
                            value={newStakeholder.nama_stakeholder}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                        {errors.nama_stakeholder && <p className="text-red-500 text-[12px]">{errors.nama_stakeholder}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jenis">Jenis Pemangku Kepentingan</Label>
                        <Select
                            name="jenis"
                            onValueChange={(value) => handleSelectChange("jenis", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Jenis" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectItem value="Individu">Individu</SelectItem>
                                <SelectItem value="Organisasi">Organisasi</SelectItem>
                                <SelectItem value="Perusahaan">Perusahaan</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.jenis && <p className="text-red-500 text-[12px]">{errors.jenis}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telepon">Telepon</Label>
                        <Input
                            name="telepon"
                            id="telepon"
                            placeholder="Telepon"
                            value={newStakeholder.telepon}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                        {errors.telepon && <p className="text-red-500 text-[12px]">{errors.telepon}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            name="email"
                            id="email"
                            placeholder="email@example.com"
                            value={newStakeholder.email}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                        {errors.email && <p className="text-red-500 text-[12px]">{errors.email}</p>}
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
