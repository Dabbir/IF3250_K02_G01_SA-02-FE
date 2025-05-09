"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { editorService } from "@/services/editor-service"
import type { User } from "@/types/user"

export const useEditors = () => {
  const [pendingEditors, setPendingEditors] = useState<User[]>([])
  const [approvedEditors, setApprovedEditors] = useState<User[]>([])
  const [rejectedEditors, setRejectedEditors] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all editors
  const fetchAllEditors = useCallback(async () => {
    setIsLoading(true)
    try {
      const [pending, approved, rejected] = await Promise.all([
        editorService.getPendingEditors(),
        editorService.getApprovedEditors(),
        editorService.getRejectedEditors(),
      ])

      // Enhance approved and rejected editors with masjid data if needed
      const enhancedApproved = await enhanceEditorsWithMasjidData(approved)
      const enhancedRejected = await enhanceEditorsWithMasjidData(rejected)

      setPendingEditors(pending)
      setApprovedEditors(enhancedApproved)
      setRejectedEditors(enhancedRejected)
    } catch (error) {
      console.error("Error fetching editors:", error)
      toast.error("Gagal memuat data editor")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Helper to enhance editors with masjid data
  const enhanceEditorsWithMasjidData = async (editors: User[]): Promise<User[]> => {
    return Promise.all(
      editors.map(async (editor) => {
        if (editor.masjid_id && !editor.nama_masjid) {
          try {
            const masjidData = await editorService.getMasjidForEditor(editor.masjid_id)
            if (masjidData) {
              return { ...editor, nama_masjid: masjidData.nama_masjid }
            }
          } catch (error) {
            console.error(`Error fetching masjid for editor ${editor.id}:`, error)
          }
        }
        return editor
      }),
    )
  }

  // Approve an editor
  const approveEditor = useCallback(async (editor: User) => {
    setIsLoading(true)
    try {
      const success = await editorService.approveEditor(editor.id)
      if (success) {
        toast.success("Editor berhasil disetujui")

        // Update local state
        const updatedEditor: User = { ...editor, status: "Approved" as "Approved" }

        setPendingEditors((prev) => prev.filter((e) => e.id !== editor.id))
        setRejectedEditors((prev) => prev.filter((e) => e.id !== editor.id))
        setApprovedEditors((prev) => [...prev, updatedEditor])

        return true
      } else {
        toast.error("Gagal menyetujui editor")
        return false
      }
    } catch (error) {
      console.error("Error approving editor:", error)
      toast.error("Gagal menyetujui editor")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Reject an editor
  const rejectEditor = useCallback(async (editor: User) => {
    setIsLoading(true)
    try {
      const success = await editorService.rejectEditor(editor.id)
      if (success) {
        toast.success("Editor berhasil ditolak")

        // Update local state
        const updatedEditor: User = { ...editor, status: "Rejected" as "Rejected" }

        setPendingEditors((prev) => prev.filter((e) => e.id !== editor.id))
        setRejectedEditors((prev) => [...prev, updatedEditor])

        return true
      } else {
        toast.error("Gagal menolak editor")
        return false
      }
    } catch (error) {
      console.error("Error rejecting editor:", error)
      toast.error("Gagal menolak editor")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load editors on mount
  useEffect(() => {
    fetchAllEditors()
  }, [fetchAllEditors])

  return {
    pendingEditors,
    approvedEditors,
    rejectedEditors,
    isLoading,
    fetchAllEditors,
    approveEditor,
    rejectEditor,
  }
}
