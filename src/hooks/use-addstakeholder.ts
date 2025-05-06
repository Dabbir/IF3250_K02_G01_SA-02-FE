"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import type { Stakeholder } from "@/types/stakeholder"
import { validateStakeholderForm } from "@/utils/validation"

const API_URL = import.meta.env.VITE_HOST_NAME

const initialStakeholder: Stakeholder = {
    id: "",
    nama_stakeholder: "",
    jenis: "",
    telepon: "",
    email: "",
    foto: "",
    masjid_id: "",
    created_by: "",
}

export default function useAddStakeholder(setIsOpen: (open: boolean) => void) {
    const [isSaving, setIsSaving] = useState(false)
    const [newStakeholder, setNewStakeholder] = useState<Stakeholder>(initialStakeholder)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewStakeholder({ ...newStakeholder, [e.target.name]: e.target.value })
    }

    const handleSelectChange = (name: string, value: string) => {
        setNewStakeholder((prev) => ({ ...prev, [name]: value }))
    }

    const validateForm = () => {
        const newErrors = validateStakeholderForm(newStakeholder)
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsSaving(true)
        try {
            const body = {
                nama_stakeholder: newStakeholder.nama_stakeholder,
                jenis: newStakeholder.jenis,
                telepon: newStakeholder.telepon,
                email: newStakeholder.email,
            }

            const token = localStorage.getItem("token")

            const response = await fetch(`${API_URL}/api/stakeholder/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                throw new Error("Gagal menyimpan data")
            }

            console.log("Data berhasil dikirim")

            setIsOpen(false)
            setTimeout(() => window.location.reload(), 500)

            toast.success("Stakeholder berhasil ditambahkan!")
        } catch (error) {
            console.error("Gagal menyimpan data:", error)
            toast.error("Gagal menambahkan stakeholder!")
        } finally {
            setIsSaving(false)
        }
    }

    const resetForm = useCallback(() => {
        setNewStakeholder(initialStakeholder)
        setErrors({})
    }, [])

    return {
        isSaving,
        newStakeholder,
        errors,
        handleInputChange,
        handleSelectChange,
        handleSubmit,
        resetForm,
    }
}
