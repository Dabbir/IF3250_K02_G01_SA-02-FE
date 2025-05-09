"use client"

import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="bg-[#3A786D] text-white"
      >
        Previous
      </Button>
      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`${
            currentPage === i + 1
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
        className="bg-[#3A786D] text-white"
      >
        Next
      </Button>
    </div>
  )
}
