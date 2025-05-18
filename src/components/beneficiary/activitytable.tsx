import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Loader2, Eye } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import type { Aktivitas } from "@/types/beneficiary";

interface AktivitasTableProps {
  aktivitas: Aktivitas[];
  loading: boolean;
  error: string | null;
  onViewAktivitas: (id: string) => void;
  onRefetch: () => void;
}

export default function AktivitasTable({
  aktivitas,
  loading,
  error,
  onViewAktivitas,
  onRefetch,
}: AktivitasTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <Button onClick={onRefetch} className="bg-[#3A786D] text-white">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (aktivitas.length === 0) {
    return (
      <div className="py-6 text-center border rounded-lg">
        <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
        <p className="text-gray-500">Belum ada aktivitas terkait dengan penerima manfaat ini</p>
      </div>
    );
  }

  return (
    <Table className="border rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Nama Aktivitas</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Lokasi</TableHead>
          <TableHead className="w-[250px]">Deskripsi</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {aktivitas.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.nama}</TableCell>
            <TableCell>{formatDate(item.tanggal)}</TableCell>
            <TableCell>{item.lokasi || "N/A"}</TableCell>
            <TableCell className="max-w-[250px] truncate">
              {item.deskripsi || "N/A"}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewAktivitas(item.id)}
              >
                <Eye className="h-4 w-4 mr-2" /> Lihat
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}