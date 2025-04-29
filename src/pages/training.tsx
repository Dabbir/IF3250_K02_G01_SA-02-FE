"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Loader2, Download, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TrainingList from "@/components/training/trainingList";
import AddTraining from "@/components/training/addTraining";
import TrainingStatusFilter from "@/components/training/trainingStatusFilter";
import { Training } from "@/lib/training";

const ITEMS_PER_PAGE = 10;
const API_URL = import.meta.env.VITE_HOST_NAME;

export default function TrainingPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${API_URL}/api/trainings?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${search}&status=${status}`, 
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch trainings: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setTrainings(data.data || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalItems(data.pagination?.total || 0);
        } else {
          throw new Error(data.message || "Failed to fetch trainings");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Pelatihan gagal dimuat!");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, [currentPage, search, status]);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDeleteTraining = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/trainings/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete training: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Remove the deleted training from the state
        setTrainings((prevTrainings) => prevTrainings.filter(training => training.id !== id));
        toast.success("Pelatihan berhasil dihapus");
        
        // If this was the last item on the page and not the first page, go back one page
        if (trainings.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      } else {
        throw new Error(data.message || "Failed to delete training");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete training");
    }
  };

  const exportTrainingsToExcel = () => {
    if (trainings.length === 0) {
      toast.info("Tidak ada data pelatihan untuk diekspor");
      return;
    }

    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.json_to_sheet(trainings.map(training => ({
        "Nama Pelatihan": training.nama_pelatihan,
        "Deskripsi": training.deskripsi || "",
        "Lokasi": training.lokasi || "",
        "Waktu Mulai": new Date(training.waktu_mulai).toLocaleString(),
        "Waktu Selesai": new Date(training.waktu_akhir).toLocaleString(),
        "Kuota": training.kuota,
        "Status": training.status,
        "Masjid": training.nama_masjid || ""
      })));

      // Set column widths
      const columnWidths = [
        { wch: 30 }, // Name
        { wch: 40 }, // Description
        { wch: 25 }, // Location
        { wch: 22 }, // Start time
        { wch: 22 }, // End time
        { wch: 10 }, // Quota
        { wch: 15 }, // Status
        { wch: 25 }, // Mosque
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Pelatihan");
      XLSX.writeFile(workbook, "Data_Pelatihan.xlsx");
    }).catch(err => {
      console.error("Error exporting data:", err);
      toast.error("Gagal mengekspor data");
    });
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/trainings?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${search}&status=${status}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTrainings(data.data || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalItems(data.pagination?.total || 0);
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
        <CardContent className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#3A786D] text-white"
            >
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Manajemen Pelatihan</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 md:items-center">
          <div className="relative flex-grow items-top w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari nama atau deskripsi pelatihan"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 max-md:h-8 max-md:text-[12px]"
            />
          </div>

          <TrainingStatusFilter 
            status={status} 
            onChange={handleStatusChange}
          />

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full sm:w-auto flex items-center justify-center gap-1"
              onClick={exportTrainingsToExcel}
            >
              <Download className="h-4 w-4" />
              Unduh Data
            </Button>

            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full sm:w-auto flex items-center justify-center"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Tambah Pelatihan
            </Button>
          </div>
        </div>

        <TrainingList 
          trainings={trainings} 
          onDelete={handleDeleteTraining}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          isEmpty={trainings.length === 0}
          searchQuery={search}
          onClearSearch={() => setSearch("")}
        />

        <AddTraining 
          isOpen={isAddDialogOpen} 
          setIsOpen={setIsAddDialogOpen} 
          onSuccess={refreshData}
        />
      </CardContent>
    </Card>
  );
}