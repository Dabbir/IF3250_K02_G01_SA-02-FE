"use client"

import { CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Leaf } from "lucide-react"
import type { DetailedKegiatan } from "@/types/activity"

interface DetailHeaderProps {
    kegiatan: DetailedKegiatan | null
    onGoBack: () => void
}

export default function DetailHeader({ kegiatan, onGoBack }: DetailHeaderProps) {
    return (
        <CardHeader className="flex flex-col md:flex-row md:justify-between items-start gap-2">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-0" onClick={onGoBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Leaf className="h-6 w-6 text-slate-700" />
                <CardTitle>Detail Kegiatan</CardTitle>
            </div>

            <div className="flex flex-col text-xs space-y-1 text-gray-700 text-left md:text-right">
                <p>Created At: {kegiatan?.created_at ? new Date(kegiatan.created_at).toLocaleString() : "N/A"}</p>
                <p>Updated At: {kegiatan?.updated_at ? new Date(kegiatan.updated_at).toLocaleString() : "N/A"}</p>
            </div>
        </CardHeader>
    )
}
