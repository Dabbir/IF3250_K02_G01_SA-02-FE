import React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, User } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
    isOpen,
    setIsOpen,
    newEmployee,
    setNewEmployee,
    onSubmit,
    submitting,
    selectedFile,
    setSelectedFile
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
            <DialogContent className="w-[95vw] max-w-md md:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl">
                        Tambah Karyawan
                    </DialogTitle>
                </DialogHeader>
                    <div className="grid gap-3 md:gap-4 py-2 md:py-4">
                        <div className="grid gap-1 md:gap-2">
                            <Label htmlFor="nama" className="text-sm font-medium">
                                Nama<span className="text-red-500 ml-0.5">*</span>
                            </Label>
                            <Input
                                id="nama"
                                name="nama"
                                placeholder="Nama Karyawan"
                                value={newEmployee.nama || ""}
                                onChange={handleInputChange}
                                className="text-sm md:text-base"
                            />
                            {errors.nama && (
                            <p className="text-red-500 text-xs md:text-sm">{errors.nama}</p>
                            )}
                        </div>

                        <div className="grid gap-1 md:gap-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email<span className="text-red-500 ml-0.5">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={newEmployee.email || ""}
                                onChange={handleInputChange}
                                className="text-sm md:text-base"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs md:text-sm">{errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-1 md:gap-2">
                            <Label htmlFor="telepon" className="text-sm font-medium">
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
                                className="text-sm md:text-base"
                            />
                            {errors.telepon && (
                                <p className="text-red-500 text-xs md:text-sm">{errors.telepon}</p>
                            )}
                        </div>

                        <div className="grid gap-1 md:gap-2">
                            <Label htmlFor="alamat" className="text-sm font-medium">Alamat</Label>
                            <Textarea
                            id="alamat"
                            name="alamat"
                            placeholder="Alamat"
                            rows={3}
                            value={newEmployee.alamat || ""}
                            onChange={handleInputChange}
                            className="text-sm md:text-base resize-none"
                            />
                        </div>

                        <div className="grid gap-1 md:gap-2">
                            <Label className="text-sm font-medium">
                                Foto Profil (Opsional)
                            </Label>
                            
                            <div className="relative border border-gray-200 rounded-lg p-3 md:p-4 bg-gray-50">
                                {imagePreview || newEmployee.foto ? (
                                    <div className="relative">
                                        <div className="aspect-video bg-white rounded-md overflow-hidden mb-2 md:mb-3">
                                            <img
                                                src={imagePreview || newEmployee.foto}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemoveImage}
                                            className="absolute top-1 right-1 md:top-2 md:right-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 h-8 w-8 md:h-auto md:w-auto p-1 md:p-2"
                                        >
                                            <X className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
                                            <span className="hidden md:inline">Hapus Foto</span>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 md:py-8">
                                        <User className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-2 md:mb-3" />
                                        <div className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                                            Belum ada foto yang diunggah
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/jpeg, image/png, image/gif, image/webp"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="foto-upload"
                                        />
                                        
                                        <label
                                            htmlFor="foto-upload"
                                            className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                                        >
                                            <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                            Pilih Foto
                                        </label>
                                    </div>
                                )}
                                
                                <p className="text-xs text-gray-500 mt-2 md:mt-3 text-center leading-tight">
                                    Format yang didukung: JPG, PNG, WEBP, GIF.<br className="md:hidden" />
                                    <span className="md:inline"> Ukuran maksimal: 2MB</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={submitting}
                            className="w-full sm:w-auto"
                        >
                            Batal
                        </Button>
                        <Button
                            className="bg-[#3A786D] text-white w-full sm:w-auto"
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