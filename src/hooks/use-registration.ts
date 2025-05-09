"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import type { UserDataUpdate } from "@/types/user"

const API_URL = import.meta.env.VITE_HOST_NAME

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload a file
  const uploadFile = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    try {
      const fileFormData = new FormData()
      fileFormData.append("file", file)

      const uploadResponse = await fetch(`${API_URL}/api/files/upload`, {
        method: "POST",
        body: fileFormData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Gagal mengupload file ke Google Drive")
      }

      const uploadResult = await uploadResponse.json()
      return uploadResult.file
    } catch (error) {
      console.error("Error uploading file:", error)
      setError("Gagal mengunggah file")
      toast.error("Gagal mengunggah file")
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update user data
  const updateUserData = useCallback(async (userId: string, userData: UserDataUpdate) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Registrasi gagal. Silakan coba lagi.")
      }

      toast.success("Data berhasil disimpan")
      return true
    } catch (error) {
      console.error("Error updating user data:", error)
      setError("Gagal menyimpan data")
      toast.error("Gagal menyimpan data")
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Register user with file upload
  const registerUser = useCallback(
    async (userId: string, userData: UserDataUpdate, file: File | null) => {
      setIsLoading(true)
      setError(null)
      try {
        // Clear any existing token
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token")
        }

        // Upload file if provided
        let fileUploadData = null
        if (file) {
          fileUploadData = await uploadFile(file)

          // Add file data to user data
          if (fileUploadData) {
            userData.dokumen_pendaftaran = fileUploadData.webContentLink
            userData.dokumen_file_id = fileUploadData.id
            userData.dokumen_file_name = fileUploadData.name
            userData.dokumen_file_type = fileUploadData.mimeType
          }
        }

        // Update user data
        const success = await updateUserData(userId, userData)
        return success
      } catch (error) {
        console.error("Error during registration:", error)
        setError("Terjadi kesalahan saat pendaftaran")
        toast.error("Terjadi kesalahan saat pendaftaran")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [uploadFile, updateUserData],
  )

  return {
    isLoading,
    error,
    uploadFile,
    updateUserData,
    registerUser,
  }
}
