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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Participant } from "@/lib/training";
import { Loader2 } from "lucide-react";

interface ParticipantUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Participant;
  trainingId: string;
  onSuccess: () => void;
}

type StatusType = "Pending" | "Approved" | "Rejected" | "Attended";

const ParticipantUpdateDialog: React.FC<ParticipantUpdateDialogProps> = ({
  isOpen,
  onClose,
  participant,
  trainingId,
  onSuccess
}) => {
  const [status, setStatus] = useState<StatusType>(participant.status_pendaftaran as StatusType);
  const [catatan, setCatatan] = useState(participant.catatan || "");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_HOST_NAME;

  const handleStatusChange = (value: string) => {
    setStatus(value as StatusType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_URL}/api/trainings/${trainingId}/participants/${participant.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            status,
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
        onSuccess();
      } else {
        throw new Error(data.message || "Failed to update participant status");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update participant status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Status Peserta</DialogTitle>
          <DialogDescription>
            Perbarui status dan catatan untuk peserta <strong>{participant.nama_peserta}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Attended">Attended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                placeholder="Tambahkan catatan (opsional)"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" className="bg-[#3A786D]" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                "Perbarui Status"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ParticipantUpdateDialog;