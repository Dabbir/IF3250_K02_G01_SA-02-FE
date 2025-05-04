"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import type { DetailedKegiatan, Program, ImageData, StakeholderActivity, BeneficiaryActivity, EmployeeActivity } from "@/types/activity"

const API_URL = import.meta.env.VITE_HOST_NAME

const emptyStakeholder: StakeholderActivity = {
    nama_stakeholder: "",
    jenis: "Individu",
    telepon: "",
    email: "",
}

const emptyBeneficiary: BeneficiaryActivity = {
    nama_instansi: "",
    nama_kontak: "",
    telepon: "",
    email: "",
    alamat: "",
}

const emptyEmployee: EmployeeActivity = {
    nama: "",
    email: "",
    telepon: "",
    alamat: "",
}

export default function useDetailActivity(id: string | undefined) {
    const [kegiatan, setKegiatan] = useState<DetailedKegiatan | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedKegiatan, setEditedKegiatan] = useState<DetailedKegiatan | null>(null)
    const [deletedImages, setDeletedImages] = useState<string[]>([])
    const [dokumentasiList, setDokumentasiList] = useState<string[]>([])
    const [images, setImages] = useState<ImageData[]>([])
    const [prevDokumentasi, setPrevDokumentasi] = useState<string[]>([])
    const [programs, setPrograms] = useState<Program[]>([])

    // New state for stakeholders, beneficiaries, and employees
    const [stakeholders, setStakeholders] = useState<StakeholderActivity[]>([])
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryActivity[]>([])
    const [karyawan, setKaryawan] = useState<EmployeeActivity[]>([])

    const getDokumentasiList = (dokumentasi?: string): string[] => {
        if (!dokumentasi) return []

        try {
            const parsed = JSON.parse(dokumentasi)
            return Array.isArray(parsed) ? parsed : [parsed]
        } catch (error) {
            console.error(error)
            return dokumentasi.startsWith("http") ? [dokumentasi] : []
        }
    }

    useEffect(() => {
        const fetchActivityDetail = async () => {
            if (!id) return

            try {
                setLoading(true)
                const token = localStorage.getItem("token")

                if (!token) {
                    throw new Error("Authentication token not found")
                }

                const response = await fetch(`${API_URL}/api/activity/getactivity/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch activity: ${response.status}`)
                }

                const data = await response.json()

                if (data.success) {
                    setKegiatan(data.activity)
                    setEditedKegiatan(data.activity)
                    setDokumentasiList(getDokumentasiList(data.activity?.dokumentasi))

                    // Set stakeholders, beneficiaries, and employees if they exist
                    if (data.activity.stakeholder) {
                        setStakeholders(data.activity.stakeholder)
                    } else {
                        setStakeholders([])
                    }

                    if (data.activity.beneficiary) {
                        setBeneficiaries(data.activity.beneficiary)
                    } else {
                        setBeneficiaries([])
                    }

                    if (data.activity.employee) {
                        setKaryawan(data.activity.employee)
                    } else {
                        setKaryawan([])
                    }
                } else {
                    throw new Error(data.message || "Failed to fetch activity")
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
                toast.error("Gagal memuat detail aktivitas!")
            } finally {
                setLoading(false)
            }
        }

        fetchActivityDetail()
    }, [id])

    useEffect(() => {
        if (kegiatan) {
            setDokumentasiList(getDokumentasiList(kegiatan.dokumentasi))
        }
    }, [kegiatan])

    const fetchPrograms = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_URL}/api/activity/idprogram`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) throw new Error("Gagal mengambil data program")

            const data = await response.json()
            setPrograms(data.idProgram)
        } catch (error) {
            console.error(error)
        }
    }

    const handleEditClick = () => {
        setIsEditing(true)
        fetchPrograms()
        setPrevDokumentasi(dokumentasiList)
        setImages([])
    }

    const handleCancel = () => {
        setEditedKegiatan(kegiatan)
        setDeletedImages([])
        setImages([])
        setIsEditing(false)

        // Reset stakeholders, beneficiaries, and employees to their original state
        if (kegiatan?.stakeholders) {
            setStakeholders(kegiatan.stakeholders)
        }
        if (kegiatan?.penerima_manfaat) {
            setBeneficiaries(kegiatan.penerima_manfaat)
        }
        if (kegiatan?.karyawan) {
            setKaryawan(kegiatan.karyawan)
        }
    }

    const handleChange = (field: keyof DetailedKegiatan, value: string | number) => {
        setEditedKegiatan((prev) => (prev ? { ...prev, [field]: value } : null))
    }

    const handleProgramSelect = (program: Program) => {
        setEditedKegiatan((prev) =>
            prev ? { ...prev, nama_program: program.nama_program, program_id: program.id.toString() } : null,
        )
    }

    const handleProgramChange = (value: string) => {
        setEditedKegiatan((prev) => (prev ? { ...prev, nama_program: value } : null))
    }

    const handleRemoveImage = (index: number) => {
        const imageToRemove = dokumentasiList[index]
        const isNewUpload = imageToRemove.startsWith("blob:")

        setDokumentasiList((prev) => prev.filter((_, i) => i !== index))

        if (!isNewUpload) {
            setDeletedImages((prev) => [...prev, imageToRemove])
        }

        if (isNewUpload) {
            setImages((prev) => prev.filter((img) => img.url !== imageToRemove))
        }

        setPrevDokumentasi((prev) => prev.filter((_, i) => i !== index))
    }

    const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (files.length === 0) return

        const newImages: ImageData[] = files.map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }))
        setImages((prev) => [...prev, ...newImages])
        setDokumentasiList((prev) => [...prev, ...newImages.map((image) => image.url)])
    }

    // Handlers for stakeholders
    const addStakeholder = () => {
        setStakeholders((prev) => [...prev, { ...emptyStakeholder }])
    }

    const removeStakeholder = (index: number) => {
        setStakeholders((prev) => prev.filter((_, i) => i !== index))
    }

    const updateStakeholder = (index: number, field: keyof StakeholderActivity, value: string) => {
        setStakeholders((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    // Handlers for beneficiaries
    const addBeneficiary = () => {
        setBeneficiaries((prev) => [...prev, { ...emptyBeneficiary }])
    }

    const removeBeneficiary = (index: number) => {
        setBeneficiaries((prev) => prev.filter((_, i) => i !== index))
    }

    const updateBeneficiary = (index: number, field: keyof BeneficiaryActivity, value: string) => {
        setBeneficiaries((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    // Handlers for employees
    const addKaryawan = () => {
        setKaryawan((prev) => [...prev, { ...emptyEmployee }])
    }

    const removeKaryawan = (index: number) => {
        setKaryawan((prev) => prev.filter((_, i) => i !== index))
    }

    const updateKaryawan = (index: number, field: keyof EmployeeActivity, value: string) => {
        setKaryawan((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    const handleSaveClick = async () => {
        if (!editedKegiatan || !id) return

        setSaving(true)
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("Authentication token not found")
            }

            const formData = new FormData()
            formData.append("nama_aktivitas", editedKegiatan.nama_aktivitas)
            formData.append("programTerafiliasi", editedKegiatan.nama_program)
            formData.append("program_id", String(editedKegiatan.program_id))
            formData.append("tanggal_mulai", editedKegiatan.tanggal_mulai)
            formData.append("tanggal_selesai", editedKegiatan.tanggal_selesai)
            formData.append("status", editedKegiatan.status)
            formData.append("biaya_implementasi", String(editedKegiatan.biaya_implementasi))
            formData.append("deskripsi", editedKegiatan.deskripsi)

            deletedImages.forEach((image) => {
                formData.append("deleted_images[]", image)
            })

            prevDokumentasi.forEach((image) => {
                formData.append("prev_dokumentasi[]", image)
            })

            images.forEach((image) => {
                formData.append(`dokumentasi`, image.file)
            })

            // Add stakeholders, beneficiaries, and employees to form data
            formData.append("stakeholders", JSON.stringify(stakeholders))
            formData.append("penerima_manfaat", JSON.stringify(beneficiaries))
            formData.append("karyawan", JSON.stringify(karyawan))

            const response = await fetch(`${API_URL}/api/activity/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `Gagal memperbarui kegiatan!: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                // Update the local state with the updated data
                setKegiatan((prev) =>
                    prev
                        ? {
                            ...prev,
                            ...data.data,
                            stakeholders: stakeholders,
                            penerima_manfaat: beneficiaries,
                            karyawan: karyawan,
                        }
                        : data.data,
                )
                setIsEditing(false)
                setImages([])
                setDeletedImages([])
                toast.success("Kegiatan berhasil diperbarui!")
            } else {
                throw new Error(data.message || "Gagal memperbarui kegiatan!")
            }
        } catch (error) {
            console.error("Error updating activity:", error)
            toast.error(error instanceof Error ? error.message : "Gagal memperbarui kegiatan!")
        } finally {
            setSaving(false)
        }
    }

    return {
        kegiatan,
        loading,
        saving,
        error,
        isEditing,
        editedKegiatan,
        dokumentasiList,
        programs,
        stakeholders,
        beneficiaries,
        karyawan,
        handleEditClick,
        handleCancel,
        handleChange,
        handleProgramSelect,
        handleProgramChange,
        handleRemoveImage,
        handleAddImages,
        handleSaveClick,
        addStakeholder,
        removeStakeholder,
        updateStakeholder,
        addBeneficiary,
        removeBeneficiary,
        updateBeneficiary,
        addKaryawan,
        removeKaryawan,
        updateKaryawan,
    }
}
