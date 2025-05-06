"use client"

import { Filter } from "lucide-react"

// components
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import StatusBadge from "@/components/badge/statusbadge"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// types
import { STATUS_OPTIONS } from "@/types/activity"

interface FilterPopoverProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    statusFilters: string[]
    onToggleFilter: (status: string) => void
    onClearFilters: () => void
}

export default function FilterActivity({
    open,
    onOpenChange,
    statusFilters,
    onToggleFilter,
    onClearFilters,
}: FilterPopoverProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="max-md:h-8 flex items-center gap-1 md:w-auto">
                    <Filter className="h-3 w-3 md:-h4 md:w-4" />
                    <span className="max-md:text-[12px]">Filter Status</span>
                    {statusFilters.length > 0 && <Badge className="ml-1 bg-[#3A786D]">{statusFilters.length}</Badge>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4">
                <h4 className="text-[12px] font-medium mb-3">Filter berdasarkan status</h4>
                <div className="space-y-2">
                    {STATUS_OPTIONS.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                                id={`status-${status}`}
                                checked={statusFilters.includes(status)}
                                onCheckedChange={() => onToggleFilter(status)}
                            />
                            <Label htmlFor={`status-${status}`} className="flex items-center">
                                <StatusBadge status={status} />
                            </Label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearFilters}
                        disabled={statusFilters.length === 0}
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
