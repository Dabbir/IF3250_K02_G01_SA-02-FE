import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { StakeholderDetail } from "@/types/stakeholder"
import { validateStakeholderForm } from "@/utils/validation"

const API_URL = import.meta.env.VITE_HOST_NAME

export default function useDetailStakeholder() {
    const { id } = useParams<{ id: string }>()
    const [stakeholder, setStakeholder] = useState<StakeholderDetail | null>(null)
    const [editedStakeholder, setEditedStakeholder] = useState<StakeholderDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formErrors, setFormErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        const fetchStakeholderDetail = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token")
                if (!token) throw new Error("Authentication token not found")

                const res = await fetch(`${API_URL}/api/stakeholder/getstakeholder/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                const data = await res.json()
                if (!res.ok || !data.success) throw new Error(data.message || "Gagal memuat stakeholder")

                setStakeholder(data.stakeholder)
                setEditedStakeholder(data.stakeholder)
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Terjadi kesalahan"
                setError(msg)
                toast.error("Gagal memuat detail stakeholder!")
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchStakeholderDetail()
    }, [id])

    const validateForm = () => {
        if (!editedStakeholder) return
        const errors = validateStakeholderForm(editedStakeholder)
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSave = async () => {
        if (!editedStakeholder) return
        if (!validateForm()) return

        setSaving(true)
        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("Authentication token not found")

            const body = {
                nama_stakeholder: editedStakeholder.nama_stakeholder,
                jenis: editedStakeholder.jenis,
                telepon: editedStakeholder.telepon,
                email: editedStakeholder.email,
            }

            const res = await fetch(`${API_URL}/api/stakeholder/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })

            const data = await res.json()
            if (!res.ok || !data.success) throw new Error(data.message || "Gagal memperbarui stakeholder")

            setStakeholder((prev) => (prev ? { ...prev, ...data.data } : data.data))
            toast.success("Stakeholder berhasil diperbarui!")
            return true
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Gagal memperbarui stakeholder!"
            toast.error(msg)
            return false
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field: keyof StakeholderDetail, value: string | number) => {
        setEditedStakeholder((prev) => (prev ? { ...prev, [field]: value } : null))
    }

    const handleEditClick = () => setIsEditing(true)

    const handleCancel = () => {
        setEditedStakeholder(stakeholder)
        setIsEditing(false)
    }

    const handleSaveClick = async () => {
        const success = await handleSave()
        if (success) setIsEditing(false)
    }

    return {
        stakeholder,
        editedStakeholder,
        isEditing,
        formErrors,
        loading,
        saving,
        error,
        handleChange,
        handleEditClick,
        handleCancel,
        handleSaveClick,
    }
}
