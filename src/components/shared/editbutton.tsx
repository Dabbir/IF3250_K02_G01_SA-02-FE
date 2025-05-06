"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Save, Loader2 } from "lucide-react"

interface EditButtonsProps {
    isEditing: boolean
    saving: boolean
    onEdit: () => void
    onSave: () => void
    onCancel: () => void
}

export default function EditButtons({ isEditing, saving, onEdit, onSave, onCancel }: EditButtonsProps) {
    return (
        <div className="flex justify-end mt-4">
            {!isEditing ? (
                <Button variant="outline" size="sm" onClick={onEdit}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
            ) : (
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="outline" size="sm" onClick={onSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" /> Simpan
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
