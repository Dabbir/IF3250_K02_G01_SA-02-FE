"use client"

import { Button } from "@/components/ui/button"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex flex-wrap justify-center mt-4 gap-2">
            <Button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
            >
                Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
                <Button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm ${currentPage === i + 1
                        ? "bg-[#3A786D] text-white"
                        : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                        }`}
                >
                    {i + 1}
                </Button>
            ))}
            <Button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
            >
                Next
            </Button>
        </div>
    )
}
