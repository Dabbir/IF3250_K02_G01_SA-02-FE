"use client"

import { Leaf } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"

// Components
import { Card, CardContent } from "@/components/ui/card"
import LoadingState from "@/components/loading/loading"
import ErrorState from "@/components/error/error"
import DetailHeader from "@/components/shared/detailheader"
import DetailTable from "@/components/activity/detailtable"
import Documentation from "@/components/activity/documentation"
import StakeholderSection from "@/components/activity/stakeholdersection"
import BeneficiarySection from "@/components/activity/beneficiarysection"
import EmployeeSection from "@/components/activity/employeesection"
import SaveCancelButtons from "@/components/shared/savecancelbutton"
import EditButton from "@/components/shared/editbutton"

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
        removeStakeholder,
        removeBeneficiary,
        removeKaryawan,
        allStakeholders,
        showStakeholderDropdown,
        setShowStakeholderDropdown,
        stakeholderSearch,
        handleStakeholderSearchChange,
        handleSelectStakeholder,
        handleStakeholderDropdownBlur,
        allBeneficiaries,
        showBeneficiaryDropdown,
        setShowBeneficiaryDropdown,
        beneficiarySearch,
        handleBeneficiarySearchChange,
        handleSelectBeneficiary,
        handleBeneficiaryDropdownBlur,
        allKaryawan,
        showKaryawanDropdown,
        setShowKaryawanDropdown,
        karyawanSearch,
        handleKaryawanSearchChange,
        handleSelectKaryawan,
        handleKaryawanDropdownBlur,
    } = useDetailActivity(id)

    const handleGoBack = () => {
        navigate("/kegiatan")
    }

    if (loading) {
        return <LoadingState title="Detail Kegiatan" onGoBack={handleGoBack} Icon={Leaf} />
    }

    if (error || !kegiatan) {
        return (
            <ErrorState
                error={error || "Aktivitas tidak ditemukan"}
                title="Detail Kegiatan"
                onGoBack={handleGoBack}
                Icon={Leaf}
            />
        )
    }

    return (
        <div className="m-5">
            <Card className="w-full min-h-[500px] h-auto py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-wrap">
                <DetailHeader
                    title="Detail Kegiatan"
                    createdAt={kegiatan?.created_at ?? null}
                    updatedAt={kegiatan?.updated_at ?? null}
                    onGoBack={handleGoBack}
                    Icon={Leaf}
                />

                <CardContent className="pb-10">
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold">{kegiatan.nama_aktivitas}</h1>
                        <EditButton
                            onEdit={handleEditClick}
                            isEditing={isEditing}
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

                        {/* Stakeholder Section */}
                        <StakeholderSection
                            stakeholders={stakeholders}
                            isEditing={isEditing}
                            onRemove={removeStakeholder}
                            allStakeholders={allStakeholders}
                            showStakeholderDropdown={showStakeholderDropdown}
                            setShowStakeholderDropdown={setShowStakeholderDropdown}
                            stakeholderSearch={stakeholderSearch}
                            onSearchChange={handleStakeholderSearchChange}
                            onSelect={handleSelectStakeholder}
                            onDropdownBlur={handleStakeholderDropdownBlur}
                        />

                        {/* Penerima Manfaat Section */}
                        <BeneficiarySection
                            beneficiaries={beneficiaries}
                            isEditing={isEditing}
                            onRemove={removeBeneficiary}
                            allBeneficiaries={allBeneficiaries}
                            showBeneficiaryDropdown={showBeneficiaryDropdown}
                            setShowBeneficiaryDropdown={setShowBeneficiaryDropdown}
                            beneficiarySearch={beneficiarySearch}
                            onSearchChange={handleBeneficiarySearchChange}
                            onSelect={handleSelectBeneficiary}
                            onDropdownBlur={handleBeneficiaryDropdownBlur}
                        />

                        {/* Karyawan Section */}
                        <EmployeeSection
                            karyawan={karyawan}
                            isEditing={isEditing}
                            onRemove={removeKaryawan}
                            allKaryawan={allKaryawan}
                            showKaryawanDropdown={showKaryawanDropdown}
                            setShowKaryawanDropdown={setShowKaryawanDropdown}
                            karyawanSearch={karyawanSearch}
                            onSearchChange={handleKaryawanSearchChange}
                            onSelect={handleSelectKaryawan}
                            onDropdownBlur={handleKaryawanDropdownBlur}
                        />

                        <Documentation
                            dokumentasiList={dokumentasiList}
                            isEditing={isEditing}
                            onAddImages={handleAddImages}
                            onRemoveImage={handleRemoveImage}
                        />

                        {isEditing && (
                            <SaveCancelButtons
                                saving={saving}
                                onSave={handleSaveClick}
                                onCancel={handleCancel}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
