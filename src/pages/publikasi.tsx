"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, Download, Upload, Pencil, Trash2, BookOpen, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Publikasi {
  judul: string;
  media: "Televisi" | "Koran" | "Radio" | "Media Online" | "Sosial Media" | "Lainnya";
  perusahaan: string;
  tanggal: string;
  link: string;
  prValue: number;
}

const formatRupiah = (value: number) => {
  return `Rp ${value.toLocaleString("id-ID")}`;
};

const dataPublikasi: Publikasi[] = Array.from({ length: 100 }, (_, i) => ({
  judul: `Publikasi ${i + 1}`,
  media: "Media Online",
  perusahaan: "MediaCorp",
  tanggal: "20-03-2025",
  link: "example.com",
  prValue: Math.floor(Math.random() * 1000000),
}));

const ITEMS_PER_PAGE = 20;

export default function PublikasiPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const [newPublikasi, setNewPublikasi] = useState<Partial<Publikasi>>({
    judul: "",
    media: "Media Online",
    perusahaan: "",
    link: "",
    prValue: 0,
  });

  const filteredPublikasi = dataPublikasi.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPublikasi.length / ITEMS_PER_PAGE);
  const displayedPublikasi = filteredPublikasi.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "prValue") {
      const numericValue = Number(value.replace(/\D/g, "")) || 0;
      setNewPublikasi({ ...newPublikasi, prValue: numericValue });
    } else {
      setNewPublikasi({ ...newPublikasi, [name]: value });
    }
  };

  return (
    <Card className="mx-auto mt-6 max-w-[70rem] p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Publikasi</h2>
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
            <Button variant="outline" className="flex items-center">
              <ArrowUpDown className="w-4 h-4 mr-2" /> Sort
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Download Template</Button>
            <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Upload Data</Button>
            <Button className="bg-[#3A786D] text-white" onClick={() => setIsOpen(true)}>
              Tambah Publikasi
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Judul Publikasi</TableHead>
                <TableHead>Media Publikasi</TableHead>
                <TableHead>Perusahaan Media</TableHead>
                <TableHead>Tanggal Publikasi</TableHead>
                <TableHead>Link Publikasi</TableHead>
                <TableHead>PR Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedPublikasi.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.judul}</TableCell>
                  <TableCell>{item.media}</TableCell>
                  <TableCell>{item.perusahaan}</TableCell>
                  <TableCell>{item.tanggal}</TableCell>
                  <TableCell>
                    <a href={item.link} target="_blank" className="text-blue-600 underline">
                      {item.link}
                    </a>
                  </TableCell>
                  <TableCell>{formatRupiah(item.prValue)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-blue-600"><Share2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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
              className={`${
                currentPage === i + 1 ? "bg-[#3A786D] text-white" : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Publikasi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input name="judul" placeholder="Judul Publikasi" value={newPublikasi.judul} onChange={handleInputChange} />
              <Select onValueChange={(value: string) => setNewPublikasi({ ...newPublikasi, media: value as Publikasi["media"] })}>
                <SelectTrigger><SelectValue placeholder="Pilih Media Publikasi" /></SelectTrigger>
                <SelectContent>
                  {["Televisi", "Koran", "Radio", "Media Online", "Sosial Media", "Lainnya"].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input name="perusahaan" placeholder="Perusahaan Media" value={newPublikasi.perusahaan} onChange={handleInputChange} />
              <Input name="link" placeholder="Link Publikasi" value={newPublikasi.link} onChange={handleInputChange} />
              <div className="relative">
                <span className="absolute left-3 top-2 text-black text-sm">Rp</span>
                <Input
                  name="prValue"
                  type="text"
                  placeholder="PR Value"
                  value={newPublikasi.prValue ? newPublikasi.prValue.toLocaleString("id-ID") : ""}
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
              <Button className="bg-[#3A786D] text-white">Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}