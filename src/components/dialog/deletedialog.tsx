"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { Kegiatan } from "@/types/Activity"

interface DeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedActivity: Kegiatan | null
    onDelete: (id: string | undefined) => void
}

export default function DeleteDialog({ open, onOpenChange, selectedActivity, onDelete }: DeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus Kegiatan</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus kegiatan "{selectedActivity?.nama_aktivitas}"?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-between sm:justify-between mt-4">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => onDelete(selectedActivity?.id)}>
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
