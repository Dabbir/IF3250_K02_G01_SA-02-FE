"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EyeOff } from "lucide-react"
import type { ViewerRequest } from "@/types/viewer"
import { formatDisplayDate } from "@/utils/formatters"

interface ApprovedViewersTableProps {
  isLoading: boolean
  displayedItems: ViewerRequest[]
  onRemoveAccess: (requestId: string, viewerName: string) => void
}

export const ApprovedViewersTable = ({ isLoading, displayedItems, onRemoveAccess }: ApprovedViewersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tanggal Disetujui</TableHead>
          <TableHead>Masa Berlaku</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Sedang memuat data...
            </TableCell>
          </TableRow>
        ) : displayedItems.length > 0 ? (
          displayedItems.map((viewer: ViewerRequest) => (
            <TableRow key={viewer.id}>
              <TableCell className="font-medium">{viewer.viewer_nama}</TableCell>
              <TableCell>{viewer.viewer_email}</TableCell>
              <TableCell>{formatDisplayDate(viewer.created_at)}</TableCell>
              <TableCell>{viewer.expires_at ? formatDisplayDate(viewer.expires_at) : "Tidak ada batas"}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center text-red-600"
                  onClick={() => onRemoveAccess(viewer.id, viewer.viewer_nama)}
                >
                  <EyeOff className="w-4 h-4 mr-1" /> Cabut Akses
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Tidak ada viewer yang disetujui
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
