import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { Publikasi, PaginationInfo, FilterOptions } from "@/types/publication";
import { shareToWhatsApp } from "@/utils/sharepublication";

const ITEMS_PER_PAGE = 20;
const API_URL = import.meta.env.VITE_HOST_NAME;

export default function usePublication() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publikasiList, setPublikasiList] = useState<Publikasi[]>([]);
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0
  });

  const [sortColumn, setSortColumn] = useState<string>("tanggal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filters
  const [toneFilters, setToneFilters] = useState<string[]>([]);
  const [mediaFilters, setMediaFilters] = useState<string[]>([]);
  const [programFilters, setProgramFilters] = useState<string[]>([]);
  const [activityFilters, setActivityFilters] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [prValueMin, setPrValueMin] = useState<number | undefined>();
  const [prValueMax, setPrValueMax] = useState<number | undefined>();
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Search with debounce
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, sortColumn, sortOrder, toneFilters, mediaFilters, dateFrom, dateTo, prValueMin, prValueMax]);

  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchData();
    }, 500);

    setSearchTimer(timer);

    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const url = new URL(`${API_URL}/api/publication`);
      url.searchParams.append('page', currentPage.toString());
      url.searchParams.append('limit', ITEMS_PER_PAGE.toString());

      if (search) {
        url.searchParams.append('search', search);
      }

      const columnMapping: Record<string, string> = {
        'judul': 'judul_publikasi',
        'tanggal': 'tanggal_publikasi',
        'prValue': 'pr_value',
        'tone': 'tone'
      };

      const backendSortColumn = columnMapping[sortColumn] || 'tanggal_publikasi';
      url.searchParams.append('sortBy', backendSortColumn);
      url.searchParams.append('sortOrder', sortOrder);

      if (toneFilters.length > 0) {
        url.searchParams.append('toneFilters', toneFilters.join(','));
      }
      if (mediaFilters.length > 0) {
        url.searchParams.append('mediaFilters', mediaFilters.join(','));
      }
      if (dateFrom) {
        url.searchParams.append('dateFrom', dateFrom);
      }
      if (dateTo) {
        url.searchParams.append('dateTo', dateTo);
      }
      if (prValueMin !== undefined) {
        url.searchParams.append('prValueMin', prValueMin.toString());
      }
      if (prValueMax !== undefined) {
        url.searchParams.append('prValueMax', prValueMax.toString());
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        const formattedData: Publikasi[] = result.data.map((item: any): Publikasi => ({
          id: item.id || "",
          judul: item.judul_publikasi || "",
          media: item.media_publikasi || "Media Online",
          perusahaan: item.nama_perusahaan_media || "",
          tanggal: item.tanggal_publikasi || "",
          link: item.url_publikasi || "",
          prValue: item.pr_value || 0,
          nama_program: item.nama_program || "",
          nama_aktivitas: item.nama_aktivitas || "",
          tone: item.tone || "Netral",
        }));

        setPublikasiList(formattedData);
        setPagination(result.pagination);
      } else {
        throw new Error(result.message || "Gagal mengambil publikasi.");
      }
    } catch (error) {
      console.error("Error fetching publikasi:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error("Gagal memuat data, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`${API_URL}/api/publication/filter-options`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const refreshData = async () => {
    setCurrentPage(1);
    await fetchData();
  };

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const toggleToneFilter = (tone: string) => {
    setToneFilters(prev => {
      if (prev.includes(tone)) {
        return prev.filter(t => t !== tone);
      } else {
        return [...prev, tone];
      }
    });
    setCurrentPage(1);
  };

  const handleSharePublication = (item: Publikasi) => {
    shareToWhatsApp(item);
  };

  const deletePublikasi = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Token tidak ditemukan, silakan login kembali");
        return false;
      }

      const response = await fetch(`${API_URL}/api/publication/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus publikasi.");
      }

      return true;
    } catch (error) {
      console.error("Error deleting publikasi:", error);
      return false;
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus publikasi ini?")) {
      const deleted = await deletePublikasi(id);
      if (deleted) {
        await refreshData();
        toast.success("Publikasi berhasil dihapus!");
      } else {
        toast.error("Gagal menghapus publikasi. Silakan coba lagi.");
      }
    }
  };

  const handleNavigate = (id: string) => {
    navigate(`/publikasi/${id}`);
  };

  const clearAllFilters = () => {
    setToneFilters([]);
    setSearch("");
    setMediaFilters([]);
    setProgramFilters([]);
    setActivityFilters([]);
    setDateFrom("");
    setDateTo("");
    setPrValueMin(undefined);
    setPrValueMax(undefined);
  };

  const clearToneFilters = () => {
    setToneFilters([]);
  };

  return {
    loading,
    error,
    search,
    setSearch,
    publikasiList,
    pagination,
    currentPage,
    setCurrentPage,
    sortColumn,
    sortOrder,
    handleSortChange,
    
    // Filters
    toneFilters,
    toggleToneFilter,
    clearToneFilters,
    mediaFilters,
    setMediaFilters,
    programFilters,
    setProgramFilters,
    activityFilters,
    setActivityFilters,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    prValueMin,
    setPrValueMin,
    prValueMax,
    setPrValueMax,
    filterOptions,
    filterOpen,
    setFilterOpen,
    clearAllFilters,
    
    // Actions
    handleSharePublication,
    handleDeletePublication,
    handleNavigate,
    refreshData,
  };
}