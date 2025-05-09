"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ActionType } from "@/types/viewer"

interface ConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  actionType: ActionType | null
  itemName: string
  isLoading: boolean
}

export const ConfirmationDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  actionType,
  itemName,
  isLoading,
}: ConfirmationDialogProps) => {
  const getActionText = () => {
    if (!actionType) return ""

    switch (actionType) {
      case "request":
        return `meminta akses ke ${itemName}`
      case "approve":
        return `menyetujui permintaan akses dari ${itemName}`
      case "reject":
        return `menolak permintaan akses dari ${itemName}`
      case "remove":
        return `mencabut akses viewer dari ${itemName}`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Apakah Anda yakin ingin {getActionText()}?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Batal
          </Button>
          <Button className="bg-[#3A786D] text-white" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Memproses..." : "Ya, Lanjutkan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
