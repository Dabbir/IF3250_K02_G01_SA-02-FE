"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Leaf, Pencil, Trash2 } from "lucide-react";
import AddActivityDialog from "@/components/activity/addactivity";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Kegiatan {
  idKegiatan: string;
  namaKegiatan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
  biayaImplementasi: string;
  deskripsi: string;
  dokumentasi: File[];
}

const dataKegiatan: Kegiatan[] = Array.from({ length: 100 }, (_, i) => ({
  idKegiatan: `1`,
  namaKegiatan: `Kegiatan ${i + 1}`,
  tanggalMulai: "20-03-2025",
  tanggalSelesai: "20-03-2025",
  status: "selesai",
  biayaImplementasi: "1000000000000000",
  deskripsi: "",
  dokumentasi: [],
}));

const ITEMS_PER_PAGE = 20;

export default function KegiatanPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Kegiatan | null>(null);
  const navigate = useNavigate();

  const totalPages = Math.ceil(dataKegiatan.length / ITEMS_PER_PAGE);
  const displayedKegiatan = dataKegiatan.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDeleteActivity = (id: string | undefined) => {
    if (!id) return;
    console.log(`Activity deleted: ${id}`);
    setShowDeleteDialog(false);
  };  

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card className="mx-auto mt-6 max-w-[70rem] p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Kegiatan</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4 items-center">
          <div className="flex relative w-2/5 gap-2">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-[#3A786D] text-white" onClick={() => setIsOpen(true)}>
              Tambah Kegiatan
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="pl-7 w-[200px]">Nama Kegiatan</TableHead>
                <TableHead className="w-[120px] text-center">Tanggal Mulai</TableHead>
                <TableHead className="w-[120px] text-center">Tanggal Selesai</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[180px]">Biaya Implementasi</TableHead>
                <TableHead className="w-[100px] text-right pr-9">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {displayedKegiatan.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-b cursor-pointer hover:bg-gray-100 transition"
                >
                  <TableCell className="pl-7 truncate max-w-[180px]">{item.namaKegiatan}</TableCell>
                  <TableCell className="text-center truncate">{item.tanggalMulai}</TableCell>
                  <TableCell className="text-center truncate">{item.tanggalSelesai}</TableCell>
                  <TableCell className="text-center truncate">{item.status}</TableCell>
                  <TableCell className="text-left truncate max-w-[180px]">Rp. {item.biayaImplementasi}</TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-200 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/`);
                        }}
                      >
                        <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-100 transition cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActivity(item);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Hapus Kegiatan</DialogTitle>
                  <DialogDescription>
                    Apakah Anda yakin ingin menghapus kegiatan?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-between sm:justify-between mt-4">
                  <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Batal
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => handleDeleteActivity(selectedActivity?.idKegiatan)}>
                    Hapus
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </Table>
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-[#3A786D] text-white"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`${currentPage === i + 1 ? "bg-[#3A786D] text-white" : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                }`}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-[#3A786D] text-white"
          >
            Next
          </Button>
        </div>
        <AddActivityDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </CardContent>
    </Card>
  );
}