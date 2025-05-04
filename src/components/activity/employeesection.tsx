"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import type { EmployeeActivity } from "@/types/activity"

interface EmployeeSectionProps {
    karyawan: EmployeeActivity[]
    isEditing: boolean
    onAdd: () => void
    onRemove: (index: number) => void
    onUpdate: (index: number, field: keyof EmployeeActivity, value: string) => void
}

export default function EmployeeSection({ karyawan, isEditing, onAdd, onRemove, onUpdate }: EmployeeSectionProps) {
    return (
        <div className="space-y-4 mt-8">
            <h2 className="text-lg font-medium">Karyawan</h2>

            {karyawan.length === 0 && !isEditing ? (
                <p className="text-gray-500 italic">Tidak ada karyawan</p>
            ) : (
                karyawan.map((employee, index) => (
                    <div key={`employee-${index}`} className="mb-6 p-4 border rounded-lg bg-gray-50">
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
                                {isEditing ? (
                                    <Input
                                        id={`employee-name-${index}`}
                                        value={employee.nama}
                                        onChange={(e) => onUpdate(index, "nama", e.target.value)}
                                    />
                                ) : (
                                    <p>{employee.nama || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`employee-email-${index}`}>Email</Label>
                                {isEditing ? (
                                    <Input
                                        id={`employee-email-${index}`}
                                        type="email"
                                        value={employee.email}
                                        onChange={(e) => onUpdate(index, "email", e.target.value)}
                                    />
                                ) : (
                                    <p>{employee.email || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`employee-phone-${index}`}>Telepon</Label>
                                {isEditing ? (
                                    <Input
                                        id={`employee-phone-${index}`}
                                        value={employee.telepon}
                                        onChange={(e) => onUpdate(index, "telepon", e.target.value)}
                                    />
                                ) : (
                                    <p>{employee.telepon || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`employee-address-${index}`}>Alamat</Label>
                                {isEditing ? (
                                    <Textarea
                                        id={`employee-address-${index}`}
                                        value={employee.alamat}
                                        onChange={(e) => onUpdate(index, "alamat", e.target.value)}
                                    />
                                ) : (
                                    <p>{employee.alamat || "N/A"}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}

            {isEditing && (
                <Button
                    type="button"
                    onClick={onAdd}
                    variant="outline"
                    size="sm"
                    className="text-[var(--green)]"
                >
                    <Plus className="h-4 w-4 mr-2" /> Tambah Karyawan
                </Button>
            )}
        </div>
    )
}
