"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface DocumentationGalleryProps {
    dokumentasiList: string[]
    isEditing: boolean
    onAddImages: (event: React.ChangeEvent<HTMLInputElement>) => void
    onRemoveImage: (index: number) => void
}

export default function Documentation({
    dokumentasiList,
    isEditing,
    onAddImages,
    onRemoveImage,
}: DocumentationGalleryProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    if (dokumentasiList.length === 0 && !isEditing) return null

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium mb-4">Dokumentasi</h2>

                {isEditing && (
                    <div className="mb-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
                            onChange={onAddImages}
                            className="hidden"
                            id="dokumentasi-upload"
                        />
                        <label
                            htmlFor="dokumentasi-upload"
                            className="bg-[var(--green)] cursor-pointer inline-flex items-center px-4 py-2 text-white rounded-md hover:scale-95 hover:bg-[var(--blue)]"
                        >
                            <Upload className="h-4 w-4 mr-2" /> Tambah Foto
                        </label>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center place-items-center">
                {dokumentasiList.map((url, index) => (
                    <div key={index} className="relative w-full">
                        <img
                            src={url || "/placeholder.svg"}
                            alt={`Dokumentasi ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg border"
                        />
                        {isEditing && (
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 hover:scale-95 cursor-pointer rounded-full bg-red-500 hover:bg-red-600"
                                onClick={() => onRemoveImage(index)}
                            >
                                <span className="sr-only">Remove</span>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
