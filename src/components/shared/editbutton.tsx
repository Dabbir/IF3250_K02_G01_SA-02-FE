"use client"

import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

interface EditButtonProps {
    isEditing: boolean
    onEdit: () => void
}

export default function EditButton({ isEditing, onEdit }: EditButtonProps) {
    return (
        <>
            <div className="flex justify-end space-x-2 mt-4 md:mt-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    disabled={isEditing}
                    className="border-[var(--green)] text-[var(--green)] px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                >
                    <Pencil className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Edit
                </Button>
            </div>
        </>
    )
}
