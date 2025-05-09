"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Users, Pencil, Trash2 } from "lucide-react"
import type { Masjid } from "@/types/masjid"
import type { User } from "@/types/user"

interface MasjidDetailsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  masjid: Masjid | null
  editors: User[]
  isLoadingEditors: boolean
  onEdit: (masjid: Masjid) => void
  onDelete: (masjid: Masjid) => void
}

export const MasjidDetailsDialog = ({
  isOpen,
  onOpenChange,
  masjid,
  editors,
  isLoadingEditors,
  onEdit,
  onDelete,
}: MasjidDetailsDialogProps) => {
  if (!masjid) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Masjid & Daftar Editor</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
              <Building className="w-10 h-10 text-gray-500" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{masjid.nama_masjid}</h3>
              <p className="text-gray-600">{masjid.alamat}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              Daftar Editor ({editors.length})
            </h4>

            {isLoadingEditors ? (
              <div className="text-center py-6">
                <p>Memuat daftar editor...</p>
              </div>
            ) : editors.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editors.map((editor) => (
                      <TableRow key={editor.id}>
                        <TableCell className="font-medium">{editor.nama}</TableCell>
                        <TableCell>{editor.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border">
                <p className="text-gray-500">Belum ada editor terdaftar untuk masjid ini</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="text-amber-600 border-amber-600 hover:bg-amber-50"
            onClick={() => {
              onOpenChange(false)
              onEdit(masjid)
            }}
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit Masjid
          </Button>
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => {
              onOpenChange(false)
              onDelete(masjid)
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Hapus Masjid
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
