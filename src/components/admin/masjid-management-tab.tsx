"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { SearchBar } from "./search-bar"
import { MasjidTable } from "./masjid-table"
import { Pagination } from "./pagination"
import { MasjidDetailsDialog } from "./masjid-details-dialog"
import { MasjidFormDialog } from "./masjid-form-dialog"
import { ConfirmDialog } from "./confirm-dialog"
import { useMasjids } from "@/hooks/use-masjid"
import type { Masjid, MasjidFormData } from "@/types/masjid"
import type { User } from "@/types/user"
import { type ConfirmAction, type FormMode, ITEMS_PER_PAGE } from "@/types/common"

interface MasjidManagementTabProps {
  onCountChange?: (count: number) => void
}

export const MasjidManagementTab = ({ onCountChange }: MasjidManagementTabProps) => {
  // State
  const [masjidSearch, setMasjidSearch] = useState("")
  const [masjidCurrentPage, setMasjidCurrentPage] = useState(1)
  const [masjidEditors, setMasjidEditors] = useState<User[]>([])
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null)
  const [isLoadingEditors, setIsLoadingEditors] = useState(false)
  const [isMasjidDetailsOpen, setIsMasjidDetailsOpen] = useState(false)
  const [isMasjidFormOpen, setIsMasjidFormOpen] = useState(false)
  const [masjidFormMode, setMasjidFormMode] = useState<FormMode>("add")
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>({ type: "delete-masjid", user: null })

  // Use custom hook
  const { masjids, isLoading, fetchMasjidEditors, createMasjid, updateMasjid, deleteMasjid } = useMasjids()

  // Update masjid count when masjids changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(masjids.length)
    }
  }, [masjids, onCountChange])

  // Filter masjids based on search term
  const getFilteredMasjids = () => {
    return masjids.filter(
      (masjid) =>
        masjid.nama_masjid?.toLowerCase().includes(masjidSearch.toLowerCase()) ||
        masjid.alamat?.toLowerCase().includes(masjidSearch.toLowerCase())
    )
  }

  const filteredMasjids = getFilteredMasjids()
  const totalMasjidPages = Math.ceil(filteredMasjids.length / ITEMS_PER_PAGE)
  const displayedMasjids = filteredMasjids.slice(
    (masjidCurrentPage - 1) * ITEMS_PER_PAGE,
    masjidCurrentPage * ITEMS_PER_PAGE
  )

  // Event handlers
  const handleShowMasjidDetails = async (masjid: Masjid) => {
    setSelectedMasjid(masjid)
    setMasjidEditors([])
    setIsLoadingEditors(true)
    setIsMasjidDetailsOpen(true)

    const editors = await fetchMasjidEditors(masjid.id)
    setMasjidEditors(editors)
    setIsLoadingEditors(false)
  }

  const handleShowAddMasjidForm = () => {
    setSelectedMasjid(null)
    setMasjidFormMode("add")
    setIsMasjidFormOpen(true)
  }

  const handleShowEditMasjidForm = (masjid: Masjid) => {
    setSelectedMasjid(masjid)
    setMasjidFormMode("edit")
    setIsMasjidFormOpen(true)
  }

  const showConfirmDialog = (masjid: Masjid) => {
    setConfirmAction({ type: "delete-masjid", user: null, masjid })
    setIsConfirmDialogOpen(true)
  }

  const handleMasjidFormSubmit = async (formData: MasjidFormData) => {
    let success = false

    if (masjidFormMode === "add") {
      success = await createMasjid(formData)
    } else if (masjidFormMode === "edit" && selectedMasjid) {
      success = await updateMasjid(selectedMasjid.id, formData)
    }

    if (success) {
      setIsMasjidFormOpen(false)
    }
  }

  const handleConfirmAction = async () => {
    if (confirmAction.type === "delete-masjid" && confirmAction.masjid) {
      const success = await deleteMasjid(confirmAction.masjid.id)

      if (success) {
        setIsConfirmDialogOpen(false)
        if (isMasjidDetailsOpen) setIsMasjidDetailsOpen(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4 items-center">
        <SearchBar
          searchTerm={masjidSearch}
          onSearchChange={setMasjidSearch}
          placeholder="Cari berdasarkan nama masjid atau alamat"
        />
        <Button className="bg-[#3A786D] text-white flex items-center" onClick={handleShowAddMasjidForm}>
          <Plus className="w-4 h-4 mr-2" /> Tambah Masjid
        </Button>
      </div>

      <MasjidTable
        masjids={displayedMasjids}
        isLoading={isLoading}
        onViewDetails={handleShowMasjidDetails}
        onEdit={handleShowEditMasjidForm}
        onDelete={showConfirmDialog}
      />

      {/* Pagination */}
      <Pagination currentPage={masjidCurrentPage} totalPages={totalMasjidPages} onPageChange={setMasjidCurrentPage} />

      {/* Dialogs */}
      <MasjidDetailsDialog
        isOpen={isMasjidDetailsOpen}
        onOpenChange={setIsMasjidDetailsOpen}
        masjid={selectedMasjid}
        editors={masjidEditors}
        isLoadingEditors={isLoadingEditors}
        onEdit={handleShowEditMasjidForm}
        onDelete={showConfirmDialog}
      />

      <MasjidFormDialog
        isOpen={isMasjidFormOpen}
        onOpenChange={setIsMasjidFormOpen}
        mode={masjidFormMode}
        masjid={selectedMasjid}
        onSubmit={handleMasjidFormSubmit}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        confirmAction={confirmAction}
        onConfirm={handleConfirmAction}
        isLoading={isLoading}
      />
    </div>
  )
}
