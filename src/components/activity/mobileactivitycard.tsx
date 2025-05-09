"use client"

import { Menu, Pencil, Share2, Trash2 } from "lucide-react"

// components
import { Button } from "@/components/ui/button"
import StatusBadge from "@/components/badge/statusbadge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// types and utils
import type { Kegiatan } from "@/types/activity"
import { formatDisplayDate, formatRupiah } from "@/utils/formatters"

interface MobileActivityCardProps {
    item: Kegiatan
    onNavigate: (id: string | undefined) => void
    onShare: (activity: Kegiatan) => void
    onDelete: (activity: Kegiatan) => void
}

export default function MobileActivityCard({ item, onNavigate, onShare, onDelete }: MobileActivityCardProps) {
    return (
        <div
            key={item.id}
            className="border rounded-lg p-4 space-y-3 bg-white"
            onClick={() => item.id && onNavigate(item.id)}
        >
            <div className="flex justify-between items-start">
                <h3 className="font-medium text-[var(--blue)] truncate pr-2">{item.nama_aktivitas}</h3>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-auto max-h-[30vh] rounded-t-xl">
                        <div className="grid gap-4 py-4">
                            <Button
                                className="w-full flex justify-start items-center space-x-2 bg-transparent text-blue-500 hover:bg-blue-50"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (item.id) {
                                        onNavigate(item.id)
                                    }
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                                <span>Edit Kegiatan</span>
                            </Button>
                            <Button
                                className="w-full flex justify-start items-center space-x-2 bg-transparent text-green-500 hover:bg-green-50"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onShare(item)
                                }}
                            >
                                <Share2 className="h-4 w-4" />
                                <span>Bagikan ke WhatsApp</span>
                            </Button>
                            <Button
                                className="w-full flex justify-start items-center space-x-2 bg-transparent text-red-500 hover:bg-red-50"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(item)
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Hapus Kegiatan</span>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-4">
                    <div>
                        <span className="block text-gray-500 text-xs">Tanggal Mulai</span>
                        <span className="text-[12px]">{formatDisplayDate(item.tanggal_mulai)}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs">Status</span>
                        <StatusBadge status={item.status} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <span className="block text-gray-500 text-xs">Tanggal Selesai</span>
                        <span className="text-[12px]">{formatDisplayDate(item.tanggal_selesai)}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs">Biaya Implementasi</span>
                        <span className="font-medium">Rp{formatRupiah(item.biaya_implementasi)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
