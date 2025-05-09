"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { userService } from "@/services/user-service"
import type { UserDataUpdate } from "@/types/user"

export const useRegistration = () => {
  const [isLoading, setIsLoading] = useState(false)

  // Upload a file
  const uploadFile = async (file: File) => {
    setIsLoading(true)
    try {
      const fileData = await userService.uploadFile(file)
      return fileData
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Gagal mengunggah file")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update user data
  const updateUserData = async (userId: string, userData: UserDataUpdate) => {
    setIsLoading(true)
    try {
      const success = await userService.updateUserData(userId, userData)
      if (success) {
        toast.success("Data berhasil disimpan")
        return true
      } else {
        toast.error("Gagal menyimpan data")
        return false
      }
    } catch (error) {
      console.error("Error updating user data:", error)
      toast.error("Gagal menyimpan data")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register user with file upload
  const registerUser = async (userId: string, userData: UserDataUpdate, file: File | null) => {
    setIsLoading(true)
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
      toast.error("Terjadi kesalahan saat pendaftaran")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    uploadFile,
    updateUserData,
    registerUser,
  }
}
