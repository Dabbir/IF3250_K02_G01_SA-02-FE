"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import type { EmployeeActivity } from "@/types/activity"

interface EmployeeSectionProps {
    karyawan: EmployeeActivity[]
    isEditing: boolean
    onRemove: (index: number) => void
    allKaryawan: EmployeeActivity[]
    filteredKaryawan: EmployeeActivity[]
    showKaryawanDropdown: boolean
    setShowKaryawanDropdown: React.Dispatch<React.SetStateAction<boolean>>
    karyawanSearch: string
    onSearchChange: (value: string) => void
    onSelect: (karyawan: EmployeeActivity) => void
    onDropdownBlur: (e: React.FocusEvent<HTMLDivElement>) => void
}

export default function EmployeeSection({
    karyawan,
    isEditing,
    onRemove,
    allKaryawan,
    filteredKaryawan,
    showKaryawanDropdown,
    setShowKaryawanDropdown,
    karyawanSearch,
    onSearchChange,
    onSelect,
    onDropdownBlur,
}: EmployeeSectionProps) {
    return (
        <div className="mt-8">
            <div className="flex-col space-y-4 items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Karyawan</h2>
                {isEditing && (
                    <div className="relative" onBlur={onDropdownBlur}>
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Cari dan pilih karyawan..."
                                value={karyawanSearch}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onFocus={() => setShowKaryawanDropdown(true)}
                                className="w-full md:w-100"
                            />
                        </div>

                        {showKaryawanDropdown && (
                            <div className="absolute z-10 w-64 mt-1 bg-white border rounded-md shadow-md max-h-60 overflow-auto">
                                {filteredKaryawan.length > 0 ? (
                                    filteredKaryawan.map((employee) => (
                                        <div
                                            key={employee.id}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                onSelect(employee)
                                            }}
                                        >
                                            {employee.nama} - {employee.email}
                                        </div>
                                    ))
                                ) : allKaryawan.length > 0 ? (
                                    <div className="px-4 py-2 text-gray-500">Tidak ditemukan</div>
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">Tidak ada data karyawan</div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {karyawan.length === 0 && !isEditing ? (
                <p className="text-gray-500 italic">Tidak ada karyawan</p>
            ) : (
                karyawan.map((employee, index) => (
                    <div key={`employee-${index}`} className="mb-6 p-4 border rounded-lg">
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
                                <Label htmlFor={`employee-name-${index}`}>Nama</Label>
                                <p>{employee.nama || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`employee-email-${index}`}>Email</Label>
                                <p>{employee.email || "N/A"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`employee-phone-${index}`}>Telepon</Label>
                                <p>{employee.telepon || "N/A"}</p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`employee-address-${index}`}>Alamat</Label>
                                <p>{employee.alamat || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
