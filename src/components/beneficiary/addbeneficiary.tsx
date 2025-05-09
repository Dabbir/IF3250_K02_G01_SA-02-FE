"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Upload, X, Building, Loader2 } from "lucide-react";

interface AddBeneficiaryProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess?: () => void;
}

interface BeneficiaryFormData {
  nama_instansi: string;
  nama_kontak: string;
  alamat: string;
  telepon: string;
  email: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function AddBeneficiary({ isOpen, setIsOpen, onSuccess }: AddBeneficiaryProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BeneficiaryFormData>({
    nama_instansi: "",
    nama_kontak: "",
    alamat: "",
    telepon: "",
    email: ""
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof BeneficiaryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];      
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setErrors({}); 
    
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("nama_instansi", formData.nama_instansi);
      formDataToSend.append("nama_kontak", formData.nama_kontak);
      formDataToSend.append("alamat", formData.alamat);
      formDataToSend.append("telepon", formData.telepon);
      formDataToSend.append("email", formData.email);
      
      if (selectedImage) {
        formDataToSend.append("foto", selectedImage);
      }

      const response = await fetch(`${API_URL}/api/beneficiary`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors && Array.isArray(result.errors)) {
          const errorObj: ValidationErrors = {};
          result.errors.forEach((error: ValidationError) => {
            errorObj[error.field] = error.message;
          });
          setErrors(errorObj);
          
          const firstError = result.errors[0];
          const firstErrorField = document.getElementById(firstError.field);
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorField.focus();
          }
          
        } else {
          toast.error(result.message || "Gagal menambahkan penerima manfaat!");
        }
        return;
      }

      if (result.success) {
        toast.success(result.message || "Penerima manfaat berhasil ditambahkan!");
        resetForm();
        setIsOpen(false);
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(`/penerima-manfaat/${result.data.id}`);
        }
      } else {
        throw new Error(result.message || "Failed to create beneficiary");
      }
    } catch (error) {
      console.error("Error creating beneficiary:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama_instansi: "",
      nama_kontak: "",
      alamat: "",
      telepon: "",
      email: ""
    });
    setErrors({});
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Penerima Manfaat</DialogTitle>
          <DialogDescription>
            Tambahkan instansi/lembaga penerima manfaat baru
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label htmlFor="nama_instansi" className="text-sm font-medium">
                Nama Instansi/Lembaga <span className="text-red-500">*</span>
              </label>
              <Input
                id="nama_instansi"
                value={formData.nama_instansi}
                onChange={(e) => handleChange("nama_instansi", e.target.value)}
                placeholder="Masukkan nama instansi/lembaga"
                className={errors.nama_instansi ? "border-red-500" : ""}
              />
              {errors.nama_instansi && (
                <p className="text-red-500 text-sm mt-1">{errors.nama_instansi}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="nama_kontak" className="text-sm font-medium">
                Nama Kontak Personil <span className="text-red-500">*</span>
              </label>
              <Input
                id="nama_kontak"
                value={formData.nama_kontak}
                onChange={(e) => handleChange("nama_kontak", e.target.value)}
                placeholder="Masukkan nama kontak personil"
                className={errors.nama_kontak ? "border-red-500" : ""}
              />
              {errors.nama_kontak && (
                <p className="text-red-500 text-sm mt-1">{errors.nama_kontak}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="telepon" className="text-sm font-medium">
                  Nomor Telepon <span className="text-red-500">*</span>
                </label>
                <Input
                  id="telepon"
                  type="tel"
                  value={formData.telepon}
                  onChange={(e) => handleChange("telepon", e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className={errors.telepon ? "border-red-500" : ""}
                />
                {errors.telepon && (
                  <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Contoh: kontak@instansi.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="alamat" className="text-sm font-medium">
                Alamat <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="alamat"
                value={formData.alamat}
                onChange={(e) => handleChange("alamat", e.target.value)}
                placeholder="Masukkan alamat lengkap instansi/lembaga"
                rows={3}
                className={errors.alamat ? "border-red-500" : ""}
              />
              {errors.alamat && (
                <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Foto Instansi/Lembaga (Opsional)
              </label>
              
              <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
                {imagePreview ? (
                  <div className="relative">
                    <div className="aspect-video bg-white rounded-md overflow-hidden mb-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-white hover:bg-red-50 text-red-600 border border-red-200"
                    >
                      <X className="h-4 w-4 mr-1" /> Hapus Foto
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-sm text-gray-600 mb-4">
                      Belum ada foto yang diunggah
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg, image/png, image/gif, image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="foto-upload"
                    />
                    
                    <label
                      htmlFor="foto-upload"
                      className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Pilih Foto
                    </label>
                  </div>
                )}
                
                {errors.foto && (
                  <p className="text-red-500 text-sm mt-2">{errors.foto}</p>
                )}
                
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Format yang didukung: JPG, PNG, WEBP, GIF. Ukuran maksimal: 2MB
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={isSubmitting}
              className="bg-white"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              className="bg-[#3A786D] hover:bg-[#2d6055] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Penerima Manfaat"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}