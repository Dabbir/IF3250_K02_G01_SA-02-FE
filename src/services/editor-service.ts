import { apiRequest } from "./api"
import type { User } from "@/types/user"

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  users?: User[]
}

export const editorService = {
  // Fetch pending editors
  getPendingEditors: async (): Promise<User[]> => {
    try {
      const response = await apiRequest<ApiResponse<User[]>>("/api/access/editors/pending")
      return response.success && Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching pending editors:", error)
      return []
    }
  },

  // Fetch approved editors
  getApprovedEditors: async (): Promise<User[]> => {
    try {
      const response = await apiRequest<ApiResponse<User[]>>("/api/users/getall")
      const approvedData =
        response.users?.filter((user: User) => user.status === "Approved" && user.peran === "Editor") || []
      return approvedData
    } catch (error) {
      console.error("Error fetching approved editors:", error)
      return []
    }
  },

  // Fetch rejected editors
  getRejectedEditors: async (): Promise<User[]> => {
    try {
      const response = await apiRequest<ApiResponse<User[]>>("/api/users/getall")
      const rejectedData =
        response.users?.filter((user: User) => user.status === "Rejected" && user.peran === "Editor") || []
      return rejectedData
    } catch (error) {
      console.error("Error fetching rejected editors:", error)
      return []
    }
  },

  // Get masjid details for an editor
  getMasjidForEditor: async (masjidId: string): Promise<{ nama_masjid: string } | null> => {
    try {
      const response = await apiRequest<ApiResponse<{ nama_masjid: string }>>(`/api/masjid/${masjidId}`)
      return response.success && response.data ? response.data : null
    } catch (error) {
      console.error(`Error fetching masjid data for masjid ${masjidId}:`, error)
      return null
    }
  },

  // Approve an editor
  approveEditor: async (editorId: string): Promise<boolean> => {
    try {
      const response = await apiRequest<ApiResponse<null>>(`/api/access/editors/${editorId}/approve`, { method: "PUT" })
      return response.success
    } catch (error) {
      console.error("Error approving editor:", error)
      return false
    }
  },

  // Reject an editor
  rejectEditor: async (editorId: string): Promise<boolean> => {
    try {
      const response = await apiRequest<ApiResponse<null>>(`/api/access/editors/${editorId}/reject`, { method: "PUT" })
      return response.success
    } catch (error) {
      console.error("Error rejecting editor:", error)
      return false
    }
  },
}
