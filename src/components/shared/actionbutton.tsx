"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SaveCancelButtonsProps {
    onCancel: () => void
    isSaving: boolean
    disabled?: boolean
}

export function SaveCancelButtons({ onCancel, isSaving, disabled = false }: SaveCancelButtonsProps) {
    return (
        <div className="flex justify-center space-x-2 mt-4 md:mt-6">
            <Button
                data-cy="cancel-button"
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-[var(--green)] text-[var(--green)] px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                disabled={isSaving || disabled}
            >
                Batal
            </Button>
            <Button
                data-cy="save-button"
                type="submit"
                className="bg-[var(--green)] hover:bg-[var(--blue)] text-white px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                disabled={isSaving || disabled}
            >
                {isSaving ? (
                    <>
                        <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                        Menyimpan...
                    </>
                ) : (
                    "Simpan"
                )}
            </Button>
        </div>
    )
}

interface EditButtonProps {
    onClick: () => void
    disabled?: boolean
    icon: React.ReactNode
    children: React.ReactNode
}

export function EditButton({ onClick, disabled = false, icon, children }: EditButtonProps) {
    return (
        <Button
            data-cy="edit-button"
            variant="outline"
            size="sm"
            className="text-[var(--green)] border-[var(--green)]"
            onClick={onClick}
            disabled={disabled}
        >
            {icon}
            {children}
        </Button>
    )
}
