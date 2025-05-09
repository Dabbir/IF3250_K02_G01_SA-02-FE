"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Employee } from "@/types/employee" 

type Props = {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    isDeleting: boolean
    onDelete: () => void
    deletingEmployee?: Employee | null
}

const EmployeeDeleteDialog = ( { isOpen, setIsOpen, isDeleting, onDelete, deletingEmployee }: Props) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus Karyawan</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus karyawan "{deletingEmployee?.nama}"? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-between sm:justify-between mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isDeleting}
                    >
                    Batal
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Menghapus...
                            </>
                        ) : (
                            "Hapus Karyawan"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmployeeDeleteDialog
