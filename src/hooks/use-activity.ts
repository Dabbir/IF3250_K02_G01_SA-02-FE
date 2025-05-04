import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import type { Kegiatan } from "@/types/activity"
import { shareToWhatsApp } from "@/utils/shareactivity"

const ITEMS_PER_PAGE = 20
const API_URL = import.meta.env.VITE_HOST_NAME

export default function useActivity() {
    const [search, setSearch] = useState("")
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<Kegiatan | null>(null)
    const [activities, setActivities] = useState<Kegiatan[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    // Fetching data
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token")

                if (!token) {
                    throw new Error("Authentication token not found")
                }

                const response = await fetch(`${API_URL}/api/activity/getactivity/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch activities: ${response.status}`)
                }

                const data = await response.json()

                if (data.success) {
                    setActivities(data.activity || [])
                } else {
                    throw new Error(data.message || "Failed to fetch activities")
                }
            } catch (err) {
                console.error(err)
                setError("Terjadi kesalahan saat memuat kegiatan")
                toast.error("Gagal memuat kegiatan!")
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [])

    const toggleStatusFilter = (status: string) => {
        setStatusFilters((prev) => {
            if (prev.includes(status)) {
                return prev.filter((s) => s !== status)
            } else {
                return [...prev, status]
            }
        })
        setCurrentPage(1)
    }

    const clearStatusFilters = () => {
        setStatusFilters([])
    }

    // Filter activities
    const [statusFilters, setStatusFilters] = useState<string[]>([])
    const [filterOpen, setFilterOpen] = useState(false)
    const filteredActivities = activities.filter((activity) => {
        const matchesSearch =
            activity.nama_aktivitas && activity.nama_aktivitas.toLowerCase().includes(search.toLowerCase())

        const matchesStatus = statusFilters.length === 0 || statusFilters.includes(activity.status)

        return matchesSearch && matchesStatus
    })

    // Sorting
    const [sortColumn, setSortColumn] = useState<string>("nama_aktivitas")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const handleSortChange = (column: string) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortOrder("asc")
        }
    }

    const sortedActivities = [...filteredActivities].sort((a, b) => {
        const valueA = a[sortColumn as keyof Kegiatan]
        const valueB = b[sortColumn as keyof Kegiatan]

        // Handle date sorting
        if (sortColumn === "tanggal_mulai" || sortColumn === "tanggal_selesai") {
            const dateA = new Date(valueA as string).getTime()
            const dateB = new Date(valueB as string).getTime()
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA
        }

        // Handle string sorting
        if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
        }

        // Handle number sorting
        if (typeof valueA === "number" && typeof valueB === "number") {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA
        }

        return 0
    })

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(sortedActivities.length / ITEMS_PER_PAGE)
    const displayedActivities = sortedActivities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleDeleteActivity = async (id: string | undefined) => {
        if (!id) return

        try {
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("Authentication token not found")
            }

            const response = await fetch(`${API_URL}/api/activity/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to delete activity: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                setActivities(activities.filter((activity) => activity.id !== id))
                toast.success("Activity deleted successfully")
            } else {
                throw new Error(data.message || "Failed to delete activity")
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete activity")
        } finally {
            setShowDeleteDialog(false)
        }
    }

    const handleNavigate = (id: string | undefined) => {
        if (id) {
            navigate(`/kegiatan/${id}`)
        }
    }

    const handleShareActivity = (activity: Kegiatan) => {
        event?.stopPropagation()
        shareToWhatsApp(activity)
    }

    const handleDeleteClick = (activity: Kegiatan) => {
        setSelectedActivity(activity)
        setShowDeleteDialog(true)
    }

    const clearAllFilters = () => {
        setStatusFilters([])
        setSearch("")
    }

    return {
        loading,
        error,
        search,
        setSearch,
        filterOpen,
        setFilterOpen,
        statusFilters,
        toggleStatusFilter,
        clearStatusFilters,
        activities,
        filteredActivities,
        clearAllFilters,
        displayedActivities,
        handleNavigate,
        handleShareActivity,
        handleDeleteClick,
        sortColumn,
        handleSortChange,
        showDeleteDialog,
        setShowDeleteDialog,
        selectedActivity,
        handleDeleteActivity,
        currentPage,
        totalPages,
        setCurrentPage,
    }
}
