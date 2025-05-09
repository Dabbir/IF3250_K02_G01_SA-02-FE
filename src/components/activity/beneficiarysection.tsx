"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import type { BeneficiaryActivity } from "@/types/activity"

interface BeneficiarySectionProps {
    beneficiaries: BeneficiaryActivity[]
    isEditing: boolean
    onRemove: (index: number) => void
    allBeneficiaries: BeneficiaryActivity[]
    showBeneficiaryDropdown: boolean
    setShowBeneficiaryDropdown: React.Dispatch<React.SetStateAction<boolean>>
    beneficiarySearch: string
    onSearchChange: (value: string) => void
    onSelect: (beneficiary: BeneficiaryActivity) => void
    onDropdownBlur: (e: React.FocusEvent<HTMLDivElement>) => void
}

export default function BeneficiarySection({
    beneficiaries,
    isEditing,
    onRemove,
    allBeneficiaries,
    showBeneficiaryDropdown,
    setShowBeneficiaryDropdown,
    beneficiarySearch,
    onSearchChange,
    onSelect,
    onDropdownBlur,
}: BeneficiarySectionProps) {
    return (
        <div className="mt-8">
            <div className="flex-col space-y-4 items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Penerima Manfaat</h2>
                {isEditing && (
                    <div className="relative" onBlur={onDropdownBlur}>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Cari dan pilih penerima manfaat..."
                                value={beneficiarySearch}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onFocus={() => setShowBeneficiaryDropdown(true)}
                                className="w-full md:w-100"
                            />
                        </div>

                        {showBeneficiaryDropdown && (
                            <div className="absolute z-10 w-100 mt-1 bg-white border rounded-md shadow-md max-h-60 overflow-auto">
                                {allBeneficiaries.length > 0 ? (
                                    allBeneficiaries.map((beneficiary) => (
                                        <div
                                            key={beneficiary.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                onSelect(beneficiary)
                                            }}
                                        >
                                            {beneficiary.nama_instansi} - {beneficiary.nama_kontak}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">Data tidak ditemukan</div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {beneficiaries.length === 0 && !isEditing ? (
                <p className="text-gray-500 italic">Tidak ada penerima manfaat</p>
            ) : (
                beneficiaries.map((beneficiary, index) => (
                    <div key={`beneficiary-${index}`} className="mb-6 p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            {isEditing && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemove(index)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`beneficiary-institution-${index}`}>Nama Instansi/Lembaga</Label>
                                <p>{beneficiary.nama_instansi || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`beneficiary-contact-${index}`}>Nama Kontak Personil</Label>
                                <p>{beneficiary.nama_kontak || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`beneficiary-phone-${index}`}>No Telepon</Label>
                                <p>{beneficiary.telepon || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`beneficiary-email-${index}`}>Email</Label>
                                <p>{beneficiary.email || "N/A"}</p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`beneficiary-address-${index}`}>Alamat</Label>
                                <p>{beneficiary.alamat || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
