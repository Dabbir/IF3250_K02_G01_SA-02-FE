"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Image, Pencil, Trash2, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface UserData {
    namaDepan: string
    namaBelakang: string
    email: string
    alasanBergabung: string
    bio: string
    profileImage?: string
    namaMasjid: string
    alamatMasjid: string
}

export default function ManajemenAkun() {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [userData, setUserData] = useState<UserData>({
        namaDepan: "",
        namaBelakang: "",
        email: "",
        alasanBergabung: "",
        bio: "",
        profileImage: "",
        namaMasjid: "",
        alamatMasjid: "",
    })
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/viewprofile")

                if (!response.ok) {
                    throw new Error("Failed to fetch profile data")
                }

                const data = await response.json()
                setUserData(data)
            } catch (error) {
                console.error("Error fetching profile:", error)
                toast.error("Gagal memuat data profil")
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setNewProfileImage(file)

            // Create preview URL
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const formData = new FormData()

            // Append user data
            Object.entries(userData).forEach(([key, value]) => {
                if (key !== "profileImage") {
                    formData.append(key, value)
                }
            })

            // Append new profile image if exists
            if (newProfileImage) {
                formData.append("profileImage", newProfileImage)
            }

            const response = await fetch("/updateprofile", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to update profile")
            }

            const updatedData = await response.json()
            setUserData(updatedData)
            setNewProfileImage(null)
            setPreviewImage(null)
            setIsEditing(false)

            toast.success("Profil berhasil diperbarui")
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Gagal memperbarui profil")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeletePhoto = async () => {
        setShowDeleteDialog(false)

        try {
            const response = await fetch("/updateprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...userData,
                    profileImage: null,
                    deletePhoto: true,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to delete profile photo")
            }

            const updatedData = await response.json()
            setUserData(updatedData)
            setPreviewImage(null)

            toast.success("Foto profil berhasil dihapus")
        } catch (error) {
            console.error("Error deleting photo:", error)
            toast.error("Gagal menghapus foto profil")
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setNewProfileImage(null)
        setPreviewImage(null)
        // Reset to original data from server
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("/viewprofile")
                if (response.ok) {
                    const data = await response.json()
                    setUserData(data)
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
            }
        }
        fetchUserProfile()
    }

    const handleImageUpload = () => {
        const fileInput = document.getElementById("profile-upload") as HTMLInputElement
        fileInput.click()
    }

    if (isLoading) {
        return (
            <div className="m-3 sm:m-5 flex justify-center items-center h-[50vh] sm:h-[calc(85vh)]">
                <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
            </div>
        )
    }

    return (
        <div className="m-5">
            <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-auto">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                        <User className="h-6 w-6 text-slate-700" />
                        <h2 className="text-xl font-medium text-[var(--blue)]">Manajemen Akun</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4">
                            <div className="flex flex-col md:flex-row items-center relative gap-4">
                                <div className="w-28 h-28 sm:w-36 sm:h-36">
                                    <Avatar className="w-full h-full rounded-full bg-slate-200">
                                        <AvatarImage src={previewImage || userData.profileImage || ""} alt="User Profile" />
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
                                            variant="outline"
                                            size="sm"
                                            className="border-[var(--green)] text-[var(--green)] justify-start"
                                            onClick={handleImageUpload}
                                            disabled={!isEditing}
                                        >
                                            <Image className="text-[var(--green)] h-4 w-4 mr-2" />
                                            Ubah
                                        </Button>
                                        <input
                                            id="profile-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                            disabled={!isEditing}
                                        />
                                        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-[var(--green)] text-[var(--green)] justify-start"
                                                    disabled={!isEditing || (!userData.profileImage && !previewImage)}
                                                >
                                                    <Trash2 className="text-[var(--green)] h-4 w-4 mr-2" />
                                                    Hapus
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Hapus Foto Profil</DialogTitle>
                                                    <DialogDescription>
                                                        Apakah Anda yakin ingin menghapus foto profil?
                                                    </DialogDescription>
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

                        <div className="flex flex-col text-center md:text-end space-y-2">
                            <h3 className="text-lg sm:text-xl font-medium text-[var(--blue)]">{userData.namaMasjid}</h3>
                            <p className="text-xs sm:text-sm text-slate-600">{userData.alamatMasjid}</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        {!isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-[var(--green)] border-[var(--green)]"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="text-[var(--green)] h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                        {isEditing && <div className="h-8 invisible" />}
                    </div>

                    <form onSubmit={handleSubmit} className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* First column on desktop */}
                            <div className="space-y-4 order-1">
                                <div className="space-y-2">
                                    <label htmlFor="namaDepan" className="block text-sm font-medium text-slate-700">
                                        Nama Depan
                                    </label>
                                    <Input
                                        id="namaDepan"
                                        name="namaDepan"
                                        value={userData.namaDepan}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="border-[var(--green)]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="namaBelakang" className="block text-sm font-medium text-slate-700">
                                        Nama Belakang
                                    </label>
                                    <Input
                                        id="namaBelakang"
                                        name="namaBelakang"
                                        value={userData.namaBelakang}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="border-[var(--green)]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="border-[var(--green)]"
                                    />
                                </div>
                            </div>

                            {/* Second column on desktop */}
                            <div className="space-y-4 order-2">
                                <div className="space-y-2">
                                    <label htmlFor="alasanBergabung" className="block text-sm font-medium text-slate-700">
                                        Alasan Bergabung
                                    </label>
                                    <Input
                                        id="alasanBergabung"
                                        name="alasanBergabung"
                                        value={userData.alasanBergabung}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="border-[var(--green)]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
                                        Bio
                                    </label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={userData.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="h-29 border-[var(--green)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-center space-x-2 mt-4 md:mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="border-[var(--green)] text-[var(--green)] px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                                    disabled={isSaving}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-[var(--green)] hover:bg-[var(--blue)] text-white px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                                    disabled={isSaving}
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
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

