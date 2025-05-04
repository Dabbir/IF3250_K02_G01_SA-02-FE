"use client"

import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

// Components
import LoadingState from "@/components/loading/loading"
import ErrorState from "@/components/error/error"
import DetailHeader from "@/components/activity/detailheader"
import EditButtons from "@/components/activity/editbutton"
import DetailTable from "@/components/activity/detailtable"
import Documentation from "@/components/activity/documentation"

// Hooks
import useDetailActivity from "@/hooks/use-detailactivity"

export default function DetailKegiatan() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const {
        kegiatan,
        loading,
        saving,
        error,
        isEditing,
        editedKegiatan,
        dokumentasiList,
        programs,
        handleEditClick,
        handleCancel,
        handleChange,
        handleProgramSelect,
        handleProgramChange,
        handleRemoveImage,
        handleAddImages,
        handleSaveClick,
    } = useDetailActivity(id)

    const handleGoBack = () => {
        navigate("/kegiatan")
    }

    if (loading) {
        return <LoadingState title="Detail Kegiatan" onGoBack={handleGoBack} />
    }

    if (error || !kegiatan) {
        return <ErrorState error={error || "Activity not found"} title="Detail Kegiatan" onGoBack={handleGoBack} />
    }

    return (
        <div className="m-5">
            <Card className="w-full min-h-[500px] h-auto py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-wrap">
                <DetailHeader kegiatan={kegiatan} onGoBack={handleGoBack} />

                <CardContent className="pb-10">
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold">{kegiatan.nama_aktivitas}</h1>

                        <EditButtons
                            isEditing={isEditing}
                            saving={saving}
                            onEdit={handleEditClick}
                            onSave={handleSaveClick}
                            onCancel={handleCancel}
                        />

                        <DetailTable
                            kegiatan={kegiatan}
                            editedKegiatan={editedKegiatan}
                            isEditing={isEditing}
                            programs={programs}
                            onProgramSelect={handleProgramSelect}
                            onProgramChange={handleProgramChange}
                            onChange={handleChange}
                        />

                        <Documentation
                            dokumentasiList={dokumentasiList}
                            isEditing={isEditing}
                            onAddImages={handleAddImages}
                            onRemoveImage={handleRemoveImage}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
