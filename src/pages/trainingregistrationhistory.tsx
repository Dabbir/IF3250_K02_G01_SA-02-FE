import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface Registration {
  id: string;
  pelatihan_id: string;
  status_pendaftaran: "Pending" | "Approved" | "Rejected" | "Attended";
  catatan?: string;
  created_at?: string;
  nama_pelatihan: string;
  waktu_mulai: string;
  waktu_akhir: string;
  lokasi: string;
  pelatihan_status: string;
  nama_masjid: string;
  masjid_id: string;
}

const API_URL = import.meta.env.VITE_HOST_NAME;

const TrainingRegistrationTable = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRegistrations();
  }, []);
  
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredRegistrations(registrations);
    } else {
      const filtered = registrations.filter(registration => 
        registration.nama_pelatihan.toLowerCase().includes(search.toLowerCase()) ||
        registration.nama_masjid.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredRegistrations(filtered);
    }
  }, [search, registrations]);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/trainings/user/registrations`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch registrations: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRegistrations(data.data || []);
        setFilteredRegistrations(data.data || []);
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

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
            <ArrowLeft 
                className="h-6 w-6 text-slate-700 hover:cursor-pointer" 
                onClick={() => { navigate(`/pelatihan-umum`); }}
            />
            <h2 className="text-xl font-medium text-[var(--blue)]">Riwayat Pendaftaran Pelatihan</h2>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 md:items-center">
          <div className="relative flex-grow items-top w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari pelatihan atau masjid..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 max-md:h-8 max-md:text-[12px]"
            />
          </div>
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-gray-500 mb-2">Anda belum mendaftar pelatihan apapun</p>
            <Button className="bg-[#3A786D] text-white mt-2" onClick={() => navigate('/pelatihan-umum')}>
              Lihat Pelatihan Tersedia
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[25%]">Nama Pelatihan</TableHead>
                  <TableHead className="w-[20%]">Penyelenggara</TableHead>
                  <TableHead className="w-[20%]">Tanggal Daftar</TableHead>
                  <TableHead className="w-[20%]">Tanggal Mulai</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow 
                    key={registration.id}
                    className={registration.status_pendaftaran === 'Rejected' ? 'opacity-60 bg-gray-50' : ''}
                  >
                    <TableCell className="font-medium">
                      {registration.nama_pelatihan.length > 35 ? `${registration.nama_pelatihan.substring(0, 35)}...`: registration.nama_pelatihan}
                      <div className="text-xs text-gray-500 md:hidden">
                        {registration.nama_masjid}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{registration.nama_masjid}</TableCell>
                    <TableCell>{registration.created_at ? formatDate(new Date(registration.created_at)) : "-"}</TableCell>
                    <TableCell>{registration.waktu_mulai ? formatDate(new Date(registration.waktu_mulai)) : "-"}</TableCell>
                    <TableCell>{getStatusBadge(registration.status_pendaftaran)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingRegistrationTable;