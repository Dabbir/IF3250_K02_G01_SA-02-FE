"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import type { UserData, FormErrors } from "@/types/user"

const API_URL = import.meta.env.VITE_HOST_NAME

export default function useUserProfile() {
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

    const [originalUserData, setOriginalUserData] = useState<UserData | null>(null)
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [shouldDeleteImage, setShouldDeleteImage] = useState(false)
    const [errorsForm, setErrorsForm] = useState<FormErrors>({})
    const [alasanLength, setAlasanLength] = useState(0)
    const [bioLength, setBioLength] = useState(0)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true)

                const token = localStorage.getItem("token")
                const response = await fetch(`${API_URL}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })

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
                    }

                    setUserData(profileData)
                    setOriginalUserData(profileData)
                    setAlasanLength(data.user.alasan_bergabung?.length || 0)
                    setBioLength(data.user.short_bio?.length || 0)
                }
            } catch (error) {
                console.error("Error fetching profile:", error)
                toast.error("Gagal memuat data profil")
                setError("Terjadi kesalahan saat memuat data profil")
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.name === "alasanBergabung" && e.target.value.length > 100) return
        if (e.target.name === "bio" && e.target.value.length > 300) return

        handleChange(e)

        if (e.target.name === "alasanBergabung") setAlasanLength(e.target.value.length)
        if (e.target.name === "bio") setBioLength(e.target.value.length)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]

            const maxSize = 2 * 1024 * 1024 // 2MB
            if (file.size > maxSize) {
                toast.error("Ukuran foto tidak boleh lebih dari 2MB")
                return
            }

            setShouldDeleteImage(false)
            setNewProfileImage(file)

            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDeletePhoto = () => {
        setPreviewImage(null)
        setUserData((prev) => ({
            ...prev,
            profileImage: "",
        }))
        setNewProfileImage(null)
        setShouldDeleteImage(true)
        setShowDeleteDialog(false)
    }

    const validate = () => {
        const newErrors: FormErrors = {}
        if (!userData.namaDepan.trim()) newErrors.namaDepan = "Nama depan tidak boleh kosong!"
        if (!userData.email.trim()) {
            newErrors.email = "Email tidak boleh kosong!"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            newErrors.email = "Format email tidak valid!"
        }
        if (!userData.alasanBergabung.trim()) newErrors.alasanBergabung = "Alasan bergabung tidak boleh kosong!"
        if (userData.alasanBergabung.length < 8) newErrors.alasanBergabung = "Minimal 8 karakter!"
        setErrorsForm(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleBlur = () => {
        validate()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) return

        setIsSaving(true)

        try {
            const nama = `${userData.namaDepan} ${userData.namaBelakang}`.trim()
            const token = localStorage.getItem("token")

            const formData = new FormData()
            formData.append("nama", nama)
            formData.append("email", userData.email)
            formData.append("short_bio", userData.bio)
            formData.append("alasan_bergabung", userData.alasanBergabung)

            if (newProfileImage) {
                formData.append("fotoProfil", newProfileImage)
            }

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
            setError("Terjadi kesalahan saat memperbarui profil")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = useCallback(() => {
        setIsEditing(false)

        if (originalUserData) {
            setUserData(originalUserData)
            setAlasanLength(originalUserData.alasanBergabung.length)
            setBioLength(originalUserData.bio.length)
        }

        setNewProfileImage(null)
        setPreviewImage(null)
        setShouldDeleteImage(false)
    }, [originalUserData])

    const handleImageUpload = () => {
        const fileInput = document.getElementById("profile-upload") as HTMLInputElement
        fileInput.click()
    }

    return {
        isEditing,
        setIsEditing,
        isLoading,
        isSaving,
        userData,
        newProfileImage,
        previewImage,
        showDeleteDialog,
        setShowDeleteDialog,
        shouldDeleteImage,
        errorsForm,
        alasanLength,
        bioLength,
        handleChange,
        handleInputChange,
        handleImageChange,
        handleDeletePhoto,
        handleSubmit,
        handleCancel,
        handleImageUpload,
        handleBlur,
        error,
    }
}

