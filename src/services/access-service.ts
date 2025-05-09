import type { Masjid } from "@/types/masjid"
import type { ViewerRequest } from "@/types/viewer"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_HOST_NAME

export const getUserMasjidId = async (): Promise<string | null> => {
  try {
    const token = localStorage.getItem("token")
    if (!token) return null

    const response = await fetch(`${API_URL}/api/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`)
    }

    const userData = await response.json()
    if (userData.success && userData.user) {
      return userData.user.masjid_id
    } else if (userData.user.id) {
      return userData.user.masjid_id
    }

    return null
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

export const fetchAvailableMasjids = async (): Promise<Masjid[]> => {
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
      throw new Error(`Failed to fetch available masjids: ${response.status}`)
    }

    const result = await response.json()

    if (result.success && Array.isArray(result.data)) {
      return result.data
    } else {
      console.warn("Format data tidak sesuai:", result)
      return []
    }
  } catch (error) {
    console.error("Error fetching available masjids:", error)
    return []
  }
}

export const fetchAccessibleMasjids = async (): Promise<Masjid[]> => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/access/masjids`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch accessible masjids: ${response.status}`)
    }

    const data = await response.json()
    if (data.success && Array.isArray(data.data)) {
      return data.data
    } else {
      console.warn("Format data tidak sesuai:", data)
      return []
    }
  } catch (error) {
    console.error("Error fetching accessible masjids:", error)
    return []
  }
}

export const fetchPendingViewerRequests = async (masjidId: string): Promise<ViewerRequest[]> => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/access/viewers/pending/masjid/${masjidId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch pending viewer requests: ${response.status}`)
    }

    const data = await response.json()

    if (data.success && Array.isArray(data.data)) {
      return data.data
    } else {
      console.warn("Format data tidak sesuai:", data)
      return []
    }
  } catch (error) {
    console.error("Error fetching pending viewer requests:", error)
    return []
  }
}

export const fetchApprovedViewers = async (masjidId: string): Promise<ViewerRequest[]> => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/access/viewers/masjid/${masjidId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch approved viewers: ${response.status}`)
    }

    const data = await response.json()

    if (data.success && Array.isArray(data.data)) {
      return data.data
    } else {
      console.warn("Format data tidak sesuai:", data)
      return []
    }
  } catch (error) {
    console.error("Error fetching approved viewers:", error)
    return []
  }
}

export const requestViewerAccess = async (masjidId: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/access/viewers/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ masjidId }),
    })

    if (!response.ok) {
      throw new Error(`Failed to request viewer access: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      toast.success("Permintaan akses berhasil dikirim")
      return true
    } else {
      throw new Error(data.message || "Gagal mengirim permintaan akses")
    }
  } catch (error) {
    console.error("Error requesting viewer access:", error)
    toast.error(error instanceof Error ? error.message : "Gagal mengirim permintaan akses")
    return false
  }
}

export const approveViewerRequest = async (requestId: string, masjidId: string | null): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/access/viewers/${requestId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ masjidId }),
    })

    if (!response.ok) {
      throw new Error(`Failed to approve viewer request: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      toast.success("Permintaan akses viewer berhasil disetujui")
      return true
    } else {
      throw new Error(data.message || "Gagal menyetujui permintaan akses")
    }
  } catch (error) {
    console.error("Error approving viewer request:", error)
    toast.error(error instanceof Error ? error.message : "Gagal menyetujui permintaan akses")
    return false
  }
}

export const rejectViewerRequest = async (requestId: string, masjidId: string | null): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/access/viewers/${requestId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ masjidId }),
    })

    if (!response.ok) {
      throw new Error(`Failed to reject viewer request: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      toast.success("Permintaan akses viewer berhasil ditolak")
      return true
    } else {
      throw new Error(data.message || "Gagal menolak permintaan akses")
    }
  } catch (error) {
    console.error("Error rejecting viewer request:", error)
    toast.error(error instanceof Error ? error.message : "Gagal menolak permintaan akses")
    return false
  }
}

export const removeViewerAccess = async (requestId: string, masjidId: string | null): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/api/access/viewers/${requestId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ masjidId }),
    })

    if (!response.ok) {
      throw new Error(`Failed to remove viewer access: ${response.status}`)
    }

    const data = await response.json()

    if (data.success) {
      toast.success("Akses viewer berhasil dihapus")
      return true
    } else {
      throw new Error(data.message || "Gagal menghapus akses viewer")
    }
  } catch (error) {
    console.error("Error removing viewer access:", error)
    toast.error(error instanceof Error ? error.message : "Gagal menghapus akses viewer")
    return false
  }
}
