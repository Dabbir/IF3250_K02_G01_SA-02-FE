"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Pencil, Trash2 } from "lucide-react"
import type { Stakeholder } from "@/types/stakeholder"
import TypeBadge from "../badge/typebadge"

interface MobileStakeholderCardProps {
    item: Stakeholder
    onNavigate: (id: string) => void
    onDelete: (stakeholder: Stakeholder) => void
}

export default function MobileStakeholderCard({ item, onNavigate, onDelete }: MobileStakeholderCardProps) {
    return (
        <div key={item.id} className="border rounded-lg p-4 space-y-3 bg-white" onClick={() => onNavigate(item.id)}>
            <div className="flex justify-between items-start">
                <h3 className="font-medium text-[var(--blue)] truncate pr-2">{item.nama_stakeholder}</h3>
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
                                    onNavigate(item.id)
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                                <span>Edit Stakeholder</span>
                            </Button>
                            <Button
                                className="w-full flex justify-start items-center space-x-2 bg-transparent text-red-500 hover:bg-red-50"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(item)
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Hapus Stakeholder</span>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-4">
                    <div>
                        <span className="block text-gray-500 text-xs">Jenis</span>
                        <span className="text-[12px]">
                            <TypeBadge jenis={item.jenis || "-"} />
                        </span>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs">Telepon</span>
                        <span className="text-[12px]">{item.telepon || "-"}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs">Email</span>
                        <span className="text-[12px]">{item.email || "-"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
