"use client"

import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"

interface SaveCancelButtonsProps {
    saving: boolean
    onSave: () => void
    onCancel: () => void
}

export default function SaveCancelButtons({
    saving,
    onSave,
    onCancel,
}: SaveCancelButtonsProps) {
    return (
        <>
            <div className="flex justify-end space-x-2 mt-4 md:mt-6">

                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-[var(--green)] text-[var(--green)] px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                    disabled={saving}
                >
                    Batal
                </Button>
                <Button
                    type="button"
                    onClick={onSave}
                    className="bg-[var(--green)] hover:bg-[var(--blue)] text-white px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                    disabled={saving}
                >
                    {saving ? (
                        <>
                            <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                            Simpan
                        </>
                    )}
                </Button>
            </div>
        </>
    )
}
