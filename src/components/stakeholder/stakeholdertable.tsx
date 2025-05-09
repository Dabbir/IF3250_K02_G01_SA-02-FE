"use client"

import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"

// components
import { Button } from "@/components/ui/button"
import TypeBadge from "@/components/badge/typebadge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// types
import type { Stakeholder } from "@/types/stakeholder"

interface StakeholderTableProps {
    stakeholders: Stakeholder[]
    sortColumn: string
    onSortChange: (column: string) => void
    onNavigate: (id: string) => void
    onDelete: (stakeholder: Stakeholder) => void
}

export default function StakeholderTable({
    stakeholders,
    sortColumn,
    onSortChange,
    onNavigate,
    onDelete,
}: StakeholderTableProps) {
    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="pl-7 w-[200px] cursor-pointer" onClick={() => onSortChange("nama_stakeholder")}>
                            <div className="flex items-center justify-left">
                                Nama Stakeholder
                                {sortColumn === "nama_stakeholder" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                            </div>
                        </TableHead>
                        <TableHead className="w-[120px] text-center cursor-pointer">
                            <div className="flex items-center justify-left">Jenis</div>
                        </TableHead>
                        <TableHead className="w-[120px] text-center cursor-pointer">
                            <div className="flex items-center justify-left">Telepon</div>
                        </TableHead>
                        <TableHead className="w-[120px] text-center cursor-pointer">
                            <div className="flex items-center justify-left">Email</div>
                        </TableHead>
                        <TableHead className="w-[120px] text-center cursor-pointer">
                            <div className="flex items-center justify-center">Action</div>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {stakeholders.map((item) => (
                        <TableRow
                            key={item.id}
                            className="border-b cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => {
                                onNavigate(item.id)
                            }}
                        >
                            <TableCell className="pl-7 truncate max-w-[180px]">{item.nama_stakeholder}</TableCell>
                            <TableCell className="text-left truncate">
                                <TypeBadge jenis={item.jenis || "-"} />
                            </TableCell>
                            <TableCell className="text-left truncate">{item.telepon || "-"}</TableCell>
                            <TableCell className="text-left truncate">{item.email || "-"}</TableCell>
                            <TableCell className="pr-5 text-left">
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-gray-200 transition cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onNavigate(item.id)
                                        }}
                                    >
                                        <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
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
