import React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface Employee {
    id: string;
    nama: string;
    telepon: string;
    alamat: string;
    email: string;
    foto: string;
    masjid_id: string;
    masjid_nama?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

interface EmployeeDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    newEmployee: Partial<Employee>;
    setNewEmployee: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
    onSubmit: () => Promise<void>;
    submitting: boolean;
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
    isOpen,
    setIsOpen,
    newEmployee,
    setNewEmployee,
    onSubmit,
    submitting,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{
        nama?: string;
        email?: string;
        telepon?: string;
    }>({});

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({ ...prev, [name]: value }));
        
        if (errors[name as keyof typeof errors]) {
          setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error("Ukuran foto tidak boleh lebih dari 2MB");
                return;
            }
            setSelectedFile(file);
        }
    };

    const validateForm = () => {
        const newErrors: {
          nama?: string;
          email?: string;
          telepon?: string;
        } = {};
        
        if (!newEmployee.nama || newEmployee.nama.trim() === "") {
          newErrors.nama = "Nama wajib diisi";
        }

        if (!newEmployee.email || newEmployee.email.trim() === "") {
          newErrors.email = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)) {
          newErrors.email = "Format email tidak valid";
        }

        if (!newEmployee.telepon || newEmployee.telepon.trim() === "") {
          newErrors.telepon = "Telepon wajib diisi";
        } else if (!/^\d+$/.test(newEmployee.telepon)) {
          newErrors.telepon = "Telepon harus berupa angka";
        } else if (
          newEmployee.telepon.length < 10 ||
          newEmployee.telepon.length > 15
        ) {
          newErrors.telepon = "Nomor telepon harus berupa angka (10-15 digit)";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async () => {
        if (validateForm()) {
          await onSubmit();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        Tambah Karyawan
                    </DialogTitle>
                </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nama">
                                Nama<span className="text-red-500 ml-0.5">*</span>
                            </Label>
                            <Input
                                id="nama"
                                name="nama"
                                placeholder="Nama Karyawan"
                                value={newEmployee.nama || ""}
                                onChange={handleInputChange}
                            />
                            {errors.nama && (
                            <p className="text-red-500 text-sm">{errors.nama}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                Email<span className="text-red-500 ml-0.5">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={newEmployee.email || ""}
                                onChange={handleInputChange}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="telepon">
                                Telepon<span className="text-red-500 ml-0.5">*</span>
                            </Label>
                            <Input
                                id="telepon"
                                name="telepon"
                                placeholder="Telepon"
                                value={newEmployee.telepon || ""}
                                onChange={handleInputChange}
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                            {errors.telepon && (
                                <p className="text-red-500 text-sm">{errors.telepon}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Textarea
                            id="alamat"
                            name="alamat"
                            placeholder="Alamat"
                            rows={3}
                            value={newEmployee.alamat || ""}
                            onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="foto">Foto Profil</Label>
                            <Input
                            id="foto"
                            name="foto"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            />

                            {selectedFile && (
                            <p className="text-sm text-green-600">
                                File dipilih: {selectedFile.name}
                            </p>
                            )}

                            {newEmployee.foto && !selectedFile && (
                            <div className="flex items-center gap-2">
                                <img
                                src={newEmployee.foto}
                                alt="Current profile"
                                className="w-10 h-10 rounded-full object-cover"
                                />
                                <p className="text-sm text-gray-600">Foto profil saat ini</p>
                            </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={submitting}
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-[#3A786D] text-white"
                            onClick={handleFormSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                            ) : (
                                "Simpan"
                            )}
                        </Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmployeeDialog;