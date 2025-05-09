"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import type { Masjid } from "@/types/masjid"

interface MasjidDropdownProps {
  masjidList: Masjid[]
  selectedMasjid: Masjid | null
  onSelect: (masjid: Masjid) => void
  isLoading: boolean
}

export const MasjidDropdown = ({ masjidList, selectedMasjid, onSelect, isLoading }: MasjidDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMasjidList, setFilteredMasjidList] = useState<Masjid[]>(masjidList)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFilteredMasjidList(masjidList)
  }, [masjidList])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMasjidList(masjidList)
    } else {
      const filtered = masjidList.filter((masjid) =>
        masjid.nama_masjid.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredMasjidList(filtered)
    }
  }, [searchTerm, masjidList])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center justify-between font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className={selectedMasjid ? "text-black" : "text-gray-400"}>
          {selectedMasjid?.nama_masjid || "Pilih Masjid"}
        </span>
        {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-white border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Cari masjid..."
                className="w-full p-2 pl-9 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Memuat data masjid...</div>
          ) : filteredMasjidList.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Tidak ada masjid yang ditemukan</div>
          ) : (
            filteredMasjidList.map((masjid) => (
              <div
                key={masjid.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(masjid)
                  setIsDropdownOpen(false)
                  setSearchTerm("")
                }}
              >
                <div className="font-medium">{masjid.nama_masjid}</div>
                {masjid.alamat && <div className="text-sm text-gray-500">{masjid.alamat}</div>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
