import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
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
import { TrainingForm } from "@/types/training";

interface AddTrainingProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  masjidNameParam: string;
  masjidId: number;
}

const INITIAL_FORM: TrainingForm = {
  nama_pelatihan: "",
  deskripsi: "",
  waktu_mulai: new Date().toISOString().slice(0, 16),
  waktu_akhir: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
  lokasi: "",
  kuota: 20,
  status: "Upcoming",
  masjid_id: 0 
};

const AddTraining: React.FC<AddTrainingProps> = ({ isOpen, setIsOpen, onSuccess, masjidNameParam, masjidId }) => {
  const [formData, setFormData] = useState<TrainingForm>({...INITIAL_FORM, masjid_id: masjidId});
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_HOST_NAME;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...INITIAL_FORM,
        masjid_id: masjidId
      });
    }
  }, [isOpen, masjidId]);

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
      [name]: value,
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
        waktu_akhir: new Date(formData.waktu_akhir).toISOString().replace('T', ' ').slice(0, 19),
        masjid_id: masjidId 
      };

      const response = await fetch(`${API_URL}/api/trainings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Pelatihan berhasil ditambahkan");
        setIsOpen(false);
        onSuccess();
      } else {
        throw new Error(data.message || "Failed to create training");
      }
    } catch (err) {
      console.error("Error adding training:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add training");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Pelatihan Baru</DialogTitle>
          <DialogDescription>
            Isi formulir berikut untuk menambahkan pelatihan baru.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid gap-4 py-2">
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
                value={formData.deskripsi}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="waktu_mulai">Waktu Mulai <span className="text-red-500">*</span></Label>
                <Input
                  id="waktu_mulai"
                  name="waktu_mulai"
                  type="datetime-local"
                  value={formData.waktu_mulai}
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
                  value={formData.waktu_akhir}
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

            <div className="grid grid-cols-2 gap-4">
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
              <div className="p-3 border rounded-md bg-gray-50">
                <p className='text-sm text-gray-700'>{masjidNameParam || "Loading masjid information..."}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-[#3A786D] hover:bg-[#2c5d54]" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTraining;