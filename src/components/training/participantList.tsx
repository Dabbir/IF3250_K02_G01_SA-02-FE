import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Mail, Phone, Check, X, Clock, Download } from "lucide-react";
import { toast } from "react-toastify";
import { Participant } from "@/lib/training";
import { formatDate } from "@/utils/dateUtils";
import ParticipantUpdateDialog from "./participantUpdateDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ParticipantListProps {
  trainingId: string;
}

const ITEMS_PER_PAGE = 10;
const API_URL = import.meta.env.VITE_HOST_NAME;

const ParticipantList: React.FC<ParticipantListProps> = ({ trainingId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, [trainingId, currentPage, statusFilter, search]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const url = new URL(`${API_URL}/api/trainings/${trainingId}/participants`);
      url.searchParams.append("page", currentPage.toString());
      url.searchParams.append("limit", ITEMS_PER_PAGE.toString());
      
      if (statusFilter) {
        url.searchParams.append("status", statusFilter);
      }
      
      // Note: The backend might not support search for participants directly,
      // but we'll prepare the UI for it anyway
      if (search) {
        url.searchParams.append("search", search);
      }

      const response = await fetch(url.toString(), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch participants: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setParticipants(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        throw new Error(data.message || "Failed to fetch participants");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Gagal memuat data peserta");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateParticipantStatus = async (
    participantId: string,
    newStatus: string,
    catatan?: string
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/trainings/${trainingId}/participants/${participantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            status: newStatus,
            catatan: catatan || null
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update participant status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Status peserta berhasil diperbarui");
        fetchParticipants(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to update participant status");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update participant status");
    }
  };

  const openUpdateDialog = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsUpdateDialogOpen(true);
  };

  const exportParticipantsToExcel = () => {
    if (participants.length === 0) {
      toast.info("Tidak ada data peserta untuk diekspor");
      return;
    }

    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.json_to_sheet(participants.map(participant => ({
        "Nama Peserta": participant.nama_peserta || "",
        "Email": participant.email || "",
        "No. Telepon": participant.no_telepon || "",
        "Status": participant.status_pendaftaran,
        "Catatan": participant.catatan || "",
        "Tanggal Pendaftaran": participant.created_at ? formatDate(new Date(participant.created_at)) : ""
      })));

      // Set column widths
      const columnWidths = [
        { wch: 30 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 15 }, // Status
        { wch: 40 }, // Notes
        { wch: 20 }, // Registration date
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Peserta Pelatihan");
      XLSX.writeFile(workbook, "Daftar_Peserta_Pelatihan.xlsx");
    }).catch(err => {
      console.error("Error exporting data:", err);
      toast.error("Gagal mengekspor data");
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case "Attended":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Attended</Badge>;
      case "Pending":
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    }
  };

  if (loading && participants.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  if (error && participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchParticipants} className="bg-[#3A786D] text-white">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-grow w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari nama atau email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Attended">Attended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="bg-[#3A786D] text-white w-full md:w-auto flex items-center gap-1"
          onClick={exportParticipantsToExcel}
        >
          <Download className="h-4 w-4" />
          Unduh Data Peserta
        </Button>
      </div>

      {participants.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">Tidak ada data peserta pelatihan</p>
          {(search || statusFilter !== "") && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                }}
              >
                Hapus Filter
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[250px]">Nama Peserta</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[150px]">Tanggal Daftar</TableHead>
                  <TableHead className="text-right w-[120px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">
                      {participant.nama_peserta || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {participant.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                            <span>{participant.email}</span>
                          </div>
                        )}
                        {participant.no_telepon && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-2 text-gray-500" />
                            <span>{participant.no_telepon}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(participant.status_pendaftaran)}</TableCell>
                    <TableCell>
                      {participant.created_at ? formatDate(new Date(participant.created_at)) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-1 justify-end">
                        {participant.status_pendaftaran === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-green-600"
                              onClick={() => handleUpdateParticipantStatus(participant.id, "Approved")}
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-red-600"
                              onClick={() => handleUpdateParticipantStatus(participant.id, "Rejected")}
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => openUpdateDialog(participant)}
                          title="Update Status"
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-4 gap-2">
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
        </>
      )}

      {selectedParticipant && (
        <ParticipantUpdateDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => setIsUpdateDialogOpen(false)}
          participant={selectedParticipant}
          trainingId={trainingId}
          onSuccess={() => {
            setIsUpdateDialogOpen(false);
            fetchParticipants();
          }}
        />
      )}
    </div>
  );
};

export default ParticipantList;