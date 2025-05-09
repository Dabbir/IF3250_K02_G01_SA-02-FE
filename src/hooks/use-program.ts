import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Program, STATUS_OPTIONS } from "@/types/program"

const API_URL = import.meta.env.VITE_HOST_NAME;
const ITEMS_PER_PAGE = 15;

export default function useProgram() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [totalPrograms, setTotalPrograms] = useState(0);
    const [programList, setProgramList] = useState<Program[]>([]);
    const [sortBy, setSortBy] = useState<keyof Program>("created_at");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
    const [filterOpen, setFilterOpen] = useState(false);
    const [statusFilters, setStatusFilters] = useState<
        (typeof STATUS_OPTIONS)[number][]
    >([]);

    const fetchPrograms = async (
        page: number,
        searchTerm: string,
        sortField: keyof Program,
        order: "ASC" | "DESC",
        statuses: string[]
    ) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const qs = new URLSearchParams({
                page: page.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                ...(searchTerm && { search: searchTerm }),
                sortBy: sortField,
                sortOrder: order,
                ...(statuses.length > 0 && { status: statuses.join(",") }),
            });
    
            const res = await fetch(`${API_URL}/api/program?${qs}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { data, total } = await res.json();
            setProgramList(data);
            setTotalPrograms(total);
        } catch (e) {
          console.error(e);
          toast.error("Gagal memuat data program");
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms(currentPage, search.trim(), sortBy, sortOrder, statusFilters);
    }, [currentPage, search, sortBy, sortOrder, statusFilters]);
    
    const totalPages = Math.ceil(totalPrograms / ITEMS_PER_PAGE);

    const handleDeleteProgram = async (programId: number): Promise<boolean> => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/program/${programId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Gagal menghapus program");

            const isLastItemOnPage = programList.length === 1 && currentPage > 1;
            const nextPage = isLastItemOnPage ? currentPage - 1 : currentPage;

            setCurrentPage(nextPage);
            fetchPrograms(
                currentPage,
                search.trim(),
                sortBy,
                sortOrder,
                statusFilters
            );

            return true;
        } catch (error) {
            console.error("Error deleting program:", error);
            toast.error("Gagal menghapus program");
            return false;
        }
    };

    function toggleStatusFilter(s: (typeof STATUS_OPTIONS)[number]) {
        setStatusFilters((fs) =>
            fs.includes(s) ? fs.filter((x) => x !== s) : [...fs, s]
        );
    };

    const handleNavigate = (id: Number | undefined) => {
        if (id) {
            navigate(`/data-program/${id}`)
        }
    }

    return {
        search,
        setSearch,
        isOpen, 
        setIsOpen,
        loading,
        setSortBy,
        setSortOrder,
        fetchPrograms,
        filterOpen,
        setFilterOpen,
        sortBy,
        currentPage,
        setCurrentPage,
        totalPrograms,
        sortOrder,
        totalPages,
        programList,
        setProgramList,
        statusFilters,
        setStatusFilters,
        handleDeleteProgram,
        toggleStatusFilter,
        handleNavigate
    }
}
