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
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface FormErrors {
    namaDepan?: string;
    email?: string;
    alasanBergabung?: string;
}

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

const API_URL = import.meta.env.VITE_HOST_NAME

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

    const [originalUserData, setOriginalUserData] = useState<UserData | null>(null);
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    // Add a state to track if the profile image should be deleted
    const [shouldDeleteImage, setShouldDeleteImage] = useState(false)

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true)

                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });


                if (!response.ok) {
                    throw new Error("Failed to fetch profile data")
                }

                const data = await response.json()

                if (data.success && data.user) {
                    const fullName = data.user.nama?.trim() || ""
                    const [namaDepan, ...restNama] = fullName.split(" ")
                    const namaBelakang = restNama.join(" ") || ""

                    const profileData = {
                        namaDepan,
                        namaBelakang,
                        email: data.user.email,
                        alasanBergabung: data.user.alasan_bergabung || "",
                        bio: data.user.short_bio || "",
                        profileImage: data.user.foto_profil || "",
                        namaMasjid: data.user.nama_masjid || "",
                        alamatMasjid: data.user.alamat_masjid || "",
                    };
        
                    setUserData(profileData);
                    setOriginalUserData(profileData);
                    setAlasanLength(data.user.alasan_bergabung?.length || 0);
                    setBioLength(data.user.short_bio?.length || 0);
                }
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
            const file = e.target.files[0];

            // Validasi ukuran file (maksimum 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                toast.error("Ukuran foto tidak boleh lebih dari 2MB");
                return;
            }

            setShouldDeleteImage(false)
            setNewProfileImage(file);

            // Buat preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Add the handleDeletePhoto function after the handleImageChange function
    const handleDeletePhoto = () => {
        setPreviewImage(null)
        setUserData(prev => ({
            ...prev,
            profileImage: ""
        }));
        setNewProfileImage(null)
        setShouldDeleteImage(true)
        setShowDeleteDialog(false)
    }

    // Modify the handleSubmit function to include the image deletion flag
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const nama = `${userData.namaDepan} ${userData.namaBelakang}`.trim()
            const token = localStorage.getItem("token");

            const formData = new FormData()
            formData.append("nama", nama)
            formData.append("email", userData.email)
            formData.append("short_bio", userData.bio)
            formData.append("alasan_bergabung", userData.alasanBergabung)

            if (newProfileImage) {
                formData.append("fotoProfil", newProfileImage)
            }

            // Add a flag to indicate if the image should be deleted
            if (shouldDeleteImage) {
                formData.append("deleteProfileImage", "true")
            } else {
                formData.append("deleteProfileImage", "false")
            }

            const response = await fetch(`${API_URL}/api/users`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Failed to update profile")
            }

            setTimeout(() => window.location.reload(), 500)
            setNewProfileImage(null)
            setPreviewImage(null)
            setShouldDeleteImage(false)
            setIsEditing(false)

            toast.success("Profil berhasil diperbarui")
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Gagal memperbarui profil")
        } finally {
            setIsSaving(false)
        }
    }

    // Modify the handleCancel function to reset the shouldDeleteImage state
    const handleCancel = () => {
        setIsEditing(false);
        
        if (originalUserData) {
            setUserData(originalUserData);
            setAlasanLength(originalUserData.alasanBergabung.length);
            setBioLength(originalUserData.bio.length);
        }
        
        setNewProfileImage(null);
        setPreviewImage(null);
        setShouldDeleteImage(false);
    };

    const handleImageUpload = () => {
        const fileInput = document.getElementById("profile-upload") as HTMLInputElement
        fileInput.click()
    }

    const [errors, setErrors] = useState<FormErrors>({});
    const validate = () => {
        const newErrors: FormErrors = {}
        if (!userData.namaDepan.trim()) newErrors.namaDepan = "Nama depan tidak boleh kosong!"
        if (!userData.email.trim()) {
            newErrors.email = "Email tidak boleh kosong!";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            newErrors.email = "Format email tidak valid!";
        }
        if (!userData.alasanBergabung.trim()) newErrors.alasanBergabung = "Nama depan tidak boleh kosong!"
        if (userData.alasanBergabung.length < 8) newErrors.alasanBergabung = "Minimal 8 karakter!"
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = () => {
        validate();
    };

    const [alasanLength, setAlasanLength] = useState(userData.alasanBergabung.length || 0);
    const [bioLength, setBioLength] = useState(userData.bio.length || 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.name === "alasanBergabung" && e.target.value.length > 100) return;
        if (e.target.name === "bio" && e.target.value.length > 300) return;

        handleChange(e);

        if (e.target.name === "alasanBergabung") setAlasanLength(e.target.value.length);
        if (e.target.name === "bio") setBioLength(e.target.value.length);
    };

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
                                    <AvatarImage 
                                        src={previewImage ? previewImage : shouldDeleteImage ? "" : userData.profileImage || ""} 
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
                                            accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
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
                                        onBlur={handleBlur}
                                        disabled={!isEditing}
                                        className={`border ${errors.namaDepan ? "border-red-500" : "border-[var(--green)]"}`}
                                    />
                                    {errors.namaDepan && <span className="text-red-500 text-xs">{errors.namaDepan}</span>}
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
                                        value={userData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={!isEditing}
                                        className={`border ${errors.email ? "border-red-500" : "border-[var(--green)]"}`}
                                    />
                                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                                </div>
                            </div>

                            <div className="space-y-1 order-2">
                                <div className="space-y-2">
                                    <label htmlFor="alasanBergabung" className="block text-sm font-medium text-slate-700">
                                        Alasan Bergabung
                                    </label>
                                    <Textarea
                                        id="alasanBergabung"
                                        name="alasanBergabung"
                                        value={userData.alasanBergabung}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        disabled={!isEditing}
                                        className={`${isEditing ? "h-15" : "h-18"} border ${errors.alasanBergabung ? "border-red-500" : "border-[var(--green)]"}`}

                                    />
                                    <div className="flex flex-row">
                                        {errors.alasanBergabung && <span className="text-red-500 text-xs">{errors.alasanBergabung}</span>}
                                        {isEditing && <p className="text-xs text-gray-500 ml-auto">{alasanLength}/100</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
                                        Bio
                                    </label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={userData.bio}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`${isEditing ? "h-19" : "h-21"} border-[var(--green)]`}
                                    />
                                    {isEditing && <p className="text-end text-xs text-gray-500">{bioLength}/300</p>}
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