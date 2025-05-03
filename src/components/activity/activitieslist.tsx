"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Pencil, Share2, Trash2 } from "lucide-react"
import type { Kegiatan } from "@/types/Activity"
import StatusBadge from "@/components/badge/statusbadge"
import { formatDisplayDate, formatRupiah } from "@/utils/formatters"

interface ActivitiesTableProps {
    activities: Kegiatan[]
    sortColumn: string
    onSortChange: (column: string) => void
    onNavigate: (id: string | undefined) => void
    onShare: (activity: Kegiatan) => void
    onDelete: (activity: Kegiatan) => void
}

export default function ActivitiesList({
    activities,
    sortColumn,
    onSortChange,
    onNavigate,
    onShare,
    onDelete,
}: ActivitiesTableProps) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="pl-7 w-[200px] cursor-pointer" onClick={() => onSortChange("nama_aktivitas")}>
                            <div className="flex items-center">
                                Nama Kegiatan
                                {sortColumn === "nama_aktivitas" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                            </div>
                        </TableHead>
                        <TableHead className="w-[120px] text-center cursor-pointer" onClick={() => onSortChange("tanggal_mulai")}>
                            <div className="flex items-center justify-center">
                                Tanggal Mulai
                                {sortColumn === "tanggal_mulai" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                            </div>
                        </TableHead>
                        <TableHead className="w-[120px] text-center cursor-pointer" onClick={() => onSortChange("tanggal_selesai")}>
                            <div className="flex items-center justify-center">
                                Tanggal Selesai
                                {sortColumn === "tanggal_selesai" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                            </div>
                        </TableHead>
                        <TableHead className="w-[120px] text-center cursor-pointer" onClick={() => onSortChange("status")}>
                            <div className="flex items-center justify-center">
                                Status
                                {sortColumn === "status" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                            </div>
                        </TableHead>
                        <TableHead className="w-[180px] cursor-pointer" onClick={() => onSortChange("biaya_implementasi")}>
                            <div className="flex items-center">
                                Biaya Implementasi
                                {sortColumn === "biaya_implementasi" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                            </div>
                        </TableHead>
                        <TableHead className="w-[140px] text-right pr-9">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {activities.map((item) => (
                        <TableRow
                            key={item.id}
                            className="border-b cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => {
                                if (item.id) {
                                    onNavigate(item.id)
                                }
                            }}
                        >
                            <TableCell className="pl-7 truncate max-w-[180px]">{item.nama_aktivitas}</TableCell>
                            <TableCell className="text-center truncate">{formatDisplayDate(item.tanggal_mulai)}</TableCell>
                            <TableCell className="text-center truncate">{formatDisplayDate(item.tanggal_selesai)}</TableCell>
                            <TableCell className="text-center">
                                <StatusBadge status={item.status} />
                            </TableCell>
                            <TableCell className="text-left truncate max-w-[180px]">
                                Rp{formatRupiah(item.biaya_implementasi)}
                            </TableCell>
                            <TableCell className="pr-5 text-right">
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-gray-200 transition cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (item.id) {
                                                onNavigate(item.id)
                                            }
                                        }}
                                    >
                                        <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-green-100 transition cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onShare(item)
                                        }}
                                    >
                                        <Share2 className="w-4 h-4 text-green-500 hover:text-green-700" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-red-100 transition cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete(item)
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
