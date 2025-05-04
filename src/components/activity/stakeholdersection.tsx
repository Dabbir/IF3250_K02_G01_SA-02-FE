"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StakeholderActivity } from "@/types/activity"

interface StakeholderSectionProps {
    stakeholders: StakeholderActivity[]
    isEditing: boolean
    onAdd: () => void
    onRemove: (index: number) => void
    onUpdate: (index: number, field: keyof StakeholderActivity, value: string) => void
}

export default function StakeholderSection({
    stakeholders,
    isEditing,
    onAdd,
    onRemove,
    onUpdate,
}: StakeholderSectionProps) {
    return (
        <div className="space-y-4 mt-8">

            <h2 className="text-lg font-medium">Stakeholder</h2>

            {stakeholders.length === 0 && !isEditing ? (
                <p className="text-gray-500 italic">Tidak ada stakeholder</p>
            ) : (
                stakeholders.map((stakeholder, index) => (
                    <div key={`stakeholder-${index}`} className="mb-6 p-4 border rounded-lg bg-gray-50">
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
                                {isEditing ? (
                                    <Input
                                        id={`stakeholder-name-${index}`}
                                        value={stakeholder.nama_stakeholder}
                                        onChange={(e) => onUpdate(index, "nama_stakeholder", e.target.value)}
                                    />
                                ) : (
                                    <p>{stakeholder.nama_stakeholder || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`stakeholder-type-${index}`}>Jenis</Label>
                                {isEditing ? (
                                    <Select
                                        value={stakeholder.jenis}
                                        onValueChange={(value) =>
                                            onUpdate(index, "jenis", value as "Individu" | "Organisasi" | "Perusahaan")
                                        }
                                    >
                                        <SelectTrigger id={`stakeholder-type-${index}`}>
                                            <SelectValue placeholder="Pilih jenis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Individu">Individu</SelectItem>
                                            <SelectItem value="Organisasi">Organisasi</SelectItem>
                                            <SelectItem value="Perusahaan">Perusahaan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p>{stakeholder.jenis || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`stakeholder-phone-${index}`}>No Telepon</Label>
                                {isEditing ? (
                                    <Input
                                        id={`stakeholder-phone-${index}`}
                                        value={stakeholder.telepon}
                                        onChange={(e) => onUpdate(index, "telepon", e.target.value)}
                                    />
                                ) : (
                                    <p>{stakeholder.telepon || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`stakeholder-email-${index}`}>Email</Label>
                                {isEditing ? (
                                    <Input
                                        id={`stakeholder-email-${index}`}
                                        type="email"
                                        value={stakeholder.email}
                                        onChange={(e) => onUpdate(index, "email", e.target.value)}
                                    />
                                ) : (
                                    <p>{stakeholder.email || "N/A"}</p>
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
                    <Plus className="h-4 w-4 mr-2" /> Tambah Stakeholder
                </Button>
            )}
        </div>
    )
}
