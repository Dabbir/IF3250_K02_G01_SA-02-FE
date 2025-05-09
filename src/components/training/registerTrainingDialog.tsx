import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Training, TrainingAvailability } from "@/lib/training";
import { Loader2 } from "lucide-react";
import { formatDateTimeToWIB } from "@/utils/dateUtils";

interface RegisterTrainingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  training: Training;
  availability: TrainingAvailability;
  onSuccess: () => void;
}

const RegisterTrainingDialog: React.FC<RegisterTrainingDialogProps> = ({
  isOpen,
  onClose,
  training,
  availability,
  onSuccess
}) => {
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_HOST_NAME;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/trainings/${training.id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            catatan: catatan || null
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Pendaftaran pelatihan berhasil");
        onSuccess();
      } else {
        throw new Error(data.message || "Gagal mendaftar pelatihan");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mendaftar pelatihan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Daftar Pelatihan</DialogTitle>
          <DialogDescription>
            Daftar untuk mengikuti pelatihan <strong>{training.nama_pelatihan}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 space-y-3">
          {availability.available_slots <= 0 && (
              <div className="bg-red-100 p-3 rounded-md text-red-700 text-sm">
                <p className="font-medium">Pelatihan ini sudah penuh!</p>
                <p>Mohon maaf, semua kuota telah terisi. Silakan coba pelatihan lain.</p>
              </div>
            )}

            {new Date(training.waktu_mulai) < new Date() && (
              <div className="bg-red-100 p-3 rounded-md text-red-700 text-sm">
                <p className="font-medium">Pelatihan ini sudah berlangsung!</p>
                <p>Mohon maaf, pendaftaran telah ditutup karena pelatihan sudah dimulai.</p>
              </div>
            )}

            {training.status === "Cancelled" && (
              <div className="bg-red-100 p-3 rounded-md text-red-700 text-sm">
                <p className="font-medium">Pelatihan ini telah dibatalkan!</p>
                <p>Mohon maaf, pelatihan ini tidak lagi tersedia.</p>
              </div>
            )}
            
          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="text-base font-semibold text-">Informasi Pelatihan</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li><span className="font-medium">Waktu Mulai</span>: {formatDateTimeToWIB(new Date(training.waktu_mulai))}</li>
              <li><span className="font-medium">Waktu Akhir</span>: {formatDateTimeToWIB(new Date(training.waktu_akhir))}</li>
              <li><span className="font-medium">Lokasi</span>: {training.lokasi}</li>
              <li><span className="font-medium">Kuota tersedia</span>: {availability.available_slots} dari {availability.total_kuota}</li>
              {training.deskripsi && <li className="text-justify"><span className="font-medium">Deskripsi</span>:<br/>{training.deskripsi}</li>}
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid gap-2">
            <Label htmlFor="catatan">Catatan (Opsional)</Label>
            <Textarea
              id="catatan"
              placeholder="Tambahkan catatan atau alasan pendaftaran Anda"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button 
              type="submit" 
              className="bg-[#3A786D]" 
              disabled={
                loading || 
                availability.available_slots <= 0 || 
                new Date(training.waktu_mulai) < new Date() ||
                training.status === "Cancelled"
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                "Daftar Sekarang"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterTrainingDialog;