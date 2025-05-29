"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ImageIcon, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ProfileImageSectionProps {
    profileImage: string | undefined
    previewImage: string | null
    shouldDeleteImage: boolean
    isEditing: boolean
    showDeleteDialog: boolean
    setShowDeleteDialog: (show: boolean) => void
    handleImageUpload: () => void
    handleDeletePhoto: () => void
}

export default function ProfileImageSection({
    profileImage,
    previewImage,
    shouldDeleteImage,
    isEditing,
    showDeleteDialog,
    setShowDeleteDialog,
    handleImageUpload,
    handleDeletePhoto,
}: ProfileImageSectionProps) {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4">
            <div className="flex flex-col md:flex-row items-center relative gap-4">
                <div className="w-28 h-28 sm:w-36 sm:h-36">
                    <Avatar className="w-full h-full rounded-full bg-slate-200" data-cy="profile-image">
                        <AvatarImage
                            src={previewImage ? previewImage : shouldDeleteImage ? "" : profileImage || ""}
                            alt="User Profile"
                        />
                        <AvatarFallback className="flex items-center justify-center text-slate-400 text-4xl">
                            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="60"
                                    height="60"
                                    className="sm:w-[80px] sm:h-[80px]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#9ca3af"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                        </AvatarFallback>
                    </Avatar>
                </div>
                {isEditing && (
                    <div className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-6 mt-2 md:mt-4 justify-center md:justify-start">
                        <Button
                            data-cy="image-upload-button"
                            variant="outline"
                            size="sm"
                            className="border-[var(--green)] text-[var(--green)] justify-start"
                            onClick={handleImageUpload}
                            disabled={!isEditing}
                        >
                            <ImageIcon className="text-[var(--green)] h-4 w-4 mr-2" data-cy="image-upload-button"/>
                            Ubah
                        </Button>
                        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <DialogTrigger asChild>
                                <Button
                                    data-cy="delete-photo-button"
                                    variant="outline"
                                    size="sm"
                                    className="border-[var(--green)] text-[var(--green)] justify-start"
                                    disabled={!isEditing || (!profileImage && !previewImage)}
                                >
                                    <Trash2 className="text-[var(--green)] h-4 w-4 mr-2" />
                                    Hapus
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Hapus Foto Profil</DialogTitle>
                                    <DialogDescription>Apakah Anda yakin ingin menghapus foto profil?</DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="flex justify-between sm:justify-between mt-4">
                                    <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                        Batal
                                    </Button>
                                    <Button type="button" variant="destructive" onClick={handleDeletePhoto}>
                                        Hapus Foto
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </div>
    )
}
