"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ConfirmAction } from "@/types/common"

interface ConfirmDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  confirmAction: ConfirmAction
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export const ConfirmDialog = ({ isOpen, onOpenChange, confirmAction, onConfirm, isLoading }: ConfirmDialogProps) => {
  let message = ""

  if (confirmAction.type === "approve" && confirmAction.user) {
    message = `Apakah Anda yakin ingin menyetujui ${confirmAction.user.nama} sebagai editor?`
  } else if (confirmAction.type === "reject" && confirmAction.user) {
    message = `Apakah Anda yakin ingin menolak ${confirmAction.user.nama} sebagai editor?`
  } else if (confirmAction.type === "delete-masjid" && confirmAction.masjid) {
    message = `Apakah Anda yakin ingin menghapus masjid ${confirmAction.masjid.nama_masjid}?`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Batal
          </Button>
          <Button
            className={confirmAction.type === "approve" ? "bg-[#3A786D] text-white" : "bg-red-600 text-white"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading
              ? "Memproses..."
              : confirmAction.type === "approve"
                ? "Setujui"
                : confirmAction.type === "reject"
                  ? "Tolak"
                  : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
