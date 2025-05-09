"use client"

import { useState, useEffect } from "react"
import { Masjid } from "@/types/masjid"
import type { ViewerRequest, CurrentAction } from "@/types/viewer"
import * as AccessService from "@/services/access-service"

const ITEMS_PER_PAGE = 10

export const useViewerAccess = () => {
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
    const initializeData = async () => {
      const masjidId = await AccessService.getUserMasjidId()
      if (masjidId) {
        setUserMasjidId(masjidId)
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
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableMasjids = async () => {
    const data = await AccessService.fetchAvailableMasjids()
    setAvailableMasjids(data)
  }

  const fetchAccessibleMasjids = async () => {
    const data = await AccessService.fetchAccessibleMasjids()
    setAccessibleMasjids(data)
  }

  const fetchPendingViewerRequests = async (masjidId: string) => {
    const data = await AccessService.fetchPendingViewerRequests(masjidId)
    setPendingViewerRequests(data)
  }

  const fetchApprovedViewers = async (masjidId: string) => {
    const data = await AccessService.fetchApprovedViewers(masjidId)
    setApprovedViewers(data)
  }

  const handleAction = async () => {
    if (!currentAction) return
    setIsLoading(true)

    try {
      switch (currentAction.type) {
        case "request":
          const requestSuccess = await AccessService.requestViewerAccess(currentAction.itemId)
          if (requestSuccess) {
            await fetchAccessibleMasjids()
          }
          break
        case "approve":
          const approveSuccess = await AccessService.approveViewerRequest(currentAction.itemId, userMasjidId)
          if (approveSuccess && userMasjidId) {
            await Promise.all([fetchPendingViewerRequests(userMasjidId), fetchApprovedViewers(userMasjidId)])
          }
          break
        case "reject":
          const rejectSuccess = await AccessService.rejectViewerRequest(currentAction.itemId, userMasjidId)
          if (rejectSuccess && userMasjidId) {
            await fetchPendingViewerRequests(userMasjidId)
          }
          break
        case "remove":
          const removeSuccess = await AccessService.removeViewerAccess(currentAction.itemId, userMasjidId)
          if (removeSuccess && userMasjidId) {
            await fetchApprovedViewers(userMasjidId)
          }
          break
      }
    } finally {
      setIsLoading(false)
      setIsConfirmOpen(false)
      setCurrentAction(null)
    }
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
