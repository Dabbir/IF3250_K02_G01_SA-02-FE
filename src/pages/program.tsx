"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CardProgram from "@/components/ui/card-program";
import { Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, Download, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Program {
    id: number;
    nama_program: string;
    deskripsi_program: string;
    pilar_program: number[];
    kriteria_program: string;
    waktu_mulai: string;
    waktu_selesai: string;
    rancangan_anggaran: number;
    aktualisasi_anggaran: number;
    status_program: "Berjalan" | "Selesai";
    masjid_id: number;
    created_by: string;
    created_at: string;
    updated_at: string;
}

const pilarOptions = [
    { id: 1, name: "Tanpa Kemiskinan" },
    { id: 2, name: "Tanpa Kelaparan" },
    { id: 3, name: "Kehidupan Sehat dan Sejahtera" },
    { id: 4, name: "Pendidikan Berkualitas" },
    { id: 5, name: "Kesetaraan Gender" },
    { id: 6, name: "Air Bersih dan Sanitasi Layak" },
    { id: 7, name: "Energi Bersih dan Terjangkau" },
    { id: 8, name: "Pekerjaan Layak dan Pertumbuhan Ekonomi" },
    { id: 9, name: "Industri, Inovasi dan Infrastruktur" },
    { id: 10, name: "Berkurangnya Kesenjangan" },
    { id: 11, name: "Kota dan Pemukiman yang Berkelanjutan" },
    { id: 12, name: "Konsumsi dan Produksi yang Bertanggung Jawab" },
    { id: 13, name: "Penanganan Perubahan Iklim" },
    { id: 14, name: "Ekosistem Lautan" },
    { id: 15, name: "Ekosistem Daratan" },
    { id: 16, name: "Perdamaian, Keadilan dan Kelembagaan yang Tangguh" },
    { id: 17, name: "Kemitraan untuk Mencapai Tujuan" },
];

const dataProgram: Program[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    nama_program: 'Penyediaan Buka Puasa Gratis',
    deskripsi_program: 'Program buka puasa bersama yang diselenggarakan selama bulan Ramadhan tahun 2025',
    pilar_program: [1, 2, 3],
    kriteria_program: "Program Berbagi",
    waktu_mulai: "2025-03-29",
    waktu_selesai: "2025-06-29",
    rancangan_anggaran: 35000000,
    aktualisasi_anggaran: 0,
    status_program: "Berjalan",
    masjid_id: i,
    created_by: "2024-09-09",
    created_at: "2025-01-01",
    updated_at: "2025-01-01"
}));

const ITEMS_PER_PAGE = 6;

