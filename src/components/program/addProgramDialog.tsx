import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
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
    setIsSaving(false);
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!data.nama_program || !data.waktu_mulai || !data.waktu_selesai) {
      toast.error("Nama, tanggal mulai, dan tanggal selesai wajib diisi.");
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...data,
        pilar_program: data.pilar_program,
      };
      const res = await fetch(`${API_URL}/api/program`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
            <Label>Nama Program<span className="text-red-500">*</span></Label>
            <Input
              value={data.nama_program}
              onChange={(e) => setData(d => ({ ...d, nama_program: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label>Deskripsi Program</Label>
            <Textarea
              value={data.deskripsi_program}
              onChange={(e) => setData(d => ({ ...d, deskripsi_program: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label>Pilar Program</Label>
            <div className="max-h-48 overflow-y-auto border rounded-md p-3 grid grid-cols-1 gap-1">
              {pilarOptions.map(p => (
                <label key={p} className="inline-flex items-center space-x-2">
                  <Checkbox
                    checked={data.pilar_program.includes(p)}
                    onCheckedChange={(chk) => {
                      setData(d => {
                        const arr = d.pilar_program;
                        return {
                          ...d,
                          pilar_program: chk
                            ? [...arr, p]
                            : arr.filter(x => x !== p),
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
              onChange={(e) => setData(d => ({ ...d, kriteria_program: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Tanggal Mulai<span className="text-red-500">*</span></Label>
              <Input
                type="date"
                value={data.waktu_mulai}
                onChange={(e) => setData(d => ({ ...d, waktu_mulai: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tanggal Selesai<span className="text-red-500">*</span></Label>
              <Input
                type="date"
                value={data.waktu_selesai}
                onChange={(e) => setData(d => ({ ...d, waktu_selesai: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Rancangan Anggaran</Label>
              <Input
                type="number"
                value={data.rancangan_anggaran}
                onChange={(e) => setData(d => ({ ...d, rancangan_anggaran: +e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Aktualisasi Anggaran</Label>
              <Input
                type="number"
                value={data.aktualisasi_anggaran}
                onChange={(e) => setData(d => ({ ...d, aktualisasi_anggaran: +e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Status Program</Label>
            <Select
              value={data.status_program}
              onValueChange={(val) => setData(d => ({ ...d, status_program: val as Status }))}
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
