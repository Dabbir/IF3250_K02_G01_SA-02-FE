import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_HOST_NAME;

const pilarOptions = [
  "Tanpa Kemiskinan",
  "Tanpa Kelaparan",
  "Kehidupan Sehat dan Sejahtera",
  "Pendidikan Berkualitas",
  "Kesetaraan Gender",
  "Air Bersih dan Sanitasi Layak",
  "Energi Bersih dan Terjangkau",
  "Pekerjaan Layak dan Pertumbuhan Ekonomi",
  "Industri, Inovasi dan Infrastruktur",
  "Berkurangnya Kesenjangan",
  "Kota dan Pemukiman yang Berkelanjutan",
  "Konsumsi dan Produksi yang Bertanggung Jawab",
  "Penanganan Perubahan Iklim",
  "Ekosistem Lautan",
  "Ekosistem Daratan",
  "Perdamaian, Keadilan dan Kelembagaan yang Tangguh",
  "Kemitraan untuk Mencapai Tujuan",
];

type Status = "Belum Mulai" | "Berjalan" | "Selesai";

interface AddProgramDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddProgramDialog({
  isOpen,
  setIsOpen,
  onSuccess,
}: AddProgramDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    nama_program: "",
    deskripsi_program: "",
    pilar_program: [] as string[],
    kriteria_program: "",
    waktu_mulai: "",
    waktu_selesai: "",
    rancangan_anggaran: 0,
    aktualisasi_anggaran: 0,
    status_program: "Belum Mulai" as Status,
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof data, string>>>({});

  const reset = () => {
    setData({
      nama_program: "",
      deskripsi_program: "",
      pilar_program: [],
      kriteria_program: "",
      waktu_mulai: "",
      waktu_selesai: "",
      rancangan_anggaran: 0,
      aktualisasi_anggaran: 0,
      status_program: "Belum Mulai",
    });
    setCoverFile(null);
    setCoverPreview(null);
    setIsSaving(false);
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  useEffect(() => {
    if (!data.waktu_mulai || !data.waktu_selesai) return;
  
    const now   = new Date();
    const start = new Date(data.waktu_mulai);
    const end   = new Date(data.waktu_selesai);
  
    let autoStatus: Status;
    if (start > now) {
      autoStatus = "Belum Mulai";
    } else if (end < now) {
      autoStatus = "Selesai";
    } else {
      autoStatus = "Berjalan";
    }
  
    setData((d) => ({ ...d, status_program: autoStatus }));
  }, [data.waktu_mulai, data.waktu_selesai]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setCoverFile(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setCoverPreview(null);
    }
  };

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    if (!data.nama_program.trim()) newErrors.nama_program = "Nama wajib diisi.";
    if (!data.waktu_mulai) newErrors.waktu_mulai = "Tanggal mulai wajib diisi.";
    if (!data.waktu_selesai) newErrors.waktu_selesai = "Tanggal selesai wajib diisi.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const now = new Date();
    const start = new Date(data.waktu_mulai);
    const end = new Date(data.waktu_selesai);

    if (data.status_program === "Belum Mulai" && start <= now) {
      setErrors({ waktu_mulai: "Mulai harus di masa depan untuk status Belum Mulai." });
      return;
    }

    if (data.status_program === "Berjalan" && (start > now || end < now)) {
      setErrors({ waktu_selesai: "Sekarang harus di antara tanggal mulai dan selesai." });
      return;
    }

    if (data.status_program === "Selesai" && end >= now) {
      setErrors({ waktu_selesai: "Selesai harus di masa lalu untuk status Selesai." });
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();
      form.append("nama_program", data.nama_program);
      form.append("deskripsi_program", data.deskripsi_program);
      form.append("pilar_program", JSON.stringify(data.pilar_program));
      form.append("kriteria_program", data.kriteria_program);
      form.append("waktu_mulai", data.waktu_mulai);
      form.append("waktu_selesai", data.waktu_selesai);
      form.append("rancangan_anggaran", String(data.rancangan_anggaran));
      form.append("aktualisasi_anggaran", String(data.aktualisasi_anggaran));
      form.append("status_program", data.status_program);
      if (coverFile) {
        form.append("cover_image", coverFile);
      }

      const res = await fetch(`${API_URL}/api/program`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) throw new Error("Gagal menyimpan program");
      toast.success("Program berhasil ditambahkan");
      setIsOpen(false);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan program");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Tambah Program</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label>
              Nama Program<span className="text-red-500">*</span>
            </Label>
            <Input
              value={data.nama_program}
              onChange={(e) =>
                setData((d) => ({ ...d, nama_program: e.target.value }))
              }
            />
            {errors.nama_program && (
              <p className="text-red-500 text-sm">{errors.nama_program}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Deskripsi Program</Label>
            <Textarea
              value={data.deskripsi_program}
              onChange={(e) =>
                setData((d) => ({ ...d, deskripsi_program: e.target.value }))
              }
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label>Pilar Program</Label>
            <div className="max-h-48 overflow-y-auto border rounded-md p-3 grid grid-cols-1 gap-1">
              {pilarOptions.map((p) => (
                <label key={p} className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={data.pilar_program.includes(p)}
                    onCheckedChange={(chk) => {
                      setData((d) => {
                        const arr = d.pilar_program;
                        return {
                          ...d,
                          pilar_program: chk
                            ? [...arr, p]
                            : arr.filter((x) => x !== p),
                        };
                      });
                    }}
                  />
                  <span className="text-sm">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Kriteria Program</Label>
            <Input
              value={data.kriteria_program}
              onChange={(e) =>
                setData((d) => ({ ...d, kriteria_program: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>
                Tanggal Mulai<span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={data.waktu_mulai}
                onChange={(e) =>
                  setData((d) => ({ ...d, waktu_mulai: e.target.value }))
                }
              />
              {errors.waktu_mulai && (
              <p className="text-red-500 text-sm">{errors.waktu_mulai}</p>
            )}
            </div>
            <div className="grid gap-2">
              <Label>
                Tanggal Selesai<span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={data.waktu_selesai}
                onChange={(e) =>
                  setData((d) => ({ ...d, waktu_selesai: e.target.value }))
                }
              />
              {errors.waktu_selesai && (
              <p className="text-red-500 text-sm">{errors.waktu_selesai}</p>
            )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Rancangan Anggaran</Label>
              <Input
                type="number"
                value={data.rancangan_anggaran}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    rancangan_anggaran: +e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Aktualisasi Anggaran</Label>
              <Input
                type="number"
                value={data.aktualisasi_anggaran}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    aktualisasi_anggaran: +e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cover_image">Cover Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50">
              <input
                id="cover_image"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              <label
                htmlFor="cover_image"
                className="text-[var(--green)] flex items-center space-x-2 cursor-pointer hover:text-[var(--blue)]"
              >
                <Upload className="h-5 w-5" />
                <span>
                  {coverPreview ? "Ganti Cover" : "Unggah Cover Program"}
                </span>
              </label>
              {coverPreview && (
                <div className="mt-4 relative">
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-48 h-32 object-cover rounded-md"
                  />
                  <button
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(null);
                    }}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Status Program</Label>
            <Select
              value={data.status_program}
              onValueChange={(val) =>
                setData((d) => ({ ...d, status_program: val as Status }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Belum Mulai">Belum Mulai</SelectItem>
                <SelectItem value="Berjalan">Berjalan</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
