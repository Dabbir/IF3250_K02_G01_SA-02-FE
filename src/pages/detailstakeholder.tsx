"use client"


import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Pencil, Save, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"

interface Stakeholder {
    id: string;
    nama_stakeholder: string;
    jenis: string;
    telepon: string;
    email: string;
    foto: string;
    masjid_id: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

const API_URL = import.meta.env.VITE_HOST_NAME

export default function DetailStakeholder() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [stakeholder, setStakeholder] = useState<Stakeholder | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedStakeholder, setEditedStakeholder] = useState<Stakeholder | null>(null)

    useEffect(() => {
        const fetchStakeholderDetail = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token")

                if (!token) {
                    throw new Error("Authentication token not found")
                }

                const response = await fetch(`${API_URL}/api/stakeholder/getstakeholder/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch stakeholder: ${response.status}`)
                }

                const data = await response.json()

                if (data.success) {
                    setStakeholder(data.stakeholder)
                    setEditedStakeholder(data.stakeholder)
                } else {
                    throw new Error(data.message || "Failed to fetch stakeholder")
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
                toast.error("Gagal memuat detail aktivitas!")
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchStakeholderDetail()
        }
    }, [id])

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const handleSaveClick = async () => {
        if (!editedStakeholder) return

        setSaving(true)
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("Authentication token not found")
            }

            const body = {
                nama_stakeholder: editedStakeholder.nama_stakeholder,
                jenis: editedStakeholder.jenis,
                telepon: editedStakeholder.telepon,
                email: editedStakeholder.email,
            };

            const response = await fetch(`${API_URL}/api/stakeholder/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `Gagal memperbarui stakeholder!: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                // Update the local state with the updated data
                setStakeholder((prev) => (prev ? { ...prev, ...data.data } : data.data))
                setIsEditing(false)
                toast.success("Stakeholder berhasil diperbarui!")

                // setTimeout(() => window.location.reload(), 500)
            } else {
                throw new Error(data.message || "Gagal memperbarui stakeholder!")
            }
        } catch (error) {
            console.error("Error updating stakeholder:", error)
            toast.error(error instanceof Error ? error.message : "Gagal memperbarui stakeholder!")
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (field: keyof Stakeholder, value: string | number) => {
        setEditedStakeholder((prev) => (prev ? { ...prev, [field]: value } : null))
    }

    const handleGoBack = () => {
        navigate("/stakeholder")
    }

    const handleCancel = () => {
        setEditedStakeholder(stakeholder)
        setIsEditing(false)
    }

    if (loading) {
        return (
            <div className="m-5">
                <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={handleGoBack}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <Leaf className="h-6 w-6 text-slate-700" />
                            <CardTitle>Detail Stakeholder</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error || !stakeholder) {
        return (
            <div className="m-5">
                <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={handleGoBack}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <Leaf className="h-6 w-6 text-slate-700" />
                            <CardTitle>Detail Stakeholder</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[400px]">
                        <div className="text-center">
                            <p className="text-red-500 mb-4">{error || "Stakeholder not found"}</p>
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
            <Card className="w-full min-h-[500px] h-auto py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-wrap">
                <CardHeader className="flex flex-col md:flex-row md:justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="p-0" onClick={handleGoBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Leaf className="h-6 w-6 text-slate-700" />
                        <CardTitle>Detail Pemangku Kepentingan</CardTitle>
                    </div>

                    <div className="flex flex-col text-xs space-y-1 text-gray-700 text-left md:text-right">
                        <p>
                            Created At:{" "}
                            {stakeholder?.created_at ? new Date(stakeholder.created_at).toLocaleString() : "N/A"}
                        </p>
                        <p>
                            Updated At:{" "}
                            {stakeholder?.updated_at ? new Date(stakeholder.updated_at).toLocaleString() : "N/A"}
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="pb-10">
                    <div className="space-y-4">

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
                                    <TableHead>Nama Stakeholder</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                value={editedStakeholder?.nama_stakeholder || ""}
                                                onChange={(e) => handleChange("nama_stakeholder", e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        ) : (
                                            stakeholder.nama_stakeholder || "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Jenis Stakeholder</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <select
                                                value={editedStakeholder?.jenis || "Individu"}
                                                onChange={(e) => handleChange("jenis", e.target.value as "Individu" | "Organisasi" | "Perusahaan")}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="Individu">Individu</option>
                                                <option value="Organisasi">Organisasi</option>
                                                <option value="Perusahaan">Perusahaan</option>
                                            </select>
                                        ) : (
                                            stakeholder.jenis || "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Telepon</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                value={editedStakeholder?.telepon || ""}
                                                onChange={(e) => handleChange("telepon", e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        ) : (
                                            stakeholder.telepon || "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                value={editedStakeholder?.email || ""}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        ) : (
                                            stakeholder.email || "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}