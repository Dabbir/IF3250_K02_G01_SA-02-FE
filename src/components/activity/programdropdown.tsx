"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import type { Program } from "@/types/activity"

interface ProgramDropdownProps {
    value: string
    programs: Program[]
    onSelect: (program: Program) => void
    onChange: (value: string) => void
}

export default function ProgramDropdown({ value, programs, onSelect, onChange }: ProgramDropdownProps) {
    const [showDropdown, setShowDropdown] = useState(false)
    const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setFilteredPrograms(programs.filter((p) => p.nama_program.toLowerCase().includes(value.toLowerCase())))
    }, [value, programs])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
        setShowDropdown(true)
    }

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!inputRef.current?.contains(e.relatedTarget) && !dropdownRef.current?.contains(e.relatedTarget)) {
            setShowDropdown(false)
        }
    }

    return (
        <div className="relative" onBlur={handleBlur}>
            <Input
                id="programTerafiliasi"
                ref={inputRef}
                value={value}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                className="w-full"
            />

            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="text-[12px] absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-auto"
                >
                    {filteredPrograms.length > 0 ? (
                        filteredPrograms.map((program) => (
                            <div
                                key={program.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    onSelect(program)
                                }}
                            >
                                {program.nama_program}
                            </div>
                        ))
                    ) : programs.length > 0 ? (
                        programs.map((program) => (
                            <div
                                key={program.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    onSelect(program)
                                }}
                            >
                                {program.nama_program}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 cursor-pointer text-gray-500">Tidak ada program</div>
                    )}
                </div>
            )}
        </div>
    )
}
