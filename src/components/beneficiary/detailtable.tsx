import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import type { Beneficiary, ValidationErrors } from "@/types/beneficiary";

interface DetailTableProps {
  beneficiary: Beneficiary | null;
  editedBeneficiary: Beneficiary | null;
  isEditing: boolean;
  fieldErrors: ValidationErrors;
  onChange: (field: keyof Beneficiary, value: string) => void;
}

export default function DetailTable({
  beneficiary,
  editedBeneficiary,
  isEditing,
  fieldErrors,
  onChange,
}: DetailTableProps) {
  const renderField = (field: keyof Beneficiary, content: React.ReactNode) => (
    <div className="space-y-1">
      {content}
      {isEditing && fieldErrors[field] && (
        <p className="text-red-500 text-sm">{fieldErrors[field]}</p>
      )}
    </div>
  );

  return (
    <Table className="border rounded-lg overflow-hidden mb-2">
      <TableBody>
        <TableRow>
          <TableHead className="w-1/3">Nama Instansi</TableHead>
          <TableCell>
            {renderField("nama_instansi",
              isEditing ? (
                <Input
                  id="nama_instansi"
                  value={editedBeneficiary?.nama_instansi || ""}
                  onChange={(e) => onChange("nama_instansi", e.target.value)}
                  placeholder="Nama instansi/lembaga"
                  className={fieldErrors.nama_instansi ? "border-red-500" : ""}
                />
              ) : (
                <span>{beneficiary?.nama_instansi || "N/A"}</span>
              )
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Nama Kontak</TableHead>
          <TableCell>
            {renderField("nama_kontak",
              isEditing ? (
                <Input
                  id="nama_kontak"
                  value={editedBeneficiary?.nama_kontak || ""}
                  onChange={(e) => onChange("nama_kontak", e.target.value)}
                  placeholder="Nama kontak personil"
                  className={fieldErrors.nama_kontak ? "border-red-500" : ""}
                />
              ) : (
                <span>{beneficiary?.nama_kontak || "N/A"}</span>
              )
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableCell>
            {renderField("email",
              isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedBeneficiary?.email || ""}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="Email kontak"
                  className={fieldErrors.email ? "border-red-500" : ""}
                />
              ) : (
                <span>{beneficiary?.email || "N/A"}</span>
              )
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Telepon</TableHead>
          <TableCell>
            {renderField("telepon",
              isEditing ? (
                <Input
                  id="telepon"
                  type="tel"
                  value={editedBeneficiary?.telepon || ""}
                  onChange={(e) => onChange("telepon", e.target.value)}
                  placeholder="Nomor telepon"
                  className={fieldErrors.telepon ? "border-red-500" : ""}
                />
              ) : (
                <span>{beneficiary?.telepon || "N/A"}</span>
              )
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Alamat</TableHead>
          <TableCell>
            {renderField("alamat",
              isEditing ? (
                <Textarea
                  id="alamat"
                  value={editedBeneficiary?.alamat || ""}
                  onChange={(e) => onChange("alamat", e.target.value)}
                  placeholder="Alamat lengkap"
                  className={`min-h-[100px] ${fieldErrors.alamat ? "border-red-500" : ""}`}
                />
              ) : (
                <span className="whitespace-pre-wrap">{beneficiary?.alamat || "N/A"}</span>
              )
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}