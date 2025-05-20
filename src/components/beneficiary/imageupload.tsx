import { Button } from "@/components/ui/button";
import { Building, Upload, X } from "lucide-react";
import type { Beneficiary, ValidationErrors } from "@/types/beneficiary";

interface ImageUploadProps {
  beneficiary: Beneficiary | null;
  editedBeneficiary: Beneficiary | null;
  isEditing: boolean;
  isNewBeneficiary: boolean;
  imagePreview: string | null;
  fieldErrors: ValidationErrors;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export default function ImageUpload({
  beneficiary,
  editedBeneficiary,
  isEditing,
  isNewBeneficiary,
  imagePreview,
  fieldErrors,
  fileInputRef,
  onImageChange,
  onRemoveImage,
}: ImageUploadProps) {
  if (!isEditing) {
    return (
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="font-medium text-lg mb-4">Foto Instansi/Lembaga</h3>
        <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-md overflow-hidden">
          {beneficiary?.foto ? (
            <img
              src={beneficiary.foto}
              alt={beneficiary.nama_instansi}
              className="w-full h-full object-contain"
            />
          ) : (
            <Building className="h-16 w-16 text-slate-300" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="font-medium text-lg mb-4">Foto Instansi/Lembaga</h3>
      
      {isNewBeneficiary ? (
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
      ) : (
        <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
          {(imagePreview || editedBeneficiary?.foto) ? (
            <div className="relative">
              <div className="aspect-video bg-white rounded-md overflow-hidden mb-3">
                <img
                  src={imagePreview || editedBeneficiary?.foto}
                  alt={editedBeneficiary?.nama_instansi}
                  className="w-full h-full object-contain"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemoveImage}
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
                onChange={onImageChange}
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
          
          {fieldErrors.foto && (
            <p className="text-red-500 text-sm mt-2">{fieldErrors.foto}</p>
          )}
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Format yang didukung: JPG, PNG, WEBP, GIF. Ukuran maksimal: 2MB
          </p>
        </div>
      )}

      {isNewBeneficiary && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg, image/png, image/gif, image/webp"
            onChange={onImageChange}
            className="hidden"
            id="foto-upload"
          />
          
          <div className="flex gap-2">
            <label
              htmlFor="foto-upload"
              className="bg-[#3A786D] cursor-pointer inline-flex items-center px-4 py-2 text-white rounded-md hover:bg-opacity-90"
            >
              <Upload className="h-4 w-4 mr-2" /> Upload Foto
            </label>
            
            {imagePreview && (
              <Button
                variant="outline"
                size="default"
                onClick={onRemoveImage}
                className="text-red-500 border-red-200"
              >
                <X className="h-4 w-4 mr-2" /> Hapus
              </Button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Format: JPG, PNG, WEBP, GIF. Ukuran maksimal: 2MB
          </p>
        </div>
      )}
    </div>
  );
}