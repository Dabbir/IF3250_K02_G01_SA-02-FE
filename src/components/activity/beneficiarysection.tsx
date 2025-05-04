"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import type { BeneficiaryActivity } from "@/types/activity"

interface BeneficiarySectionProps {
    beneficiaries: BeneficiaryActivity[]
    isEditing: boolean
    onAdd: () => void
    onRemove: (index: number) => void
    onUpdate: (index: number, field: keyof BeneficiaryActivity, value: string) => void
}

export default function BeneficiarySection({
    beneficiaries,
    isEditing,
    onAdd,
    onRemove,
    onUpdate,
}: BeneficiarySectionProps) {
    return (
        <div className="space-y-4 mt-8">

            <h2 className="text-lg font-medium">Penerima Manfaat</h2>

            {beneficiaries.length === 0 && !isEditing ? (
                <p className="text-gray-500 italic">Tidak ada penerima manfaat</p>
            ) : (
                beneficiaries.map((beneficiary, index) => (
                    <div key={`beneficiary-${index}`} className="mb-6 p-4 border rounded-lg bg-gray-50">
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
                                {isEditing ? (
                                    <Input
                                        id={`beneficiary-institution-${index}`}
                                        value={beneficiary.nama_instansi}
                                        onChange={(e) => onUpdate(index, "nama_instansi", e.target.value)}
                                    />
                                ) : (
                                    <p>{beneficiary.nama_instansi || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`beneficiary-contact-${index}`}>Nama Kontak Personil</Label>
                                {isEditing ? (
                                    <Input
                                        id={`beneficiary-contact-${index}`}
                                        value={beneficiary.nama_kontak}
                                        onChange={(e) => onUpdate(index, "nama_kontak", e.target.value)}
                                    />
                                ) : (
                                    <p>{beneficiary.nama_kontak || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`beneficiary-phone-${index}`}>No Telepon</Label>
                                {isEditing ? (
                                    <Input
                                        id={`beneficiary-phone-${index}`}
                                        value={beneficiary.telepon}
                                        onChange={(e) => onUpdate(index, "telepon", e.target.value)}
                                    />
                                ) : (
                                    <p>{beneficiary.telepon || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`beneficiary-email-${index}`}>Email</Label>
                                {isEditing ? (
                                    <Input
                                        id={`beneficiary-email-${index}`}
                                        type="email"
                                        value={beneficiary.email}
                                        onChange={(e) => onUpdate(index, "email", e.target.value)}
                                    />
                                ) : (
                                    <p>{beneficiary.email || "N/A"}</p>
                                )}
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor={`beneficiary-address-${index}`}>Alamat</Label>
                                {isEditing ? (
                                    <Textarea
                                        id={`beneficiary-address-${index}`}
                                        value={beneficiary.alamat}
                                        onChange={(e) => onUpdate(index, "alamat", e.target.value)}
                                    />
                                ) : (
                                    <p>{beneficiary.alamat || "N/A"}</p>
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
                    <Plus className="h-4 w-4 mr-2" /> Tambah Penerima Manfaat
                </Button>
            )}
        </div>
    )
}
