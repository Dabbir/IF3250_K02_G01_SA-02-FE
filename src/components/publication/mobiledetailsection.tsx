import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Publikasi, Program, Aktivitas, ValidationErrors } from "@/types/publication";
import { MEDIA_OPTIONS, TONE_OPTIONS } from "@/types/publication";
import ToneBadge from "./tonebadge";
import { formatDate as formatDateIndonesian } from "@/utils/dateUtils";

interface MobileDetailSectionProps {
  publikasi: Publikasi;
  editedPublikasi: Publikasi | null;
  isEditing: boolean;
  programList: Program[];
  aktivitasList: Aktivitas[];
  prValueDisplay: string;
  validationErrors: ValidationErrors;
  onChange: (field: keyof Publikasi, value: string | number) => void;
  onProgramSelect: (value: string) => void;
  onActivitySelect: (value: string) => void;
}

export default function MobileDetailSection({
  publikasi,
  editedPublikasi,
  isEditing,
  programList,
  aktivitasList,
  prValueDisplay,
  validationErrors,
  onChange,
  onProgramSelect,
  onActivitySelect,
}: MobileDetailSectionProps) {
  const renderFormField = (label: string, content: React.ReactNode, fieldKey?: keyof ValidationErrors) => (
    <div className="mb-4">
      <Label className="block text-sm font-medium text-gray-700 mb-1">{label}</Label>
      {content}
      {fieldKey && validationErrors[fieldKey] && (
        <p className="mt-1 text-sm text-red-600">{validationErrors[fieldKey]}</p>
      )}
    </div>
  );

  if (isEditing) {
    return (
      <div className="md:hidden space-y-4">
        {renderFormField("Judul Publikasi", 
          <Input
            value={editedPublikasi?.judul || ""}
            onChange={(e) => onChange("judul", e.target.value)}
            className={`w-full ${validationErrors.judul ? 'border-red-500' : ''}`}
          />,
          "judul"  
        )}
        
        {renderFormField("Media Publikasi",
          <Select
            value={editedPublikasi?.media || "Media Online"}
            onValueChange={(value) => onChange("media", value)}
          >
            <SelectTrigger className={`w-full ${validationErrors.media ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Pilih Media Publikasi" />
            </SelectTrigger>
            <SelectContent>
              {MEDIA_OPTIONS.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>,
          "media"  
        )}
        
        {renderFormField("Perusahaan Media",
          <Input
            value={editedPublikasi?.perusahaan || ""}
            onChange={(e) => onChange("perusahaan", e.target.value)}
            className={`w-full ${validationErrors.perusahaan ? 'border-red-500' : ''}`}
          />,
          "perusahaan"
        )}
        
        {renderFormField("Tanggal Publikasi",
          <Input
            type="date"
            value={
              editedPublikasi?.tanggal
                ? new Date(editedPublikasi.tanggal).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => onChange("tanggal", e.target.value)}
            className={`w-full ${validationErrors.tanggal ? 'border-red-500' : ''}`}
          />,
          "tanggal"
        )}
        
        {renderFormField("Link Publikasi",
          <Input
            value={editedPublikasi?.link || ""}
            onChange={(e) => onChange("link", e.target.value)}
            className={`w-full ${validationErrors.link ? 'border-red-500' : ''}`}
          />,
          "link"
        )}
        
        {renderFormField("PR Value",
          <div className="flex items-center w-full">
            <span className="mr-1">Rp</span>
            <Input
              type="text"
              value={prValueDisplay}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                onChange("prValue", parseInt(value) || 0);
              }}
              className={`w-full ${validationErrors.prValue ? 'border-red-500' : ''}`}
              placeholder="0"
            />
          </div>,
          "prValue"
        )}
        
        {renderFormField("Program",
          <Select
            value={editedPublikasi?.program_id || ""}
            onValueChange={onProgramSelect}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Program" />
            </SelectTrigger>
            <SelectContent>
              {programList && programList.length > 0 ? (
                programList.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
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
        )}
        
        {renderFormField("Aktivitas",
          <Select
            value={editedPublikasi?.aktivitas_id || ""}
            onValueChange={onActivitySelect}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Aktivitas" />
            </SelectTrigger>
            <SelectContent>
              {aktivitasList && aktivitasList.length > 0 ? (
                aktivitasList.map((aktivitas) => (
                  <SelectItem key={aktivitas.id} value={aktivitas.id}>
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
        )}
        
        {renderFormField("Tone",
          <Select
            value={editedPublikasi?.tone || "Netral"}
            onValueChange={(value) => onChange("tone", value)}
          >
            <SelectTrigger className={`w-full ${validationErrors.tone ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Pilih Tone" />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>,
          "tone"
        )}
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-3 text-sm">
      <div className="grid grid-cols-3 gap-2 border-b pb-2">
        <div className="col-span-1 font-medium text-gray-600">Media</div>
        <div className="col-span-2">{publikasi.media}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 border-b pb-2">
        <div className="col-span-1 font-medium text-gray-600">Perusahaan</div>
        <div className="col-span-2">{publikasi.perusahaan}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 border-b pb-2">
        <div className="col-span-1 font-medium text-gray-600">Tanggal</div>
        <div className="col-span-2">{formatDateIndonesian(publikasi.tanggal)}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 border-b pb-2">
        <div className="col-span-1 font-medium text-gray-600">Link</div>
        <div className="col-span-2 break-words">
          <a href={publikasi.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {publikasi.link}
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 border-b pb-2">
        <div className="col-span-1 font-medium text-gray-600">PR Value</div>
        <div className="col-span-2">
          Rp{Math.round(publikasi.prValue).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 border-b pb-2">
        <div className="col-span-1 font-medium text-gray-600">Program</div>
        <div className="col-span-2">{publikasi.nama_program || "N/A"}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 border-b pb-2">
        <div className="col-span-1 font-medium text-gray-600">Aktivitas</div>
        <div className="col-span-2">{publikasi.nama_aktivitas || "N/A"}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 border-b pb-2">
        <div className="col-span-1 font-medium text-gray-600">Tone</div>
        <div className="col-span-2">
          <ToneBadge tone={publikasi.tone} />
        </div>
      </div>
    </div>
  );
}