"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import type { Masjid, MasjidFormData } from "@/types/masjid"

const API_URL = import.meta.env.VITE_HOST_NAME

export const useMasjids = () => {
  const [masjids, setMasjids] = useState<Masjid[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper untuk mendapatkan token
  const getAuthToken = () => {
    return localStorage.getItem("token") || ""
  }

  // Fetch all masjids
  const fetchMasjids = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_URL}/api/masjid`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch masjids: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setMasjids(data.data)
        return data.data
      } else {
        console.warn("Format data masjid tidak sesuai:", data)
        return []
      }
    } catch (error) {
      console.error("Error fetching masjids:", error)
      setError("Gagal memuat data masjid")
      toast.error("Gagal memuat data masjid")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch editors for a specific masjid
  const fetchMasjidEditors = useCallback(async (masjidId: string) => {
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_URL}/api/masjid/${masjidId}/editors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch masjid editors: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        return data.data
      } else {
        console.warn("Format data editor masjid tidak sesuai:", data)
        return []
      }
    } catch (error) {
      console.error("Error fetching masjid editors:", error)
      toast.error("Gagal memuat data editor masjid")
      return []
    }
  }, [])

  // Create a new masjid
  const createMasjid = useCallback(
    async (masjidData: MasjidFormData) => {
      setIsLoading(true)
      try {
        const token = getAuthToken()

        if (!masjidData.nama_masjid || !masjidData.alamat) {
          toast.error("Nama masjid dan alamat harus diisi")
          return false
        }

        const response = await fetch(`${API_URL}/api/masjid`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(masjidData),
        })

        if (!response.ok) {
          throw new Error(`Failed to create masjid: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          toast.success("Masjid berhasil ditambahkan")
          await fetchMasjids() // Refresh the list
          return true
        } else {
          throw new Error(data.message || "Gagal menambahkan masjid")
        }
      } catch (error) {
        console.error("Error creating masjid:", error)
        toast.error("Gagal menambahkan masjid")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [fetchMasjids],
  )

  // Update an existing masjid
  const updateMasjid = useCallback(
    async (masjidId: string, masjidData: MasjidFormData) => {
      setIsLoading(true)
      try {
        const token = getAuthToken()

        if (!masjidData.nama_masjid || !masjidData.alamat) {
          toast.error("Nama masjid dan alamat harus diisi")
          return false
        }

        const response = await fetch(`${API_URL}/api/masjid/${masjidId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(masjidData),
        })

        if (!response.ok) {
          throw new Error(`Failed to update masjid: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          toast.success("Masjid berhasil diperbarui")
          await fetchMasjids() // Refresh the list
          return true
        } else {
          throw new Error(data.message || "Gagal memperbarui masjid")
        }
      } catch (error) {
        console.error("Error updating masjid:", error)
        toast.error("Gagal memperbarui masjid")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [fetchMasjids],
  )

  // Delete a masjid
  const deleteMasjid = useCallback(async (masjidId: string) => {
    setIsLoading(true)
    try {
      const token = getAuthToken()

      const response = await fetch(`${API_URL}/api/masjid/${masjidId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete masjid: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Masjid berhasil dihapus")
        setMasjids((prev) => prev.filter((masjid) => masjid.id !== masjidId))
        return true
      } else {
        throw new Error(data.message || "Gagal menghapus masjid")
      }
    } catch (error) {
      console.error("Error deleting masjid:", error)
      toast.error("Gagal menghapus masjid")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load masjids on mount
  useEffect(() => {
    fetchMasjids()
  }, [fetchMasjids])

  return {
    masjids,
    isLoading,
    error,
    fetchMasjids,
    fetchMasjidEditors,
    createMasjid,
    updateMasjid,
    deleteMasjid,
  }
}
