import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah } from "@/utils/formatters";
import { formatDate as formatDateIndonesian } from "@/utils/dateUtils";
import type { Publikasi, Program, Aktivitas, ValidationErrors } from "@/types/publication";
import { MEDIA_OPTIONS, TONE_OPTIONS } from "@/types/publication";

interface DetailTableProps {
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

export default function DetailTable({
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
}: DetailTableProps) {
  const getToneColor = (tone: string) => {
    switch (tone) {
      case "Positif":
        return "bg-green-100 text-green-800";
      case "Netral":
        return "bg-blue-100 text-blue-800";
      case "Negatif":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderField = (field: keyof ValidationErrors, content: React.ReactNode) => (
    <div className="space-y-1">
      {content}
      {isEditing && validationErrors[field] && (
        <p className="text-sm text-red-600">{validationErrors[field]}</p>
      )}
    </div>
  );

  return (
    <Table className="border rounded-lg overflow-hidden mb-2">
      <TableBody>
        <TableRow>
          <TableHead className="w-1/4">Judul Publikasi</TableHead>
          <TableCell>
            {renderField("judul", 
              isEditing ? (
                <Input
                  value={editedPublikasi?.judul || ""}
                  onChange={(e) => onChange("judul", e.target.value)}
                  className={`w-full ${validationErrors.judul ? 'border-red-500' : ''}`}
                />
              ) : (
                publikasi.judul
              )
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Media Publikasi</TableHead>
          <TableCell>
            {renderField("media",
              isEditing ? (
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
                </Select>
              ) : (
                publikasi.media
              )
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Perusahaan Media</TableHead>
          <TableCell>
            {renderField("perusahaan",
              isEditing ? (
                <Input
                  value={editedPublikasi?.perusahaan || ""}
                  onChange={(e) => onChange("perusahaan", e.target.value)}
                  className={`w-full ${validationErrors.perusahaan ? 'border-red-500' : ''}`}
                />
              ) : (
                publikasi.perusahaan
              )
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Tanggal Publikasi</TableHead>
          <TableCell>
            {renderField("tanggal",
              isEditing ? (
                <Input
                  type="date"
                  value={
                    editedPublikasi?.tanggal
                      ? new Date(editedPublikasi.tanggal).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => onChange("tanggal", e.target.value)}
                  className={`w-full ${validationErrors.tanggal ? 'border-red-500' : ''}`}
                />
              ) : publikasi.tanggal ? (
                formatDateIndonesian(publikasi.tanggal)
              ) : (
                "N/A"
              )
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Link Publikasi</TableHead>
          <TableCell>
            {renderField("link",
              isEditing ? (
                <Input
                  value={editedPublikasi?.link || ""}
                  onChange={(e) => onChange("link", e.target.value)}
                  className={`w-full ${validationErrors.link ? 'border-red-500' : ''}`}
                />
              ) : (
                <a
                  href={publikasi.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {publikasi.link}
                </a>
              )
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>PR Value</TableHead>
          <TableCell>
            <div className="space-y-1">
              <div className="flex items-center">
                {isEditing ? (
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
                  </div>
                ) : (
                  <span>Rp{formatRupiah(publikasi.prValue)}</span>
                )}
              </div>
              {isEditing && validationErrors.prValue && (
                <p className="text-sm text-red-600">{validationErrors.prValue}</p>
              )}
            </div>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Program</TableHead>
          <TableCell>
            {isEditing ? (
              <Select
                value={editedPublikasi?.program_id || ""}
                onValueChange={onProgramSelect}
              >
                <SelectTrigger>
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
            ) : (
              publikasi.nama_program || "N/A"
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Aktivitas</TableHead>
          <TableCell>
            {isEditing ? (
              <Select
                value={editedPublikasi?.aktivitas_id || ""}
                onValueChange={onActivitySelect}
              >
                <SelectTrigger>
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
            ) : (
              publikasi.nama_aktivitas || "N/A"
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableHead>Tone</TableHead>
          <TableCell>
            {renderField("tone",
              isEditing ? (
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
                </Select>
              ) : (
                <span className={`px-2 py-1 rounded-full text-xs ${getToneColor(publikasi.tone)}`}>
                  {publikasi.tone}
                </span>
              )
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}