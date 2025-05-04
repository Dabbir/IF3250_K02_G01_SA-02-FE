"use client"

import { ArrowLeft } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"

interface DetailHeaderProps {
    title: string
    createdAt: string | null
    updatedAt: string | null
    onGoBack: () => void
    Icon: LucideIcon
}

export default function DetailHeader({ title, createdAt, updatedAt, onGoBack, Icon }: DetailHeaderProps) {
    return (
        <CardHeader className="flex flex-col md:flex-row md:justify-between items-start gap-2">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-0" onClick={onGoBack}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <Icon className="h-6 w-6 text-slate-700" />
                <CardTitle>{title}</CardTitle>
            </div>

            <div className="flex flex-col text-xs space-y-1 text-gray-700 text-left md:text-right">
                <p>Created At: {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</p>
                <p>Updated At: {updatedAt ? new Date(updatedAt).toLocaleString() : "N/A"}</p>
            </div>
        </CardHeader>
    )
}
