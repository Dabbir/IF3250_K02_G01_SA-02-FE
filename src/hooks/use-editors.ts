"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import type { User } from "@/types/user"

const API_URL = import.meta.env.VITE_HOST_NAME

export const useEditors = () => {
  const [pendingEditors, setPendingEditors] = useState<User[]>([])
  const [approvedEditors, setApprovedEditors] = useState<User[]>([])
  const [rejectedEditors, setRejectedEditors] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAuthToken = () => {
    return localStorage.getItem("token") || ""
  }

  const fetchPendingEditors = useCallback(async (): Promise<User[]> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_URL}/api/access/editors/pending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch pending editors: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        return data.data
      } else {
        console.warn("Format data tidak sesuai:", data)
        return []
      }
    } catch (error) {
      console.error("Error fetching pending editors:", error)
      toast.error("Gagal memuat data editor pending")
      return []
    }
  }, [])

  // Fetch approved editors
  const fetchApprovedEditors = useCallback(async (): Promise<User[]> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_URL}/api/users/getall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch approved editors: ${response.status}`)
      }

      const data = await response.json()
      const approvedData = data.users.filter((user: User) => user.status === "Approved" && user.peran === "Editor")

      return approvedData
    } catch (error) {
      console.error("Error fetching approved editors:", error)
      return []
    }
  }, [])

  // Fetch rejected editors
  const fetchRejectedEditors = useCallback(async (): Promise<User[]> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_URL}/api/users/getall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch rejected editors: ${response.status}`)
      }

      const data = await response.json()
      const rejectedData = data.users.filter((user: User) => user.status === "Rejected" && user.peran === "Editor")

      return rejectedData
    } catch (error) {
      console.error("Error fetching rejected editors:", error)
      return []
    }
  }, [])

  // Get masjid details for an editor
  const getMasjidForEditor = useCallback(async (masjidId: string): Promise<{ nama_masjid: string } | null> => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_URL}/api/masjid/${masjidId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch masjid data: ${response.status}`)
      }

      const data = await response.json()
      return data.success && data.data ? data.data : null
    } catch (error) {
      console.error(`Error fetching masjid data for masjid ${masjidId}:`, error)
      return null
    }
  }, [])

  // Enhance editors with masjid data
  const enhanceEditorsWithMasjidData = useCallback(
    async (editors: User[]): Promise<User[]> => {
      return Promise.all(
        editors.map(async (editor) => {
          if (editor.masjid_id && !editor.nama_masjid) {
            try {
              const masjidData = await getMasjidForEditor(editor.masjid_id)
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
    },
    [getMasjidForEditor],
  )

  // Fetch all editors
  const fetchAllEditors = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [pending, approved, rejected] = await Promise.all([
        fetchPendingEditors(),
        fetchApprovedEditors(),
        fetchRejectedEditors(),
      ])

      // Enhance approved and rejected editors with masjid data if needed
      const enhancedApproved = await enhanceEditorsWithMasjidData(approved)
      const enhancedRejected = await enhanceEditorsWithMasjidData(rejected)

      setPendingEditors(pending)
      setApprovedEditors(enhancedApproved)
      setRejectedEditors(enhancedRejected)
    } catch (error) {
      console.error("Error fetching editors:", error)
      setError("Gagal memuat data editor")
      toast.error("Gagal memuat data editor")
    } finally {
      setIsLoading(false)
    }
  }, [fetchPendingEditors, fetchApprovedEditors, fetchRejectedEditors, enhanceEditorsWithMasjidData])

  // Approve an editor
  const approveEditor = useCallback(async (editor: User) => {
    setIsLoading(true)
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_URL}/api/access/editors/${editor.id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to approve editor: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Editor berhasil disetujui")

        // Update local state
        const updatedEditor = { ...editor, status: "Approved" as const }

        setPendingEditors((prev) => prev.filter((e) => e.id !== editor.id))
        setRejectedEditors((prev) => prev.filter((e) => e.id !== editor.id))
        setApprovedEditors((prev) => [...prev, updatedEditor as User])

        return true
      } else {
        throw new Error(data.message || "Gagal menyetujui editor")
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
      const token = getAuthToken()

      const response = await fetch(`${API_URL}/api/access/editors/${editor.id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to reject editor: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Editor berhasil ditolak")

        // Update local state
        const updatedEditor = { ...editor, status: "Rejected" as const }

        setPendingEditors((prev) => prev.filter((e) => e.id !== editor.id))
        setApprovedEditors((prev) => prev.filter((e) => e.id !== editor.id))
        setRejectedEditors((prev) => [...prev, updatedEditor as User])

        return true
      } else {
        throw new Error(data.message || "Gagal menolak editor")
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
    error,
    fetchAllEditors,
    approveEditor,
    rejectEditor,
  }
}
