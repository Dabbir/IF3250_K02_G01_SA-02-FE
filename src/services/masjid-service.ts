import { apiRequest } from "./api"
import type { Masjid, MasjidFormData } from "@/types/masjid"
import type { User } from "@/types/user"

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export const masjidService = {
  // Fetch all masjids
  getMasjids: async (): Promise<Masjid[]> => {
    try {
      const response = await apiRequest<ApiResponse<Masjid[]>>("/api/masjid")
      return response.success && Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching masjids:", error)
      return []
    }
  },

  // Fetch editors for a specific masjid
  getMasjidEditors: async (masjidId: string): Promise<User[]> => {
    try {
      const response = await apiRequest<ApiResponse<User[]>>(`/api/masjid/${masjidId}/editors`)
      return response.success && Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching masjid editors:", error)
      return []
    }
  },

  // Create a new masjid
  createMasjid: async (masjidData: MasjidFormData): Promise<boolean> => {
    try {
      const response = await apiRequest<ApiResponse<null>>("/api/masjid", {
        method: "POST",
        body: JSON.stringify(masjidData),
      })
      return response.success
    } catch (error) {
      console.error("Error creating masjid:", error)
      return false
    }
  },

  // Update an existing masjid
  updateMasjid: async (masjidId: string, masjidData: MasjidFormData): Promise<boolean> => {
    try {
      const response = await apiRequest<ApiResponse<null>>(`/api/masjid/${masjidId}`, {
        method: "PUT",
        body: JSON.stringify(masjidData),
      })
      return response.success
    } catch (error) {
      console.error("Error updating masjid:", error)
      return false
    }
  },

  // Delete a masjid
  deleteMasjid: async (masjidId: string): Promise<boolean> => {
    try {
      const response = await apiRequest<ApiResponse<null>>(`/api/masjid/${masjidId}`, { method: "DELETE" })
      return response.success
    } catch (error) {
      console.error("Error deleting masjid:", error)
      return false
    }
  },
}
