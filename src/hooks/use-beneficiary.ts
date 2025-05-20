import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Beneficiary, PaginationInfo } from "@/types/beneficiary";
import { shareToWhatsApp } from "@/utils/sharebeneficiary";

const ITEMS_PER_PAGE = 10;
const API_URL = import.meta.env.VITE_HOST_NAME;

export default function useBeneficiary() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: ITEMS_PER_PAGE
  });

  useEffect(() => {
    fetchBeneficiaries();
  }, [currentPage, search]);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/beneficiary?page=${currentPage}&limit=${ITEMS_PER_PAGE}&nama_instansi=${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch beneficiaries: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBeneficiaries(data.data || []);
        setPagination({
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 1,
          currentPage: data.pagination?.currentPage || 1,
          limit: ITEMS_PER_PAGE
        });
      } else {
        throw new Error(data.message || "Failed to fetch beneficiaries");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Penerima manfaat gagal dimuat!");
    } finally {
      setLoading(false);
    }
  };

  const handleShareBeneficiary = (beneficiary: Beneficiary, e: React.MouseEvent) => {
    e.stopPropagation();
    shareToWhatsApp(beneficiary);
  };

  const handleDeleteBeneficiary = async (id: string | undefined) => {
    if (!id) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/beneficiary/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete beneficiary: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBeneficiaries(beneficiaries.filter(beneficiary => beneficiary.id !== id));
        toast.success(data.message || "Penerima manfaat berhasil dihapus");

        // If this was the last item on the page and not on page 1, go to previous page
        if (beneficiaries.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          // Refresh data to get updated pagination
          await fetchBeneficiaries();
        }
      } else {
        throw new Error(data.message || "Failed to delete beneficiary");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete beneficiary");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleNavigate = (id: string) => {
    navigate(`/penerima-manfaat/${id}`);
  };

  const handleDeleteClick = (beneficiary: Beneficiary, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBeneficiary(beneficiary);
    setShowDeleteDialog(true);
  };

  const refreshData = async () => {
    await fetchBeneficiaries();
  };

  const clearSearch = () => {
    setSearch("");
  };

  return {
    loading,
    error,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    beneficiaries,
    pagination,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedBeneficiary,
    handleShareBeneficiary,
    handleDeleteBeneficiary,
    handleNavigate,
    handleDeleteClick,
    refreshData,
    clearSearch,
  };
}