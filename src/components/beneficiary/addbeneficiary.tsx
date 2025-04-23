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
import { Upload, X, Building } from "lucide-react";

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof BeneficiaryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    if (!formData.nama_instansi) {
      toast.error("Nama instansi harus diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("nama_instansi", formData.nama_instansi);
      formDataToSend.append("nama_kontak", formData.nama_kontak || "");
      formDataToSend.append("alamat", formData.alamat || "");
      formDataToSend.append("telepon", formData.telepon || "");
      formDataToSend.append("email", formData.email || "");
      
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create beneficiary: ${response.status}`);
      }

      const result = await response.json();

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
      toast.error(error instanceof Error ? error.message : "Gagal menambahkan penerima manfaat!");
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
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                placeholder="Nama instansi/lembaga"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nama_kontak" className="text-sm font-medium">
                Nama Kontak Personil
              </label>
              <Input
                id="nama_kontak"
                value={formData.nama_kontak}
                onChange={(e) => handleChange("nama_kontak", e.target.value)}
                placeholder="Nama kontak personil"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="telepon" className="text-sm font-medium">
                  Nomor Telepon
                </label>
                <Input
                  id="telepon"
                  type="tel"
                  value={formData.telepon}
                  onChange={(e) => handleChange("telepon", e.target.value)}
                  placeholder="Nomor telepon"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email kontak"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="alamat" className="text-sm font-medium">
                Alamat
              </label>
              <Textarea
                id="alamat"
                value={formData.alamat}
                onChange={(e) => handleChange("alamat", e.target.value)}
                placeholder="Alamat lengkap"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Foto Instansi/Lembaga
              </label>
              
              <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-md overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="h-16 w-16 text-slate-300" />
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
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
                  className="bg-[#3A786D] cursor-pointer inline-flex items-center px-4 py-2 text-white rounded-md hover:bg-opacity-90"
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Foto
                </label>
                
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={handleRemoveImage}
                    className="text-red-500 border-red-200"
                  >
                    <X className="h-4 w-4 mr-2" /> Hapus
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                Format: JPG, PNG, WEBP, GIF. Ukuran maksimal: 2MB
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button 
              type="submit" 
              className="bg-[#3A786D] hover:bg-[#2d6055]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}