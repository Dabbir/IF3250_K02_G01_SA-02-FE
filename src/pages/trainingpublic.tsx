"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users, Search, Loader2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Training, TrainingAvailability } from "@/lib/training";
import { formatDateTimeToWIB } from "@/utils/dateUtils";
import RegisterTrainingDialog from "@/components/training/registerTrainingDialog";

const ITEMS_PER_PAGE = 6; // Show more per page for public view
const API_URL = import.meta.env.VITE_HOST_NAME;

export default function PublicTrainingPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [availability, setAvailability] = useState<TrainingAvailability | null>(null);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, [currentPage, search]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/trainings?page=${currentPage}&limit=${ITEMS_PER_PAGE}&search=${search}&status=${status}&trainingRegistration=true`,
        {
          headers: {
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
      } else {
        throw new Error(data.message || "Failed to fetch trainings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Gagal memuat daftar pelatihan");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (trainingId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/trainings/${trainingId}/availability`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.data;
        }
      }
      
      // Default values if fetch fails
      return {
        total_kuota: 0,
        used_slots: 0,
        available_slots: 0
      };
    } catch (error) {
      console.error("Error fetching availability:", error);
      return {
        total_kuota: 0,
        used_slots: 0,
        available_slots: 0
      };
    }
  };

  const handleOpenRegisterDialog = async (training: Training) => {
    setSelectedTraining(training);
    
    // Fetch availability before opening dialog
    const availabilityData = await fetchAvailability(training.id);
    setAvailability(availabilityData);
    
    setIsRegisterDialogOpen(true);
  };

  const handleRegistrationSuccess = () => {
    setIsRegisterDialogOpen(false);
    toast.success("Pendaftaran berhasil. Tim kami akan meninjau pendaftaran Anda.");
    fetchTrainings(); // Refresh the list
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Akan Datang</Badge>;
      case "Ongoing":
        return <Badge className="bg-green-100 text-green-800">Sedang Berlangsung</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
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
              onClick={fetchTrainings}
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
          <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Pelatihan Tersedia</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative w-full md:w-2/3 mx-auto mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari pelatihan berdasarkan nama atau deskripsi"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {trainings.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500 mb-2">Tidak ada pelatihan yang tersedia saat ini</p>
              {search && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearch("")}
                >
                  Hapus Pencarian
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainings.map((training) => (
                <Card key={training.id} className="overflow-hidden hover:shadow-lg transition">
                  <div className="p-4 bg-gradient-to-r from-[#3A786D] to-[#4A9B8F] text-white">
                    <h3 className="font-bold text-lg">{training.nama_pelatihan}</h3>
                    <div className="mt-1">
                      {getStatusBadge(training.status)}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3 mb-4 text-sm">
                      {training.deskripsi && (
                        <p className="text-gray-700 mb-3">
                          {training.deskripsi.length > 100 
                            ? `${training.deskripsi.substring(0, 100)}...` 
                            : training.deskripsi
                          }
                        </p>
                      )}
                      
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-700">Waktu</div>
                          <div className="text-gray-600">{formatDateTimeToWIB(new Date(training.waktu_mulai))}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-700">Durasi</div>
                          <div className="text-gray-600">
                            {Math.round((new Date(training.waktu_akhir).getTime() - new Date(training.waktu_mulai).getTime()) / (1000 * 60 * 60))} jam
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-700">Lokasi</div>
                          <div className="text-gray-600">{training.lokasi}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Users className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-700">Kuota</div>
                          <div className="text-gray-600">{training.kuota} Orang</div>
                        </div>
                      </div>
                      
                      {training.nama_masjid && (
                        <div className="flex items-start">
                          <div className="h-4 w-4 mr-2 mt-0.5 text-gray-500">🕌</div>
                          <div>
                            <div className="font-medium text-gray-700">Masjid</div>
                            <div className="text-gray-600">{training.nama_masjid}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-[#3A786D] hover:bg-[#2c5d54] mt-2" 
                      onClick={() => handleOpenRegisterDialog(training)}
                    >
                      Daftar Sekarang
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-8 gap-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm ${currentPage === i + 1
                    ? "bg-[#3A786D] text-white"
                    : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                    }`}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {selectedTraining && availability && (
        <RegisterTrainingDialog
          isOpen={isRegisterDialogOpen}
          onClose={() => setIsRegisterDialogOpen(false)}
          training={selectedTraining}
          availability={availability}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </Card>
  );
}