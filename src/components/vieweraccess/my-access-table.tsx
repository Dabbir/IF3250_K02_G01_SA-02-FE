import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Masjid } from "@/types/masjid"

interface MyAccessTableProps {
  isLoading: boolean
  displayedItems: Masjid[]
}

export const MyAccessTable = ({ isLoading, displayedItems }: MyAccessTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead>Nama Masjid</TableHead>
          <TableHead>Alamat</TableHead>
          <TableHead>Tipe Akses</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              Sedang memuat data...
            </TableCell>
          </TableRow>
        ) : displayedItems.length > 0 ? (
          displayedItems.map((masjid) => (
            <TableRow key={masjid.id}>
              <TableCell className="font-medium">{masjid.nama_masjid}</TableCell>
              <TableCell>{masjid.alamat || "-"}</TableCell>
              <TableCell>Viewer</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              Anda belum memiliki akses ke masjid lain
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
