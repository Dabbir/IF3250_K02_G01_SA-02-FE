"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowUpDown } from "lucide-react"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  placeholder: string
}

export const SearchBar = ({ searchTerm, onSearchChange, placeholder }: SearchBarProps) => {
  return (
    <div className="flex relative w-2/5 gap-2">
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
      <Button variant="outline" className="flex items-center">
        <ArrowUpDown className="w-4 h-4 mr-2" /> Sort
      </Button>
    </div>
  )
}
