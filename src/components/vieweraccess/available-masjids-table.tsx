"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { Masjid } from "@/types/masjid"

interface AvailableMasjidsTableProps {
  isLoading: boolean
  displayedItems: Masjid[]
  onRequestAccess: (masjidId: string, masjidName: string) => void
}

export const AvailableMasjidsTable = ({ isLoading, displayedItems, onRequestAccess }: AvailableMasjidsTableProps) => {
  return (
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
            <TableCell colSpan={3} className="text-center py-4">
              Sedang memuat data...
            </TableCell>
          </TableRow>
        ) : displayedItems.length > 0 ? (
          displayedItems.map((masjid: Masjid) => (
            <TableRow key={masjid.id}>
              <TableCell className="font-medium">{masjid.nama_masjid}</TableCell>
              <TableCell>{masjid.alamat || "-"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center text-blue-600"
                  onClick={() => onRequestAccess(String(masjid.id), masjid.nama_masjid)}
                >
                  <Eye className="w-4 h-4 mr-1" /> Minta Akses
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              Tidak ada masjid yang tersedia untuk diminta aksesnya
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
