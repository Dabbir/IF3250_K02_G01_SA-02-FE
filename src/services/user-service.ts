import { apiRequest } from "./api"
import type { UserDataUpdate } from "@/types/user"

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  file?: any
}

export const userService = {
  // Upload a file
  uploadFile: async (file: File): Promise<any> => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${import.meta.env.VITE_HOST_NAME}/api/files/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const result = await response.json()
      return result.file
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  },

  // Update user data
  updateUserData: async (userId: string, userData: UserDataUpdate): Promise<boolean> => {
    try {
      const response = await apiRequest<ApiResponse<null>>(`/api/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      })
      return response.success
    } catch (error) {
      console.error("Error updating user data:", error)
      throw error
    }
  },
}
