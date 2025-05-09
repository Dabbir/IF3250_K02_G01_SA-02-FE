"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, UserX } from "lucide-react"
import type { User } from "@/types/user"
import { formatDisplayDate } from "@/utils/formatters"

interface UserDetailsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onApprove: (user: User) => void
  onReject: (user: User) => void
}

export const UserDetailsDialog = ({ isOpen, onOpenChange, user, onApprove, onReject }: UserDetailsDialogProps) => {
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Editor</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {user.foto_profil ? (
                <img
                  src={user.foto_profil || "/placeholder.svg"}
                  alt={user.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                  {user.nama.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user.nama}</h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  className={
                    user.status === "Approved"
                      ? "bg-green-500"
                      : user.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-amber-500"
                  }
                >
                  {user.status === "Approved" ? "Disetujui" : user.status === "Rejected" ? "Ditolak" : "Pending"}
                </Badge>
                <Badge className="bg-blue-500">{user.peran}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="font-medium text-gray-700">Masjid</h4>
              <p>{user.nama_masjid || "-"}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Tanggal Daftar</h4>
              <p>{formatDisplayDate(user.created_at)}</p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-medium text-gray-700">Bio Singkat</h4>
            <p className="text-gray-600">{user.short_bio || "-"}</p>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-medium text-gray-700">Alasan Bergabung</h4>
            <p className="text-gray-600">{user.alasan_bergabung || "-"}</p>
          </div>

          {user.dokumen_file_name && (
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-medium text-gray-700">Dokumen Pendaftaran</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-gray-600">{user.dokumen_file_name}</p>
                  <p className="text-sm text-gray-500">{user.dokumen_file_type}</p>
                </div>
                <div className="flex gap-2">
                  {user.dokumen_pendaftaran && (
                    <Button variant="outline" size="sm" onClick={() => window.open(user.dokumen_pendaftaran, "_blank")}>
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {user.status === "Pending" && (
            <>
              <Button
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => onReject(user)}
              >
                <UserX className="w-4 h-4 mr-2" /> Tolak
              </Button>
              <Button className="bg-[#3A786D] text-white" onClick={() => onApprove(user)}>
                <UserCheck className="w-4 h-4 mr-2" /> Setujui
              </Button>
            </>
          )}

          {user.status === "Rejected" && (
            <Button className="bg-[#3A786D] text-white" onClick={() => onApprove(user)}>
              <UserCheck className="w-4 h-4 mr-2" /> Setujui
            </Button>
          )}

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
