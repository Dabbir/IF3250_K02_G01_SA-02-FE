"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import type { Stakeholder } from "@/types/stakeholder"

const API_URL = import.meta.env.VITE_HOST_NAME
const ITEMS_PER_PAGE = 20

export default function useStakeholders() {
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItem, setTotalItem] = useState(0)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null)
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [jenisFilters, setJenisFilters] = useState<string[]>([])
    const [filterOpen, setFilterOpen] = useState(false)
    const [sortColumn, setSortColumn] = useState<string>("nama_stakeholder")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

    useEffect(() => {

        const fetchStakeholders = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token")

                if (!token) {
                    throw new Error("Authentication token not found")
                }

                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    limit: ITEMS_PER_PAGE.toString(),
                    nama_stakeholder: search,
                    jenis: jenisFilters.join(","),
                    sortColumn: sortColumn,
                    sortOrder: sortOrder,
                })

                const response = await fetch(`${API_URL}/api/stakeholder/getAll?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch stakeholders: ${response.status}`)
                }

                const data = await response.json()

                if (data.success) {
                    setStakeholders(data.stakeholders || [])
                    setTotalItem(data.total || 0)                 
                } else {
                    throw new Error(data.message || "Failed to fetch stakeholders")
                }
            } catch (err) {
                console.error(err)
                setError("Terjadi kesalahan saat memuat pemangku kepentingan")
                toast.error("Gagal memuat pemangku kepentingan!")
            } finally {
                setLoading(false)
            }
        };

        fetchStakeholders();

    }, [currentPage, search, jenisFilters, sortColumn, sortOrder]);

    const handleDeleteStakeholder = async (id: string | undefined) => {
        if (!id) return

        try {
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("Authentication token not found")
            }

            const response = await fetch(`${API_URL}/api/stakeholder/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to delete stakeholder: ${response.status}`)
            }

            const data = await response.json()

            if (data.success) {
                setStakeholders(stakeholders.filter((item) => item.id !== id))
                toast.success("Stakeholder deleted successfully")
            } else {
                throw new Error(data.message || "Failed to delete stakeholder")
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete stakeholder")
        } finally {
            setShowDeleteDialog(false)
        }
    }

    const handleSortChange = (column: string) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortColumn(column)
            setSortOrder("asc")
        }
    }

    const toggleJenisFilter = (jenis: string) => {
        setJenisFilters((prev) => {
            if (prev.includes(jenis)) {
                return prev.filter((j) => j !== jenis)
            } else {
                return [...prev, jenis]
            }
        })
        setCurrentPage(1)
    }

    const clearJenisFilters = () => {
        setJenisFilters([])
    }

    const clearAllFilters = () => {
        setJenisFilters([])
        setSearch("")
    }

    const totalPages = Math.ceil(totalItem / ITEMS_PER_PAGE)

    return {
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        showDeleteDialog,
        setShowDeleteDialog,
        selectedStakeholder,
        setSelectedStakeholder,
        stakeholders,
        loading,
        error,
        jenisFilters,
        filterOpen,
        setFilterOpen,
        sortColumn,
        sortOrder,
        totalPages,
        handleDeleteStakeholder,
        handleSortChange,
        toggleJenisFilter,
        clearJenisFilters,
        clearAllFilters,
    }
}
