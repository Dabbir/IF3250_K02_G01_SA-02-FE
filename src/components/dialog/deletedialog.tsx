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

interface ConfirmDeleteDialogProps<T> {
    open: boolean
    onOpenChange: (open: boolean) => void
    selectedItem: T | null
    itemName: string
    itemLabelKey: keyof T
    onDelete: (id: string | undefined) => void
    title?: string
    descriptionPrefix?: string
}

export function ConfirmDeleteDialog<T>({
    open,
    onOpenChange,
    selectedItem,
    itemName,
    itemLabelKey,
    onDelete,
    title = "Hapus Item",
    descriptionPrefix = "Apakah Anda yakin ingin menghapus",
}: ConfirmDeleteDialogProps<T>) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {descriptionPrefix} {itemName}{" "}
                        {selectedItem ? `"${String(selectedItem[itemLabelKey])}"?` : "?"}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-between sm:justify-between mt-4">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => onDelete((selectedItem as any)?.id)}
                    >
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
