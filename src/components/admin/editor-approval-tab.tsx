"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { EditorTable } from "./editor-table"
import { SearchBar } from "./search-bar"
import Pagination from "@/components/pagination/pagination"
import { UserDetailsDialog } from "./user-details-dialog"
import { ConfirmDialog } from "./confirm-dialog"
import { useEditors } from "@/hooks/use-editors"
import type { User } from "@/types/user"
import { type ConfirmAction, ITEMS_PER_PAGE } from "@/types/common"

interface EditorApprovalTabProps {
  onCountChange?: (count: number) => void
}

export const EditorApprovalTab = ({ onCountChange }: EditorApprovalTabProps) => {
  // State
  const [editorSearch, setEditorSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [currentApprovalTab, setCurrentApprovalTab] = useState("pending")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>({ type: "approve", user: null })

  // Use custom hook
  const { pendingEditors, approvedEditors, rejectedEditors, isLoading, approveEditor, rejectEditor } = useEditors()

  // Update pending count when pendingEditors changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(pendingEditors.length)
    }
  }, [pendingEditors, onCountChange])

  // Filter editors based on search term
  const getFilteredEditors = () => {
    let editors: User[] = []

    switch (currentApprovalTab) {
      case "pending":
        editors = pendingEditors
        break
      case "approved":
        editors = approvedEditors
        break
      case "rejected":
        editors = rejectedEditors
        break
    }

    return editors.filter(
      (user) =>
        user.nama?.toLowerCase().includes(editorSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(editorSearch.toLowerCase()) ||
        user.nama_masjid?.toLowerCase().includes(editorSearch.toLowerCase()),
    )
  }

  const filteredEditors = getFilteredEditors()
  const totalEditorPages = Math.ceil(filteredEditors.length / ITEMS_PER_PAGE)
  const displayedEditors = filteredEditors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Event handlers
  const handleShowUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const showConfirmDialog = (type: "approve" | "reject", user: User) => {
    setConfirmAction({ type, user })
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmAction = async () => {
    let success = false

    if (confirmAction.type === "approve" && confirmAction.user) {
      success = await approveEditor(confirmAction.user)
    } else if (confirmAction.type === "reject" && confirmAction.user) {
      success = await rejectEditor(confirmAction.user)
    }

    if (success) {
      setIsConfirmDialogOpen(false)
      if (isDetailsOpen) setIsDetailsOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="pending" value={currentApprovalTab} onValueChange={setCurrentApprovalTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingEditors.length > 0 && <Badge className="ml-2 bg-amber-500">{pendingEditors.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Disetujui
            {approvedEditors.length > 0 && <Badge className="ml-2 bg-green-500">{approvedEditors.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Ditolak
            {rejectedEditors.length > 0 && <Badge className="ml-2 bg-red-500">{rejectedEditors.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <div className="flex justify-between mb-4 items-center">
          <SearchBar
            searchTerm={editorSearch}
            onSearchChange={setEditorSearch}
            placeholder="Cari berdasarkan nama, email, atau masjid"
          />
        </div>

        <TabsContent value="pending" className="space-y-4">
          <EditorTable
            editors={displayedEditors}
            isLoading={isLoading}
            onViewDetails={handleShowUserDetails}
            onApprove={(user) => showConfirmDialog("approve", user)}
            onReject={(user) => showConfirmDialog("reject", user)}
            status="Pending"
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <EditorTable
            editors={displayedEditors}
            isLoading={isLoading}
            onViewDetails={handleShowUserDetails}
            onApprove={(user) => showConfirmDialog("approve", user)}
            onReject={(user) => showConfirmDialog("reject", user)}
            status="Approved"
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <EditorTable
            editors={displayedEditors}
            isLoading={isLoading}
            onViewDetails={handleShowUserDetails}
            onApprove={(user) => showConfirmDialog("approve", user)}
            onReject={(user) => showConfirmDialog("reject", user)}
            status="Rejected"
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalEditorPages} onPageChange={setCurrentPage} />

      {/* Dialogs */}
      <UserDetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        user={selectedUser}
        onApprove={(user) => showConfirmDialog("approve", user)}
        onReject={(user) => showConfirmDialog("reject", user)}
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
