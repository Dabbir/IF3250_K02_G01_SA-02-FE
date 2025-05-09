"use client"

import { useState, useEffect } from "react"
import type { ViewerRequest, CurrentAction } from "@/types/viewer"
import type { Masjid } from "@/types/masjid"
import { toast } from "sonner"

const API_URL = import.meta.env.VITE_HOST_NAME
const ITEMS_PER_PAGE = 10

export default function useViewerAccess() {
  const [search, setSearch] = useState("")
  const [currentTab, setCurrentTab] = useState("available-masjids")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<CurrentAction | null>(null)

  const [availableMasjids, setAvailableMasjids] = useState<Masjid[]>([])
  const [accessibleMasjids, setAccessibleMasjids] = useState<Masjid[]>([])
  const [pendingViewerRequests, setPendingViewerRequests] = useState<ViewerRequest[]>([])
  const [approvedViewers, setApprovedViewers] = useState<ViewerRequest[]>([])
  const [userMasjidId, setUserMasjidId] = useState<string | null>(null)

  useEffect(() => {
    const getUserMasjidId = async () => {
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
          setUserMasjidId(userData.user.masjid_id)
          return userData.user.masjid_id
        } else if (userData.user.id) {
          setUserMasjidId(userData.user.masjid_id)
          return userData.user.masjid_id
        }

        return null
      } catch (error) {
        console.error("Error fetching user data:", error)
        return null
      }
    }

    const initializeData = async () => {
      const masjidId = await getUserMasjidId()
      if (masjidId) {
        fetchData(masjidId)
      }
    }

    initializeData()
  }, [])

  const fetchData = async (masjidId: string) => {
    setIsLoading(true)
    try {
      await Promise.all([
        fetchAvailableMasjids(),
        fetchAccessibleMasjids(),
        fetchPendingViewerRequests(masjidId),
        fetchApprovedViewers(masjidId),
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Gagal memuat data")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableMasjids = async () => {
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
        setAvailableMasjids(result.data)
      } else {
        console.warn("Format data tidak sesuai:", result)
        setAvailableMasjids([])
      }
    } catch (error) {
      console.error("Error fetching available masjids:", error)
      setAvailableMasjids([])
    }
  }

  const fetchAccessibleMasjids = async () => {
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
        setAccessibleMasjids(data.data)
      } else {
        console.warn("Format data tidak sesuai:", data)
        setAccessibleMasjids([])
      }
    } catch (error) {
      console.error("Error fetching accessible masjids:", error)
      setAccessibleMasjids([])
    }
  }

  const fetchPendingViewerRequests = async (masjidId: string) => {
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
        setPendingViewerRequests(data.data)
      } else {
        console.warn("Format data tidak sesuai:", data)
        setPendingViewerRequests([])
      }
    } catch (error) {
      console.error("Error fetching pending viewer requests:", error)
      setPendingViewerRequests([])
    }
  }

  const fetchApprovedViewers = async (masjidId: string) => {
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
        setApprovedViewers(data.data)
      } else {
        console.warn("Format data tidak sesuai:", data)
        setApprovedViewers([])
      }
    } catch (error) {
      console.error("Error fetching approved viewers:", error)
      setApprovedViewers([])
    }
  }

  const requestViewerAccess = async (masjidId: string) => {
    try {
      setIsLoading(true)
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
        await fetchAccessibleMasjids()
        return true
      } else {
        throw new Error(data.message || "Gagal mengirim permintaan akses")
      }
    } catch (error) {
      console.error("Error requesting viewer access:", error)
      toast.error(error instanceof Error ? error.message : "Gagal mengirim permintaan akses")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const approveViewerRequest = async (requestId: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/api/access/viewers/${requestId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ masjidId: userMasjidId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to approve viewer request: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Permintaan akses viewer berhasil disetujui")

        if (userMasjidId) {
          await Promise.all([fetchPendingViewerRequests(userMasjidId), fetchApprovedViewers(userMasjidId)])
        }
        return true
      } else {
        throw new Error(data.message || "Gagal menyetujui permintaan akses")
      }
    } catch (error) {
      console.error("Error approving viewer request:", error)
      toast.error(error instanceof Error ? error.message : "Gagal menyetujui permintaan akses")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const rejectViewerRequest = async (requestId: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/api/access/viewers/${requestId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ masjidId: userMasjidId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to reject viewer request: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Permintaan akses viewer berhasil ditolak")

        if (userMasjidId) {
          await fetchPendingViewerRequests(userMasjidId)
        }
        return true
      } else {
        throw new Error(data.message || "Gagal menolak permintaan akses")
      }
    } catch (error) {
      console.error("Error rejecting viewer request:", error)
      toast.error(error instanceof Error ? error.message : "Gagal menolak permintaan akses")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeViewerAccess = async (requestId: string) => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/api/access/viewers/${requestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ masjidId: userMasjidId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to remove viewer access: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast.success("Akses viewer berhasil dihapus")

        if (userMasjidId) {
          await fetchApprovedViewers(userMasjidId)
        }
        return true
      } else {
        throw new Error(data.message || "Gagal menghapus akses viewer")
      }
    } catch (error) {
      console.error("Error removing viewer access:", error)
      toast.error(error instanceof Error ? error.message : "Gagal menghapus akses viewer")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async () => {
    if (!currentAction) return

    switch (currentAction.type) {
      case "request":
        await requestViewerAccess(currentAction.itemId)
        break
      case "approve":
        await approveViewerRequest(currentAction.itemId)
        break
      case "reject":
        await rejectViewerRequest(currentAction.itemId)
        break
      case "remove":
        await removeViewerAccess(currentAction.itemId)
        break
    }
    setIsConfirmOpen(false)
    setCurrentAction(null)
  }

  const confirmAction = (type: "request" | "approve" | "reject" | "remove", itemId: string, itemName: string) => {
    setCurrentAction({ type, itemId, itemName })
    setIsConfirmOpen(true)
  }

  const getFilteredItems = () => {
    let items: Masjid[] | ViewerRequest[] = []

    switch (currentTab) {
      case "available-masjids":
        items = availableMasjids.filter(
          (masjid) =>
            !accessibleMasjids.some((access) => access.id === masjid.id) && String(masjid.id) !== userMasjidId,
        )
        break
      case "my-access":
        items = accessibleMasjids.filter((masjid) => String(masjid.id) !== userMasjidId)
        break
      case "pending-requests":
        items = pendingViewerRequests
        break
      case "approved-viewers":
        items = approvedViewers
        break
    }

    if (search) {
      return items.filter((item) => {
        const masjidItem = item as Masjid
        const viewerItem = item as ViewerRequest

        if ("nama_masjid" in item && masjidItem.nama_masjid) {
          return masjidItem.nama_masjid.toLowerCase().includes(search.toLowerCase())
        } else if ("viewer_nama" in item) {
          return (
            (viewerItem.viewer_nama && viewerItem.viewer_nama.toLowerCase().includes(search.toLowerCase())) ||
            (viewerItem.viewer_email && viewerItem.viewer_email.toLowerCase().includes(search.toLowerCase()))
          )
        }
        return false
      })
    }

    return items
  }

  const filteredItems = getFilteredItems()
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const displayedItems = filteredItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const changeTab = (tab: string) => {
    setCurrentTab(tab)
    setCurrentPage(1)
    setSearch("")
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  return {
    search,
    currentTab,
    currentPage,
    isLoading,
    isConfirmOpen,
    currentAction,
    pendingViewerRequests,
    displayedItems,
    totalPages,
    userMasjidId,
    setCurrentPage,
    setIsConfirmOpen,
    confirmAction,
    handleAction,
    changeTab,
    handleSearch,
  }
}
