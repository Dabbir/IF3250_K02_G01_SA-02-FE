import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Training } from "@/lib/training";
import { Save, Loader2 } from "lucide-react";

interface TrainingEditFormProps {
  training: Training;
  onSuccess: (updatedTraining: Training) => void;
}

const TrainingEditForm: React.FC<TrainingEditFormProps> = ({ training, onSuccess }) => {
  const [formData, setFormData] = useState<Training>({ ...training });
  const [loading, setLoading] = useState(false);
  const [masjidOptions, setMasjidOptions] = useState<{id: number, nama_masjid: string}[]>([]);
  const API_URL = import.meta.env.VITE_HOST_NAME;
  
  const formatDateForInput = (dateString: string): string => {
    return new Date(dateString).toISOString().slice(0, 16);
  };

  useEffect(() => {
    setFormData({ ...training });
    fetchMasjidOptions();
  }, [training]);

  const fetchMasjidOptions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/masjid`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setMasjidOptions(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching masjid options:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "kuota" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "masjid_id" ? parseInt(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nama_pelatihan) {
      toast.error("Nama pelatihan harus diisi");
      return false;
    }
    if (!formData.waktu_mulai) {
      toast.error("Waktu mulai harus diisi");
      return false;
    }
    if (!formData.waktu_akhir) {
      toast.error("Waktu selesai harus diisi");
      return false;
    }
    if (new Date(formData.waktu_akhir) <= new Date(formData.waktu_mulai)) {
      toast.error("Waktu selesai harus setelah waktu mulai");
      return false;
    }
    if (!formData.lokasi) {
      toast.error("Lokasi harus diisi");
      return false;
    }
    if (!formData.kuota || formData.kuota < 1) {
      toast.error("Kuota harus lebih dari 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formattedData = {
        ...formData,
        waktu_mulai: new Date(formData.waktu_mulai).toISOString().replace('T', ' ').slice(0, 19),
        waktu_akhir: new Date(formData.waktu_akhir).toISOString().replace('T', ' ').slice(0, 19)
      };

      const response = await fetch(`${API_URL}/api/trainings/${training.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();

      if (data.success) {
        const trainingResponse = await fetch(`${API_URL}/api/trainings/${training.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (trainingResponse.ok) {
          const trainingData = await trainingResponse.json();
          if (trainingData.success) {
            onSuccess(trainingData.data);
          }
        } else {
          onSuccess({
            ...formData,
            waktu_mulai: formattedData.waktu_mulai,
            waktu_akhir: formattedData.waktu_akhir
          });
        }
      } else {
        throw new Error(data.message || "Failed to update training");
      }
    } catch (err) {
      console.error("Error updating training:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update training");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nama_pelatihan">Nama Pelatihan <span className="text-red-500">*</span></Label>
          <Input
            id="nama_pelatihan"
            name="nama_pelatihan"
            placeholder="Masukkan nama pelatihan"
            value={formData.nama_pelatihan}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="deskripsi">Deskripsi</Label>
          <Textarea
            id="deskripsi"
            name="deskripsi"
            placeholder="Masukkan deskripsi pelatihan"
            value={formData.deskripsi || ""}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="waktu_mulai">Waktu Mulai <span className="text-red-500">*</span></Label>
            <Input
              id="waktu_mulai"
              name="waktu_mulai"
              type="datetime-local"
              value={formatDateForInput(formData.waktu_mulai)}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="waktu_akhir">Waktu Selesai <span className="text-red-500">*</span></Label>
            <Input
              id="waktu_akhir"
              name="waktu_akhir"
              type="datetime-local"
              value={formatDateForInput(formData.waktu_akhir)}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="lokasi">Lokasi <span className="text-red-500">*</span></Label>
          <Input
            id="lokasi"
            name="lokasi"
            placeholder="Masukkan lokasi pelatihan"
            value={formData.lokasi}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="kuota">Kuota <span className="text-red-500">*</span></Label>
            <Input
              id="kuota"
              name="kuota"
              type="number"
              min="1"
              placeholder="Jumlah peserta"
              value={formData.kuota}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="masjid_id">Masjid <span className="text-red-500">*</span></Label>
          <Select 
            value={formData.masjid_id.toString()} 
            onValueChange={(value) => handleSelectChange("masjid_id", value)}
          >
            <SelectTrigger id="masjid_id">
              <SelectValue placeholder="Pilih masjid" />
            </SelectTrigger>
            <SelectContent>
              {masjidOptions.map((masjid) => (
                <SelectItem key={masjid.id} value={masjid.id.toString()}>
                  {masjid.nama_masjid}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="mt-6 bg-[#3A786D] hover:bg-[#2c5d54] w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Simpan Perubahan
          </>
        )}
      </Button>
    </form>
  );
};

export default TrainingEditForm;