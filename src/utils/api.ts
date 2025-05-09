import { toast } from "react-toastify"
import type { Masjid, MasjidFormData } from "@/types/masjid"
import type { User } from "@/types/user"

const API_URL = import.meta.env.VITE_HOST_NAME

// Editor API functions
export const fetchPendingEditors = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/access/editors/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
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
}

// Perbarui fungsi fetchApprovedEditors untuk menyertakan data masjid
export const fetchApprovedEditors = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/users/getall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch approved editors: ${response.status}`)
    }

    const data = await response.json()
    const approvedData = data.users.filter((user: User) => user.status === "Approved" && user.peran === "Editor")

    // Tambahkan informasi masjid untuk setiap editor yang disetujui
    if (Array.isArray(approvedData)) {
      // Jika masjid_id ada tapi nama_masjid tidak ada, ambil data masjid
      const editorsWithMasjid = await Promise.all(
        approvedData.map(async (editor: User) => {
          if (editor.masjid_id && !editor.nama_masjid) {
            try {
              const masjidResponse = await fetch(`${API_URL}/api/masjid/${editor.masjid_id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token || ""}`,
                },
              })

              if (masjidResponse.ok) {
                const masjidData = await masjidResponse.json()
                if (masjidData.success && masjidData.data) {
                  return {
                    ...editor,
                    nama_masjid: masjidData.data.nama_masjid,
                  }
                }
              }
            } catch (error) {
              console.error(`Error fetching masjid data for editor ${editor.id}:`, error)
            }
          }
          return editor
        }),
      )

      return editorsWithMasjid
    } else {
      console.warn("Format data tidak sesuai:", data)
      return []
    }
  } catch (error) {
    console.error("Error fetching approved editors:", error)
    return []
  }
}

// Perbarui fungsi fetchRejectedEditors untuk menyertakan data masjid
export const fetchRejectedEditors = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/users/getall`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch rejected editors: ${response.status}`)
    }

    const data = await response.json()
    const rejectedData = data.users.filter((user: User) => user.status === "Rejected" && user.peran === "Editor")

    // Tambahkan informasi masjid untuk setiap editor yang ditolak
    if (Array.isArray(rejectedData)) {
      // Jika masjid_id ada tapi nama_masjid tidak ada, ambil data masjid
      const editorsWithMasjid = await Promise.all(
        rejectedData.map(async (editor: User) => {
          if (editor.masjid_id && !editor.nama_masjid) {
            try {
              const masjidResponse = await fetch(`${API_URL}/api/masjid/${editor.masjid_id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token || ""}`,
                },
              })

              if (masjidResponse.ok) {
                const masjidData = await masjidResponse.json()
                if (masjidData.success && masjidData.data) {
                  return {
                    ...editor,
                    nama_masjid: masjidData.data.nama_masjid,
                  }
                }
              }
            } catch (error) {
              console.error(`Error fetching masjid data for editor ${editor.id}:`, error)
            }
          }
          return editor
        }),
      )

      return editorsWithMasjid
    } else {
      console.warn("Format data tidak sesuai:", data)
      return []
    }
  } catch (error) {
    console.error("Error fetching rejected editors:", error)
    return []
  }
}

export const approveEditor = async (editorId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/access/editors/${editorId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to approve editor: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      toast.success("Editor berhasil disetujui")
      return true
    } else {
      throw new Error(data.message || "Gagal menyetujui editor")
    }
  } catch (error) {
    console.error("Error approving editor:", error)
    toast.error("Gagal menyetujui editor")
    return false
  }
}

export const rejectEditor = async (editorId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/access/editors/${editorId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to reject editor: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      toast.success("Editor berhasil ditolak")
      return true
    } else {
      throw new Error(data.message || "Gagal menolak editor")
    }
  } catch (error) {
    console.error("Error rejecting editor:", error)
    toast.error("Gagal menolak editor")
    return false
  }
}

// Masjid API functions
export const fetchMasjids = async (): Promise<Masjid[]> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/masjid`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch masjids: ${response.status}`)
    }

    const data = await response.json()

    if (data.success && Array.isArray(data.data)) {
      return data.data
    } else {
      console.warn("Format data masjid tidak sesuai:", data)
      return []
    }
  } catch (error) {
    console.error("Error fetching masjids:", error)
    toast.error("Gagal memuat data masjid")
    return []
  }
}

export const fetchMasjidEditors = async (masjidId: string): Promise<User[]> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/masjid/${masjidId}/editors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
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
}

export const createMasjid = async (masjidData: MasjidFormData): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")

    if (!masjidData.nama_masjid || !masjidData.alamat) {
      toast.error("Nama masjid dan alamat harus diisi")
      return false
    }

    const response = await fetch(`${API_URL}/api/masjid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(masjidData),
    })

    if (!response.ok) {
      throw new Error(`Failed to create masjid: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      toast.success("Masjid berhasil ditambahkan")
      return true
    } else {
      throw new Error(data.message || "Gagal menambahkan masjid")
    }
  } catch (error) {
    console.error("Error creating masjid:", error)
    toast.error("Gagal menambahkan masjid")
    return false
  }
}

export const updateMasjid = async (masjidId: string, masjidData: MasjidFormData): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")

    if (!masjidId || !masjidData.nama_masjid || !masjidData.alamat) {
      toast.error("Nama masjid dan alamat harus diisi")
      return false
    }

    const response = await fetch(`${API_URL}/api/masjid/${masjidId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(masjidData),
    })

    if (!response.ok) {
      throw new Error(`Failed to update masjid: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      toast.success("Masjid berhasil diperbarui")
      return true
    } else {
      throw new Error(data.message || "Gagal memperbarui masjid")
    }
  } catch (error) {
    console.error("Error updating masjid:", error)
    toast.error("Gagal memperbarui masjid")
    return false
  }
}

export const deleteMasjid = async (masjidId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/masjid/${masjidId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete masjid: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      toast.success("Masjid berhasil dihapus")
      return true
    } else {
      throw new Error(data.message || "Gagal menghapus masjid")
    }
  } catch (error) {
    console.error("Error deleting masjid:", error)
    toast.error("Gagal menghapus masjid")
    return false
  }
}

// Registration API functions
export const uploadFile = async (file: File) => {
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
    throw error
  }
}

export interface UserDataUpdate {
  [key: string]: any
}

export const updateUserData = async (userId: string, userData: UserDataUpdate) => {
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

    return true
  } catch (error) {
    console.error("Error updating user data:", error)
    throw error
  }
}
