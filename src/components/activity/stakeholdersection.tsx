"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import type { StakeholderActivity } from "@/types/activity"

interface StakeholderSectionProps {
    stakeholders: StakeholderActivity[]
    isEditing: boolean
    onRemove: (index: number) => void
    allStakeholders: StakeholderActivity[]
    showStakeholderDropdown: boolean
    setShowStakeholderDropdown: React.Dispatch<React.SetStateAction<boolean>>
    stakeholderSearch: string
    onSearchChange: (value: string) => void
    onSelect: (stakeholder: StakeholderActivity) => void
    onDropdownBlur: (e: React.FocusEvent<HTMLDivElement>) => void
}

export default function StakeholderSection({
    stakeholders,
    isEditing,
    onRemove,
    allStakeholders,
    showStakeholderDropdown,
    setShowStakeholderDropdown,
    stakeholderSearch,
    onSearchChange,
    onSelect,
    onDropdownBlur,
}: StakeholderSectionProps) {
    return (
        <div className="mt-8">
            <div className="flex-col space-y-4 items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Pemangku Kepentingan</h2>
                {isEditing && (
                    <div className="relative" onBlur={onDropdownBlur}>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Cari dan pilih pemangku kepentingan..."
                                value={stakeholderSearch}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onFocus={() => setShowStakeholderDropdown(true)}
                                className="w-full md:w-100"
                            />
                        </div>

                        {showStakeholderDropdown && (
                            <div className="absolute z-10 w-100 mt-1 bg-white border rounded-md shadow-md max-h-60 overflow-auto">
                                {allStakeholders.length > 0 ? (
                                    allStakeholders.map((stakeholder) => (
                                        <div
                                            key={stakeholder.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                onSelect(stakeholder)
                                            }}
                                        >
                                            {stakeholder.nama_stakeholder} ({stakeholder.jenis})
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

            {stakeholders.length === 0 && !isEditing ? (
                <p className="text-gray-500 italic">Tidak ada stakeholder</p>
            ) : (
                stakeholders.map((stakeholder, index) => (
                    <div key={`stakeholder-${index}`} className="mb-6 p-4 border rounded-lg">
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
                                <Label htmlFor={`stakeholder-name-${index}`}>Nama Stakeholder</Label>
                                <p>{stakeholder.nama_stakeholder || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`stakeholder-type-${index}`}>Jenis</Label>
                                <p>{stakeholder.jenis || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`stakeholder-phone-${index}`}>No Telepon</Label>
                                <p>{stakeholder.telepon || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`stakeholder-email-${index}`}>Email</Label>
                                <p>{stakeholder.email || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
