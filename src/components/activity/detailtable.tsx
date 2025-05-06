"use client"

// components
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ProgramDropdown from "@/components/activity/programdropdown"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"

// types and utils
import type { DetailedKegiatan, Program } from "@/types/activity"
import { formatDisplayDate, formatRupiah } from "@/utils/formatters"

interface DetailTableProps {
    kegiatan: DetailedKegiatan
    editedKegiatan: DetailedKegiatan | null
    isEditing: boolean
    programs: Program[]
    onProgramSelect: (program: Program) => void
    onProgramChange: (value: string) => void
    onChange: (field: keyof DetailedKegiatan, value: string | number) => void
}

export default function DetailTable({
    kegiatan,
    editedKegiatan,
    isEditing,
    programs,
    onProgramSelect,
    onProgramChange,
    onChange,
}: DetailTableProps) {
    return (
        <Table className="border rounded-lg overflow-hidden mb-2">
            <TableBody>
                <TableRow>
                    <TableHead>Program Terafiliasi</TableHead>
                    <TableCell>
                        {isEditing ? (
                            <ProgramDropdown
                                value={editedKegiatan?.nama_program || ""}
                                programs={programs}
                                onSelect={onProgramSelect}
                                onChange={onProgramChange}
                            />
                        ) : (
                            kegiatan.nama_program || "N/A"
                        )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Tanggal Mulai</TableHead>
                    <TableCell>
                        {isEditing ? (
                            <Input
                                type="date"
                                value={
                                    editedKegiatan?.tanggal_mulai
                                        ? new Date(editedKegiatan.tanggal_mulai).toISOString().split("T")[0]
                                        : ""
                                }
                                onChange={(e) => onChange("tanggal_mulai", e.target.value)}
                            />
                        ) : kegiatan.tanggal_mulai ? (
                            formatDisplayDate(kegiatan.tanggal_mulai)
                        ) : (
                            "N/A"
                        )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Tanggal Selesai</TableHead>
                    <TableCell>
                        {isEditing ? (
                            <Input
                                type="date"
                                value={
                                    editedKegiatan?.tanggal_selesai
                                        ? new Date(editedKegiatan.tanggal_selesai).toISOString().split("T")[0]
                                        : ""
                                }
                                onChange={(e) => onChange("tanggal_selesai", e.target.value)}
                            />
                        ) : kegiatan.tanggal_selesai ? (
                            formatDisplayDate(kegiatan.tanggal_selesai)
                        ) : (
                            "N/A"
                        )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Biaya Implementasi</TableHead>
                    <TableCell>
                        <div className="flex items-center">
                            {isEditing ? (
                                <>
                                    <span>Rp</span>
                                    <Input
                                        type="number"
                                        value={editedKegiatan?.biaya_implementasi || 0}
                                        onChange={(e) => onChange("biaya_implementasi", Number(e.target.value))}
                                    />
                                </>
                            ) : (
                                <>Rp{formatRupiah(kegiatan.biaya_implementasi)}</>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Status</TableHead>
                    <TableCell>
                        {isEditing ? (
                            <select
                                value={editedKegiatan?.status || "Belum Mulai"}
                                onChange={(e) => onChange("status", e.target.value as "Belum Mulai" | "Berjalan" | "Selesai")}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="Belum Mulai">Belum Mulai</option>
                                <option value="Berjalan">Berjalan</option>
                                <option value="Selesai">Selesai</option>
                            </select>
                        ) : (
                            kegiatan.status
                        )}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Deskripsi</TableHead>
                    <TableCell>
                        {isEditing ? (
                            <Textarea
                                value={editedKegiatan?.deskripsi || ""}
                                onChange={(e) => onChange("deskripsi", e.target.value)}
                                className="min-h-[100px]"
                            />
                        ) : (
                            kegiatan.deskripsi || "No description available"
                        )}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
