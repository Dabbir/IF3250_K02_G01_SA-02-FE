"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Users } from "lucide-react"
import type { Masjid } from "@/types/masjid"

interface MasjidTableProps {
  masjids: Masjid[]
  isLoading: boolean
  onViewDetails: (masjid: Masjid) => void
  onEdit: (masjid: Masjid) => void
  onDelete: (masjid: Masjid) => void
}

export const MasjidTable = ({ masjids, isLoading, onViewDetails, onEdit, onDelete }: MasjidTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Nama Masjid</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Sedang memuat data...
              </TableCell>
            </TableRow>
          ) : masjids.length > 0 ? (
            masjids.map((masjid) => (
              <TableRow key={masjid.id}>
                <TableCell className="font-medium">{masjid.nama_masjid}</TableCell>
                <TableCell>{masjid.alamat}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-blue-600"
                      onClick={() => onViewDetails(masjid)}
                    >
                      <Users className="w-4 h-4 mr-1" /> Editors
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-amber-600"
                      onClick={() => onEdit(masjid)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-red-600"
                      onClick={() => onDelete(masjid)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Tidak ada data masjid
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
