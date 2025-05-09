import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Pencil, Trash2, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Training } from "@/lib/training";
import { formatDateTimeToWIB } from "@/utils/dateUtils";
import TrainingDeleteDialog from "./trainingDeleteDialog";
import { useState } from "react";

interface TrainingListProps {
  trainings: Training[];
  onDelete: (id: string) => Promise<void>;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  isEmpty: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

const TrainingList: React.FC<TrainingListProps> = ({
  trainings,
  onDelete,
  onPageChange,
  currentPage,
  totalPages,
  isEmpty,
  searchQuery,
  onClearSearch
}) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);

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

  const handleShareToWhatsApp = (training: Training, e: React.MouseEvent) => {
    e.stopPropagation();

    const startDate = new Date(training.waktu_mulai);
    const endDate = new Date(training.waktu_akhir);

    const shareText = `*Detail Pelatihan*\n\n` +
      `*Nama Pelatihan:* ${training.nama_pelatihan}\n` +
      `*Deskripsi:* ${training.deskripsi || 'Tidak ada deskripsi'}\n` +
      `*Lokasi:* ${training.lokasi}\n` +
      `*Waktu Mulai:* ${formatDateTimeToWIB(startDate)}\n` +
      `*Waktu Selesai:* ${formatDateTimeToWIB(endDate)}\n` +
      `*Kuota:* ${training.kuota}\n` +
      `*Status:* ${training.status}\n` +
      `*Masjid:* ${training.nama_masjid || 'Tidak tersedia'}`;

    const encodedText = encodeURIComponent(shareText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  const confirmDelete = (training: Training, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTraining(training);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (selectedTraining) {
      await onDelete(selectedTraining.id);
      setShowDeleteDialog(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-gray-500">Tidak ada data pelatihan</p>
        {searchQuery && (
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSearch}
            >
              Hapus Filter
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainings.map((training) => (
          <Card 
            key={training.id} 
            className="overflow-hidden hover:shadow-md transition cursor-pointer p-0"
            onClick={() => navigate(`/pelatihan/${training.id}`)}
          >
            <div className="w-full p-4 bg-gradient-to-r from-[#3A786D] to-[#4A9B8F] text-white">
              <h3 className="font-semibold truncate text-lg mb-1">
                {training.nama_pelatihan}
              </h3>
              <Badge className={`font-medium ${getStatusColor(training.status)}`}>
                {training.status}
              </Badge>
            </div>
            <CardContent className="px-4">
              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Waktu Mulai</div>
                    <div className="text-sm text-gray-600">{formatDateTimeToWIB(new Date(training.waktu_mulai))}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Waktu Selesai</div>
                    <div className="text-sm text-gray-600">{formatDateTimeToWIB(new Date(training.waktu_akhir))}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Lokasi</div>
                    <div className="text-sm text-gray-600">{training.lokasi}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700">Kuota</div>
                    <div className="text-sm text-gray-600">{training.kuota} peserta</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/pelatihan/${training.id}`);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="ml-1 text-xs">Edit</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-500 hover:text-green-700 hover:bg-green-50 p-1"
                  onClick={(e) => handleShareToWhatsApp(training, e)}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="ml-1 text-xs">Share</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                  onClick={(e) => confirmDelete(training, e)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-1 text-xs">Hapus</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center mt-6 gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => onPageChange(i + 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
            className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
          >
            Next
          </Button>
        </div>
      )}

      <TrainingDeleteDialog 
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        trainingName={selectedTraining?.nama_pelatihan || ""}
      />
    </>
  );
};

export default TrainingList;