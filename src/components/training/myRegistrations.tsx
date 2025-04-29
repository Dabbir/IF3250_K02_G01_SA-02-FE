import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, MapPin, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { Training } from "@/lib/training";
import { formatDateTimeToWIB } from "@/utils/dateUtils";

interface MyRegistrationsProps {
  userId: string;
}

interface Registration {
  id: string;
  pelatihan_id: string;
  status_pendaftaran: "Pending" | "Approved" | "Rejected" | "Attended";
  catatan?: string;
  created_at?: string;
  training?: Training;
}

const API_URL = import.meta.env.VITE_HOST_NAME;

const MyRegistrations: React.FC<MyRegistrationsProps> = ({ userId }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyRegistrations();
  }, [userId]);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // This endpoint might need to be implemented on the backend
      const response = await fetch(`${API_URL}/api/user/registrations`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch registrations: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // If training details are included in each registration, great!
        // If not, we might need to fetch each training separately
        const registrationsWithDetails = await Promise.all(
          data.data.map(async (registration: Registration) => {
            if (!registration.training) {
              // Fetch training details if not included
              const trainingResponse = await fetch(`${API_URL}/api/trainings/${registration.pelatihan_id}`, {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              });
              
              if (trainingResponse.ok) {
                const trainingData = await trainingResponse.json();
                if (trainingData.success) {
                  return {
                    ...registration,
                    training: trainingData.data
                  };
                }
              }
            }
            return registration;
          })
        );

        setRegistrations(registrationsWithDetails);
      } else {
        throw new Error(data.message || "Failed to fetch registrations");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Gagal memuat pendaftaran pelatihan Anda");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Disetujui</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ditolak</Badge>;
      case "Attended":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Hadir</Badge>;
      case "Pending":
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Menunggu</Badge>;
    }
  };

  // Helper to determine if a training is in the past
  const isPastTraining = (date: string) => {
    return new Date(date) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchMyRegistrations} className="bg-[#3A786D] text-white">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500 mb-2">Anda belum mendaftar pelatihan apapun</p>
        <Button className="bg-[#3A786D] text-white mt-2" onClick={() => window.location.href = '/pelatihan-publik'}>
          Lihat Pelatihan Tersedia
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Pendaftaran Pelatihan Saya</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registrations.map((registration) => (
          <Card key={registration.id} className={`overflow-hidden ${registration.status_pendaftaran === 'Rejected' ? 'opacity-75' : ''}`}>
            <div className={`p-3 ${
              registration.status_pendaftaran === 'Approved' 
                ? 'bg-green-50 border-b border-green-100' 
                : registration.status_pendaftaran === 'Rejected'
                ? 'bg-red-50 border-b border-red-100'
                : 'bg-yellow-50 border-b border-yellow-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{registration.training?.nama_pelatihan || 'Pelatihan'}</h4>
                {getStatusBadge(registration.status_pendaftaran)}
              </div>
            </div>
            
            <CardContent className="p-4">
              {registration.training && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-700">Waktu</div>
                      <div className="text-gray-600">
                        {formatDateTimeToWIB(new Date(registration.training.waktu_mulai))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-700">Durasi</div>
                      <div className="text-gray-600">
                        {Math.round((new Date(registration.training.waktu_akhir).getTime() - 
                                     new Date(registration.training.waktu_mulai).getTime()) / 
                                     (1000 * 60 * 60))} jam
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                    <div>
                      <div className="font-medium text-gray-700">Lokasi</div>
                      <div className="text-gray-600">{registration.training.lokasi}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {registration.catatan && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-700">Catatan:</p>
                  <p className="text-sm text-gray-600 mt-1">{registration.catatan}</p>
                </div>
              )}
              
              {registration.status_pendaftaran === 'Approved' && 
               registration.training && 
               !isPastTraining(registration.training.waktu_mulai) && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Button 
                    className="w-full bg-[#3A786D] hover:bg-[#2c5d54] mt-2" 
                    onClick={() => window.open(
                      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(registration.training?.nama_pelatihan || 'Pelatihan')}&dates=${new Date(registration.training?.waktu_mulai || '').toISOString().replace(/-|:|\.\d+/g, '')}/${new Date(registration.training?.waktu_akhir || '').toISOString().replace(/-|:|\.\d+/g, '')}&details=${encodeURIComponent(registration.training?.deskripsi || '')}&location=${encodeURIComponent(registration.training?.lokasi || '')}`,
                      '_blank'
                    )}
                  >
                    Tambahkan ke Kalender
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyRegistrations;