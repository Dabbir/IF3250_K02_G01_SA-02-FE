"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Pencil, Save, Loader2, ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"

interface Kegiatan {
    id: string
    nama_aktivitas: string
    program_id: string
    nama_program: string
    deskripsi: string
    dokumentasi?: string
    tanggal_mulai: string
    tanggal_selesai: string
    biaya_implementasi: number
    status: "Unstarted" | "Ongoing" | "Finished"
    created_at?: string
    updated_at?: string
}

type ImageData = {
    url: string
    file: File
}

const API_URL = import.meta.env.VITE_HOST_NAME

export default function DetailKegiatan() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedKegiatan, setEditedKegiatan] = useState<Kegiatan | null>(null)
    const [deletedImages, setDeletedImages] = useState<string[]>([])
    const [dokumentasiList, setDokumentasiList] = useState<string[]>([])
    const [images, setImages] = useState<ImageData[]>([])
    const [prevDokumentasi, setPrevDokumentasi] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const formatRupiah = (amount: number): string => {
        const roundedAmount = Math.floor(amount);
        
        return roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      };

    useEffect(() => {
        const fetchActivityDetail = async () => {
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

        if (id) {
            fetchActivityDetail()
        }
    }, [id])

    useEffect(() => {
        if (kegiatan) {
            setDokumentasiList(getDokumentasiList(kegiatan.dokumentasi))
        }
    }, [kegiatan])

    const getDokumentasiList = (dokumentasi?: string): string[] => {
        if (!dokumentasi) return []

        try {
            const parsed = JSON.parse(dokumentasi);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat dokumentasi!")
            return dokumentasi.startsWith('http') ? [dokumentasi] : [];
        }
    }

    const handleEditClick = () => {
        setIsEditing(true)
        fetchPrograms()

        setPrevDokumentasi(dokumentasiList)
        setImages([])
    }

    const handleRemoveImage = (index: number) => {
        const imageToRemove = dokumentasiList[index]

        setDokumentasiList((prev) => prev.filter((_, i) => i !== index))
        setDeletedImages((prev) => [...prev, imageToRemove])
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

    const handleSaveClick = async () => {
        if (!editedKegiatan) return

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
                setKegiatan((prev) => (prev ? { ...prev, ...data.data } : data.data))
                setIsEditing(false)
                setImages([])
                setDeletedImages([])
                toast.success("Kegiatan berhasil diperbarui!")

                // setTimeout(() => window.location.reload(), 500)
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

    const handleChange = (field: keyof Kegiatan, value: string | number) => {
        setEditedKegiatan((prev) => (prev ? { ...prev, [field]: value } : null))
    }

    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [filteredPrograms, setFilteredPrograms] = useState<{ id: number; nama_program: string }[]>([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [programs, setPrograms] = useState<{ id: number; nama_program: string }[]>([])

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

    const handleInputChangeProgram = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEditedKegiatan((prev) => (prev ? { ...prev, nama_program: value } : null))
        setShowDropdown(true)
        setFilteredPrograms(programs.filter((p) => p.nama_program.toLowerCase().includes(value.toLowerCase())))
    }

    const handleSelectProgram = (program: { id: number; nama_program: string }) => {
        setEditedKegiatan((prev) =>
            prev ? { ...prev, nama_program: program.nama_program, program_id: program.id.toString() } : null,
        )
        setShowDropdown(false)
    }

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!inputRef.current?.contains(e.relatedTarget) && !dropdownRef.current?.contains(e.relatedTarget)) {
            setShowDropdown(false)
        }
    }

    const handleGoBack = () => {
        navigate("/kegiatan")
    }

    const handleCancel = () => {
        setEditedKegiatan(kegiatan)
        setDeletedImages([])
        setImages([])
        setIsEditing(false)
    }

    if (loading) {
        return (
            <div className="m-5">
                <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-auto">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={handleGoBack}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <Leaf className="h-6 w-6 text-slate-700" />
                            <CardTitle>Detail Kegiatan</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error || !kegiatan) {
        return (
            <div className="m-5">
                <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-auto">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={handleGoBack}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <Leaf className="h-6 w-6 text-slate-700" />
                            <CardTitle>Detail Kegiatan</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[400px]">
                        <div className="text-center">
                            <p className="text-red-500 mb-4">{error || "Activity not found"}</p>
                            <Button onClick={() => window.location.reload()} className="bg-[#3A786D] text-white">
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="m-5">
            <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-auto">
                <CardHeader className="flex flex-col md:flex-row md:justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="p-0" onClick={handleGoBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Leaf className="h-6 w-6 text-slate-700" />
                        <CardTitle>Detail Kegiatan</CardTitle>
                    </div>

                    <div className="flex flex-col text-xs space-y-1 text-gray-700 text-left md:text-right">
                        <p>
                            Created At:{" "}
                            {kegiatan?.created_at ? new Date(kegiatan.created_at).toLocaleString() : "N/A"}
                        </p>
                        <p>
                            Updated At:{" "}
                            {kegiatan?.updated_at ? new Date(kegiatan.updated_at).toLocaleString() : "N/A"}
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="pb-10">
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold">{kegiatan.nama_aktivitas}</h1>

                        <div className="flex justify-end mt-4">
                            {!isEditing ? (
                                <Button variant="outline" size="sm" onClick={handleEditClick}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            ) : (
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleSaveClick} disabled={saving}>
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

                        <Table className="border rounded-lg overflow-hidden mb-2">
                            <TableBody>
                                <TableRow>
                                    <TableHead>Program Terafiliasi</TableHead>
                                    <TableCell className="relative" onBlur={handleBlur}>
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    id="programTerafiliasi"
                                                    ref={inputRef}
                                                    value={editedKegiatan?.nama_program || ""}
                                                    onChange={handleInputChangeProgram}
                                                    onFocus={() => setShowDropdown(true)}
                                                    className="w-full"
                                                />

                                                {showDropdown && (
                                                    <div
                                                        ref={dropdownRef}
                                                        className="text-[12px] absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-auto"
                                                    >
                                                        {filteredPrograms.length > 0 ? (
                                                            filteredPrograms.map((program) => (
                                                                <div
                                                                    key={program.id}
                                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault()
                                                                        handleSelectProgram(program)
                                                                    }}
                                                                >
                                                                    {program.nama_program}
                                                                </div>
                                                            ))
                                                        ) : programs.length > 0 ? (
                                                            programs.map((program) => (
                                                                <div
                                                                    key={program.id}
                                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault()
                                                                        handleSelectProgram(program)
                                                                    }}
                                                                >
                                                                    {program.nama_program}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-2 cursor-pointer text-gray-500">Tidak ada program</div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            kegiatan.nama_program || "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Tanggal Mulai</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={
                                                    editedKegiatan?.tanggal_mulai
                                                        ? new Date(editedKegiatan.tanggal_mulai).toISOString().split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) => handleChange("tanggal_mulai", e.target.value)}
                                            />
                                        ) : kegiatan.tanggal_mulai ? (
                                            new Date(kegiatan.tanggal_mulai).toLocaleDateString("id-ID")
                                        ) : (
                                            "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Tanggal Selesai</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={
                                                    editedKegiatan?.tanggal_selesai
                                                        ? new Date(editedKegiatan.tanggal_selesai).toISOString().split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) => handleChange("tanggal_selesai", e.target.value)}
                                            />
                                        ) : kegiatan.tanggal_selesai ? (
                                            new Date(kegiatan.tanggal_selesai).toLocaleDateString("id-ID")
                                        ) : (
                                            "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Biaya Implementasi</TableHead>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <span>Rp.</span>
                                            {isEditing ? (
                                                <Input
                                                    type="number"
                                                    value={editedKegiatan?.biaya_implementasi || 0}
                                                    onChange={(e) => handleChange("biaya_implementasi", Number(e.target.value))}
                                                />
                                            ) : kegiatan.biaya_implementasi ? (
                                                kegiatan.biaya_implementasi.toLocaleString("id-ID")
                                            ) : (
                                                kegiatan.biaya_implementasi ? formatRupiah(kegiatan.biaya_implementasi) : "0"
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <select
                                                value={editedKegiatan?.status || "Unstarted"}
                                                onChange={(e) => handleChange("status", e.target.value as "Unstarted" | "Ongoing" | "Finished")}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="Unstarted">Unstarted</option>
                                                <option value="Ongoing">Ongoing</option>
                                                <option value="Finished">Finished</option>
                                            </select>
                                        ) : (
                                            kegiatan.status
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Textarea
                                                value={editedKegiatan?.deskripsi || ""}
                                                onChange={(e) => handleChange("deskripsi", e.target.value)}
                                                className="min-h-[100px]"
                                            />
                                        ) : (
                                            kegiatan.deskripsi || "No description available"
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {(dokumentasiList.length > 0 || isEditing) && (
                            <div className="mt-8">
                                <h2 className="text-lg font-medium mb-4">Dokumentasi</h2>

                                {isEditing && (
                                    <div className="mb-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            multiple
                                            accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
                                            onChange={handleAddImages}
                                            className="hidden"
                                            id="dokumentasi-upload"
                                        />
                                        <label
                                            htmlFor="dokumentasi-upload"
                                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            <Upload className="h-4 w-4 mr-2" /> Tambah Foto
                                        </label>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center place-items-center">
                                    {(isEditing ? dokumentasiList : dokumentasiList).map((url, index) => (
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
                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600"
                                                    onClick={() => handleRemoveImage(index)}
                                                >
                                                    <span className="sr-only">Remove</span>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}