const Program = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPilars, setSelectedPilars] = useState<number[]>([]);

    const [newProgram, setNewProgram] = useState<Program>({
        id: 0,
        nama_program: "",
        deskripsi_program: "",
        pilar_program: [],
        kriteria_program: "",
        waktu_mulai: "",
        waktu_selesai: "",
        rancangan_anggaran: 0,
        aktualisasi_anggaran: 0,
        status_program: "Berjalan",
        masjid_id: 0,
        created_by: "",
        created_at:"",
        updated_at: ""
    });

    const fileteredProgram = dataProgram.filter((item) =>
        item.nama_program.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(fileteredProgram.length / ITEMS_PER_PAGE);
    const displayedProgram = fileteredProgram.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === "rancangan_anggaran") {
            setNewProgram({ ...newProgram, [name]: Number(value) });
        } else {
            setNewProgram({ ...newProgram, [name]: value });
        }
    };
    
    const handleSelectChange = (name: string, value: string) => {
        setNewProgram({ ...newProgram, [name]: value });
    };
    
    const handlePilarChange = (pilarId: number, checked: boolean) => {
        if (checked) {
            setSelectedPilars([...selectedPilars, pilarId]);
            setNewProgram({
                ...newProgram,
                pilar_program: [...newProgram.pilar_program, pilarId]
            });
        } else {
            setSelectedPilars(selectedPilars.filter(id => id !== pilarId));
            setNewProgram({
                ...newProgram,
                pilar_program: newProgram.pilar_program.filter(id => id !== pilarId)
            });
        }
    };

    const resetForm = () => {
        setNewProgram({
            id: 0,
            nama_program: "",
            deskripsi_program: "",
            pilar_program: [],
            kriteria_program: "",
            waktu_mulai: "",
            waktu_selesai: "",
            rancangan_anggaran: 0,
            aktualisasi_anggaran: 0,
            status_program: "Berjalan",
            masjid_id: 0,
            created_by: "",
            created_at:"",
            updated_at: ""
        });
        setSelectedPilars([]);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm();
        }
        setIsOpen(open);
    };

    return (
        <Card className="mx-auto mt-6 max-w-[70rem] p-6">
            <CardHeader>
            <div className="flex items-center space-x-2">
                <Database className="h-6 w-6 text-slate-700" />
                <h2 className="text-xl font-medium text-[var(--blue)]">Program</h2>
            </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-4 items-center">
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
                        Tambah Program
                    </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedProgram.map((program) => (
                        <CardProgram key={program.id} program={program} />
                    ))}
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

                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <DialogContent className="max-w-md md:max-w-2xl md:mt-2 max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tambah Program</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nama_program">Nama Program</Label>
                                <Input 
                                    id="nama_program"
                                    name="nama_program" 
                                    placeholder="Nama Program" 
                                    value={newProgram.nama_program} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="deskripsi_program">Deskripsi Program</Label>
                                <Textarea 
                                    id="deskripsi_program"
                                    name="deskripsi_program" 
                                    placeholder="Deskripsi Program" 
                                    value={newProgram.deskripsi_program} 
                                    onChange={handleInputChange}
                                    className="min-h-[100px]" 
                                />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label>Pilar Program</Label>
                                <div className="max-h-48 overflow-y-auto border rounded-md p-3">
                                    <div className="grid grid-cols-1 gap-2">
                                        {pilarOptions.map((pilar) => (
                                            <div key={pilar.id} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={`pilar-${pilar.id}`} 
                                                    checked={selectedPilars.includes(pilar.id)}
                                                    onCheckedChange={(checked) => 
                                                        handlePilarChange(pilar.id, checked as boolean)
                                                    }
                                                />
                                                <Label 
                                                    htmlFor={`pilar-${pilar.id}`}
                                                    className="text-sm font-normal"
                                                >
                                                    {pilar.name}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="waktu_mulai">Tanggal Mulai</Label>
                                    <Input 
                                        id="waktu_mulai"
                                        name="waktu_mulai" 
                                        type="date" 
                                        value={newProgram.waktu_mulai} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="waktu_selesai">Tanggal Selesai</Label>
                                    <Input 
                                        id="waktu_selesai"
                                        name="waktu_selesai" 
                                        type="date" 
                                        value={newProgram.waktu_selesai} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="kriteria_program">Kriteria Program</Label>
                                <Input 
                                    id="kriteria_program"
                                    name="kriteria_program" 
                                    placeholder="Kriteria Program" 
                                    value={newProgram.kriteria_program} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="rancangan_anggaran">Rancangan Anggaran</Label>
                                    <Input 
                                        id="rancangan_anggaran"
                                        name="rancangan_anggaran" 
                                        type="number" 
                                        placeholder="Rancangan Anggaran" 
                                        value={newProgram.rancangan_anggaran || ''} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status_program">Status Program</Label>
                                    <Select 
                                        value={newProgram.status_program} 
                                        onValueChange={(value) => handleSelectChange("status_program", value)}
                                    >
                                        <SelectTrigger id="status_program">
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Berjalan">Berjalan</SelectItem>
                                            <SelectItem value="Selesai">Selesai</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => handleOpenChange(false)}>Batal</Button>
                            <Button className="bg-[#3A786D] text-white hover:bg-[#2a5d54]">Simpan</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}

export default Program;