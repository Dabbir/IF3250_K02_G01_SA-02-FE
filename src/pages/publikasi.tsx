"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Download, Upload, Search, ArrowUpDown } from "lucide-react";

interface Publikasi {
  judul: string;
  tanggal: string;
  link: string;
  perusahaan: string;
  media: string;
}

const dataPublikasi: Publikasi[] = Array.from({ length: 100 }, (_, i) => ({
  judul: `Publikasi ${i + 1}`,
  tanggal: "20-03-2025",
  link: "example.com",
  perusahaan: "MediaCorp",
  media: "Online",
}));

const ITEMS_PER_PAGE = 20;

export default function PublikasiPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPublikasi = dataPublikasi.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPublikasi.length / ITEMS_PER_PAGE);
  const displayedPublikasi = filteredPublikasi.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Publikasi</h2>
      </div>
      
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
          <Button className="bg-[#3A786D] text-white">Tambah Publikasi</Button>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Judul Publikasi</TableHead>
              <TableHead>Tanggal Publikasi</TableHead>
              <TableHead>Link Publikasi</TableHead>
              <TableHead>Perusahaan Media</TableHead>
              <TableHead>Media Publikasi</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedPublikasi.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.judul}</TableCell>
                <TableCell>{item.tanggal}</TableCell>
                <TableCell>
                  <a href={item.link} target="_blank" className="text-blue-600 underline">
                    {item.link}
                  </a>
                </TableCell>
                <TableCell>{item.perusahaan}</TableCell>
                <TableCell>{item.media}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
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
    </div>
  );
}
