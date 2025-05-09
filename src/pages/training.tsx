"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Download, GraduationCap, ChevronDown, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import TrainingList from "@/components/training/trainingList";
import AddTraining from "@/components/training/addTraining";
import TrainingStatusFilter from "@/components/training/trainingStatusFilter";
import { Training } from "@/lib/training";

interface userData {
  id: number;
  masjid_id: number;
}

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const [masjidName, setMasjidName] = useState("");
  const [user, setUser] = useState<userData>({
    id: 0,
    masjid_id: 0,
  });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, [currentPage, search, status]);

  useEffect(() => {
    if (user.masjid_id) {
      fetchMasjidDetails();
    }
  }, [user.masjid_id]);

  const fetchUser = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/api/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal memuat data pengguna");
        }

        const { id, masjid_id } = data.user;
        setUser({ id, masjid_id });
    } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Gagal memuat data pengguna");
    }
  };

  const fetchMasjidDetails = async () => {
    try {
        const token = localStorage.getItem("token");
        const masjidResponse = await fetch(`${API_URL}/api/masjid/${user.masjid_id}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
        });
      
        if (masjidResponse.ok) {
            const masjidData = await masjidResponse.json();
            if (masjidData.success && masjidData.data) {
            setMasjidName(masjidData.data.nama_masjid);
            }
        }
    } catch (error) {
      console.error("Error fetching masjid details:", error);
    }
  };

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/trainings?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${search}&status=${status}&trainingRegistration=false`, 
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current && 
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1); 
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

  if (loading && trainings.length === 0) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
        </CardContent>
      </Card>
    );
  }

  if (error && trainings.length === 0) {
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
      <CardHeader className="flex flex-row items-center justify-between md:justify-start md:gap-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Manajemen Pelatihan</h2>
        </div>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Menu pelatihan"
            title="Menu pelatihan"
          >
              <ChevronDown className="h-5 w-5 text-gray-600" />
          </button>

          {dropdownOpen && (
            <div 
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-opacity-2 focus:outline-none z-10"
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate("/pelatihan");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Manajemen Pelatihan
                </button>
                <button
                  onClick={() => {
                    navigate("/pelatihan-umum");
                    setDropdownOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Daftar Pelatihan
                </button>
              </div>
            </div>
          )}
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
          masjidNameParam={masjidName || ""}
          masjidId={user.masjid_id || 0}
        />
      </CardContent>
    </Card>
  );
}