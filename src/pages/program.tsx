"use client"

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CardProgram from "@/components/ui/card-program";
import { Database, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, Download, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

const ITEMS_PER_PAGE = 6;

const Program = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPilars, setSelectedPilars] = useState<number[]>([]);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [programList, setProgramList] = useState<Program[]>([]);
    const [submitting, setSubmitting] = useState(false);

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

    useEffect(() => {
        const fetchPrograms = async () => {
            setLoading(true);
            try {
                setTimeout(() => {
                    const mockProgramData: Program[] = Array.from({ length: 20 }, (_, i) => ({
                        id: i+1,
                        nama_program: `Penyediaan Buka Puasa Gratis ${i+1}`,
                        deskripsi_program: `Program buka puasa bersama yang diselenggarakan selama bulan Ramadhan tahun 2025 (Program ${i+1})`,
                        pilar_program: [1, 2, 3],
                        kriteria_program: "Program Berbagi",
                        waktu_mulai: "2025-03-29",
                        waktu_selesai: "2025-06-29",
                        rancangan_anggaran: 35000000 + (i * 1000000),
                        aktualisasi_anggaran: i < 5 ? 5000000 : 0,
                        status_program: i < 15 ? "Berjalan" : "Selesai",
                        masjid_id: i % 3 + 1,
                        created_by: "Admin",
                        created_at: "2025-01-01",
                        updated_at: "2025-01-01"
                    }));
                    
                    setProgramList(mockProgramData);
                    setLoading(false);
                }, 1200);
                
                // const token = localStorage.getItem("token");
                // const response = await fetch(`${API_URL}/api/programs`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //         "Content-Type": "application/json",
                //     },
                // });
                // const data = await response.json();
                // if (data.success) {
                //     setProgramList(data.programs);
                // }
            } catch (error) {
                console.error("Error fetching programs:", error);
                toast.error("Gagal memuat data program");
            } finally {
                setLoading(false);
            }
        };
        
        fetchPrograms();
    }, []);

    const filteredProgram = programList.filter((item) =>
        item.nama_program.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProgram.length / ITEMS_PER_PAGE);
    const displayedProgram = filteredProgram.slice(
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); 
        }
    };
    
    const handleSubmit = async () => {
        if (!newProgram.nama_program) {
            toast.error("Nama program tidak boleh kosong");
            return;
        }
        
        if (!newProgram.waktu_mulai || !newProgram.waktu_selesai) {
            toast.error("Tanggal mulai dan selesai harus diisi");
            return;
        }
        
        setSubmitting(true);
        try {
            // Simulate API request
            setTimeout(() => {
                // Create a new program with current timestamp and ID
                const createdProgram = {
                    ...newProgram,
                    id: programList.length + 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    created_by: "Current User", // get from auth context
                    masjid_id: 1, // get from user's context
                };
                
                // add the new program to the list
                setProgramList([createdProgram, ...programList]);
                
                setIsOpen(false);
                resetForm();
                
                toast.success("Program berhasil ditambahkan");
                setSubmitting(false);
            }, 1000);
            
            // const token = localStorage.getItem("token");
            // const response = await fetch(`${API_URL}/api/programs`, {
            //     method: "POST",
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(newProgram),
            // });
            // const data = await response.json();
            // if (data.success) {
            //     setProgramList([data.program, ...programList]);
            //     setIsOpen(false);
            //     resetForm();
            //     toast.success("Program berhasil ditambahkan");
            // }
        } catch (error) {
            console.error("Error adding program:", error);
            toast.error("Gagal menambahkan program");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProgram = async (programId: number): Promise<boolean> => {
        try {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // update the program list by filtering out the deleted program
                    setProgramList(prevList => prevList.filter(program => program.id !== programId));
                    
                    // if deleting a program that's currently displayed and it's the last one on the page, go to previous page
                    if (displayedProgram.length === 1 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                    }
                    
                    resolve(true); // success
                }, 800);
            });
            
            /*
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/programs/${programId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to delete program");
            }
    
            // Update the program list
            setProgramList(prevList => prevList.filter(program => program.id !== programId));
            
            return true;
            */
        } catch (error) {
            console.error("Error deleting program:", error);
            return false;
        }
    };

    const downloadTemplate = () => {
        const worksheetData = [
            ["nama_program", "deskripsi_program", "pilar_program", "kriteria_program", "tanggal_mulai", "tanggal_selesai", "rancangan_anggaran", "aktualisasi_anggaran", "status_program"], 
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template Publikasi");
        
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Template_Program.xlsx");
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
                    <div className="flex relative max-w-70 md:w-2/5 gap-2 mb-4 md:mb-0">
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
                        <Button variant="outline" onClick={downloadTemplate} ><Download className="w-4 h-4 mr-2" /> Download Template</Button>
                        <Button variant="outline" onClick={handleButtonClick}><Upload className="w-4 h-4 mr-2" /> Upload Data</Button>
                        <Button className="bg-[#3A786D] text-white" onClick={() => setIsOpen(true)}>
                            Tambah Program
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </div>
                ) : displayedProgram.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedProgram.map((program) => (
                            <CardProgram 
                                key={program.id} 
                                program={program} 
                                onClick={() => navigate(`/data-program/${program.id}`)} 
                                onDelete={handleDeleteProgram}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <p className="text-gray-500 mb-2">Tidak ada program yang ditemukan</p>
                        <p className="text-gray-400 text-sm">Silakan coba kata kunci pencarian lain atau tambahkan program baru</p>
                    </div>
                )}

                {!loading && filteredProgram.length > 0 && (
                    <div className="flex justify-center mt-6 space-x-2">
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
                )}

                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                    <DialogContent className="max-w-md md:max-w-2xl md:mt-2 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tambah Program</DialogTitle>
                        <DialogDescription>
                            Lengkapi informasi program berikut untuk menambah program baru.
                        </DialogDescription>
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
                            <Button 
                                className="bg-[#3A786D] text-white hover:bg-[#2a5d54]"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Menyimpan...
                                    </>
                                ) : "Simpan"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default Program;