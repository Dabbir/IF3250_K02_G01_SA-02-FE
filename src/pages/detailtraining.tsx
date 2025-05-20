"use client"

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, MapPin, Users, Calendar, Info, Loader2, GraduationCap } from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Training, TrainingAvailability } from "@/types/training";
import TrainingEditForm from "@/components/training/trainingEditForm";
import ParticipantList from "@/components/training/participantList";
import { formatDateTimeToWIB } from "@/utils/dateUtils";

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [training, setTraining] = useState<Training | null>(null);
  const [availability, setAvailability] = useState<TrainingAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchTrainingDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Fetch training details
        const trainingResponse = await fetch(`${API_URL}/api/trainings/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!trainingResponse.ok) {
          throw new Error(`Failed to fetch training: ${trainingResponse.status}`);
        }

        const trainingData = await trainingResponse.json();

        if (!trainingData.success) {
          throw new Error(trainingData.message || "Failed to fetch training");
        }

        setTraining(trainingData.data);

        // Fetch availability
        const availabilityResponse = await fetch(`${API_URL}/api/trainings/${id}/availability`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (availabilityResponse.ok) {
          const availabilityData = await availabilityResponse.json();
          if (availabilityData.success) {
            setAvailability(availabilityData.data);
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Gagal memuat detail pelatihan");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTrainingDetails();
    }
  }, [id]);

  const handleTrainingUpdated = (updatedTraining: Training) => {
    setTraining(updatedTraining);
    toast.success("Pelatihan berhasil diperbarui");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Ongoing":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (error || !training) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
        <CardContent className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || "Pelatihan tidak ditemukan"}</p>
            <Button
              onClick={() => navigate("/pelatihan")}
              className="bg-[#3A786D] text-white"
            >
              Kembali ke Daftar Pelatihan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleGoBack = () => {
    navigate("/pelatihan");
  };

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 md:pb-3 pt-4 md:pt-6 px-4 md:px-6">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-0" onClick={handleGoBack}>
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <GraduationCap className="h-6 w-6 text-slate-700" />
            <CardTitle className="text-lg sm:text-xl truncate">Detail Pelatihan</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4 md:pb-6 px-4 md:px-6">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-[#3A786D] mb-2 md:mb-0">{training.nama_pelatihan}</h1>
            <Badge className={`font-medium ${getStatusColor(training.status)} px-3 py-1`}>
              {training.status}
            </Badge>
          </div>
          <p className="text-gray-700 mt-2">{training.deskripsi || "Tidak ada deskripsi."}</p>
        </div>

        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="info" className="text-sm md:text-base">
              <Info className="h-4 w-4 mr-2" />
              Informasi
            </TabsTrigger>
            <TabsTrigger value="participants" className="text-sm md:text-base">
              <Users className="h-4 w-4 mr-2" />
              Peserta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-[#3A786D] text-lg">Detail Pelatihan</h3>
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Waktu Mulai</div>
                    <div className="text-gray-600">{formatDateTimeToWIB(new Date(training.waktu_mulai))}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Waktu Selesai</div>
                    <div className="text-gray-600">{formatDateTimeToWIB(new Date(training.waktu_akhir))}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Lokasi</div>
                    <div className="text-gray-600">{training.lokasi}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-0.5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Kuota</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-600">{training.kuota} orang</div>
                      {availability && (
                        <Badge variant="outline" className="ml-2 bg-white">
                          {availability.available_slots} tersedia
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {training.nama_masjid && (
                  <div className="flex items-start">
                    <div className="h-5 w-5 mr-3 mt-0.5 text-gray-500">🕌</div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">Masjid</div>
                      <div className="text-gray-600">{training.nama_masjid}</div>
                    </div>
                  </div>
                )}

                {training.created_by_name && (
                  <div className="flex items-start">
                    <div className="h-5 w-5 mr-3 mt-0.5 text-gray-500">👤</div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">Dibuat oleh</div>
                      <div className="text-gray-600">{training.created_by_name}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-[#3A786D] text-lg">Edit Pelatihan</h3>
                <TrainingEditForm 
                  training={training} 
                  onSuccess={handleTrainingUpdated} 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="mt-0">
            <ParticipantList trainingId={training.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}