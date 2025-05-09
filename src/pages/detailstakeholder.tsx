"use client"

import { useNavigate } from "react-router-dom"
import { Users } from "lucide-react"

// components
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import LoadingState from "@/components/loading/loading"
import ErrorState from "@/components/error/error"

// hooks
import useDetailStakeholder from "@/hooks/use-detailstakeholder"
import DetailHeader from "@/components/shared/detailheader"
import EditButtons from "@/components/shared/editbutton"

export default function DetailStakeholder() {
    const navigate = useNavigate()

    const {
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
    } = useDetailStakeholder()

    const handleGoBack = () => navigate("/stakeholder")

    if (loading) {
        return <LoadingState
            title="Detail Pemangku Kepentingan"
            onGoBack={handleGoBack}
            Icon={Users}
        />
    }

    if (error || !stakeholder) {
        return <ErrorState
            error={error || "Pemangku kepentingan tidak ditemukan"}
            title="Detail Pemangku Kepentingan"
            onGoBack={handleGoBack}
            Icon={Users}
        />
    }

    return (
        <div className="m-5">
            <Card className="w-full min-h-[500px] h-auto py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-wrap">
                <DetailHeader
                    title="Detail Pemangku Kepentingan"
                    createdAt={stakeholder?.created_at ?? null}
                    updatedAt={stakeholder?.updated_at ?? null}
                    onGoBack={handleGoBack}
                    Icon={Users}
                />

                <CardContent className="pb-10">
                    <div className="space-y-4">
                        <EditButtons
                            isEditing={isEditing}
                            saving={saving}
                            onEdit={handleEditClick}
                            onSave={handleSaveClick}
                            onCancel={handleCancel}
                        />

                        <Table className="border rounded-lg overflow-hidden mb-2">
                            <TableBody>
                                <TableRow>
                                    <TableHead>Nama Pemangku Kepentingan</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    type="text"
                                                    value={editedStakeholder?.nama_stakeholder || ""}
                                                    onChange={(e) => handleChange("nama_stakeholder", e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                />
                                                {formErrors?.nama_stakeholder && (
                                                    <p className="text-sm text-red-500 mt-1">{formErrors.nama_stakeholder}</p>
                                                )}
                                            </>
                                        ) : (
                                            stakeholder.nama_stakeholder || "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Jenis Pemangku Kepentingan</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <>
                                                <select
                                                    value={editedStakeholder?.jenis || "Individu"}
                                                    onChange={(e) => handleChange("jenis", e.target.value as "Individu" | "Organisasi" | "Perusahaan")}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                >
                                                    <option value="Individu">Individu</option>
                                                    <option value="Organisasi">Organisasi</option>
                                                    <option value="Perusahaan">Perusahaan</option>
                                                </select>
                                                {formErrors?.jenis && (
                                                    <p className="text-sm text-red-500 mt-1">{formErrors.jenis}</p>
                                                )}
                                            </>
                                        ) : (
                                            stakeholder.jenis || "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Telepon</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    type="text"
                                                    value={editedStakeholder?.telepon || ""}
                                                    onChange={(e) => handleChange("telepon", e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                />
                                                {formErrors?.telepon && (
                                                    <p className="text-sm text-red-500 mt-1">{formErrors.telepon}</p>
                                                )}
                                            </>
                                        ) : (
                                            stakeholder.telepon || "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <>
                                                <Input
                                                    type="text"
                                                    value={editedStakeholder?.email || ""}
                                                    onChange={(e) => handleChange("email", e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-md"
                                                />
                                                {formErrors?.email && (
                                                    <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                                                )}
                                            </>
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