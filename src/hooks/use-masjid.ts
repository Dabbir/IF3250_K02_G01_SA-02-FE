"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import { masjidService } from "@/services/masjid-service"
import type { Masjid, MasjidFormData } from "@/types/masjid"

export const useMasjids = () => {
  const [masjids, setMasjids] = useState<Masjid[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all masjids
  const fetchMasjids = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await masjidService.getMasjids()
      setMasjids(data)
      return data
    } catch (error) {
      console.error("Error fetching masjids:", error)
      toast.error("Gagal memuat data masjid")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch editors for a specific masjid
  const fetchMasjidEditors = useCallback(async (masjidId: string) => {
    try {
      return await masjidService.getMasjidEditors(masjidId)
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
        if (!masjidData.nama_masjid || !masjidData.alamat) {
          toast.error("Nama masjid dan alamat harus diisi")
          return false
        }

        const success = await masjidService.createMasjid(masjidData)
        if (success) {
          toast.success("Masjid berhasil ditambahkan")
          await fetchMasjids() // Refresh the list
          return true
        } else {
          toast.error("Gagal menambahkan masjid")
          return false
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
        if (!masjidData.nama_masjid || !masjidData.alamat) {
          toast.error("Nama masjid dan alamat harus diisi")
          return false
        }

        const success = await masjidService.updateMasjid(masjidId, masjidData)
        if (success) {
          toast.success("Masjid berhasil diperbarui")
          await fetchMasjids() // Refresh the list
          return true
        } else {
          toast.error("Gagal memperbarui masjid")
          return false
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
      const success = await masjidService.deleteMasjid(masjidId)
      if (success) {
        toast.success("Masjid berhasil dihapus")
        setMasjids((prev) => prev.filter((masjid) => masjid.id !== masjidId))
        return true
      } else {
        toast.error("Gagal menghapus masjid")
        return false
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
    fetchMasjids,
    fetchMasjidEditors,
    createMasjid,
    updateMasjid,
    deleteMasjid,
  }
}
