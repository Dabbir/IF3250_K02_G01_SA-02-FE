"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import { TYPE_OPTIONS } from "@/types/stakeholder"
import TypeBadge from "@/components/badge/typebadge"

interface FilterPopoverProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    jenisFilters: string[]
    onToggleFilter: (jenis: string) => void
    onClearFilters: () => void
}

export default function FilterStakeholder({
    open,
    onOpenChange,
    jenisFilters,
    onToggleFilter,
    onClearFilters,
}: FilterPopoverProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="max-md:h-8 flex items-center gap-1 md:w-auto">
                    <Filter className="h-3 w-3 md:-h4 md:w-4" />
                    <span className="max-md:text-[12px]">Filter Jenis</span>
                    {jenisFilters.length > 0 && <Badge className="ml-1 bg-[#3A786D]">{jenisFilters.length}</Badge>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4">
                <h4 className="text-[12px] font-medium mb-3">Filter berdasarkan jenis</h4>
                <div className="space-y-2">
                    {TYPE_OPTIONS.map((jenis) => (
                        <div key={jenis} className="flex items-center space-x-2">
                            <Checkbox
                                id={`jenis-${jenis}`}
                                checked={jenisFilters.includes(jenis)}
                                onCheckedChange={() => onToggleFilter(jenis)}
                            />
                            <Label htmlFor={`jenis-${jenis}`} className="flex items-center">
                                <TypeBadge jenis={jenis} />
                            </Label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearFilters}
                        disabled={jenisFilters.length === 0}
                        className="text-[12px]"
                    >
                        Clear All
                    </Button>
                    <Button size="sm" onClick={() => onOpenChange(false)} className="bg-[#3A786D] text-[12px]">
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
