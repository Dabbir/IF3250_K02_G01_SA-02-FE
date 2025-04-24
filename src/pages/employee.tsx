"use client"

import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmployeeCard from "@/components/karyawan/employeecard";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Users, Upload, Download, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface Employee {
    id: string;
    nama: string;
    telepon: string;
    alamat: string;
    email: string;
    foto: string;
    masjid_id: string;
    masjid_nama?:string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

interface Masjid {
    id: number;
    nama_masjid: string;
}

const employees: Employee[] = [
    {
        id: "1",
        nama: "Ahmad Fauzi",
        telepon: "081234567890",
        alamat: "Jl. Melati No. 10, Bandung",
        email: "ahmad.fauzi@example.com",
        foto: "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        masjid_id: "1",
        masjid_nama: "Masjid Salman",
        created_by: "1",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-10T10:30:00Z"
    },
    {
        id: "2",
        nama: "Siti Rahmawati",
        telepon: "089876543210",
        alamat: "Jl. Kenanga No. 5, Jakarta",
        email: "siti.rahma@example.com",
        foto: "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        masjid_id: "1",
        masjid_nama: "Masjid Salman",
        created_by: "1",
        created_at: "2024-02-15T09:15:00Z",
        updated_at: "2024-02-20T11:45:00Z"
    },
    {
        id: "3",
        nama: "Budi Santoso",
        telepon: "082112345678",
        alamat: "Jl. Cendana No. 3, Surabaya",
        email: "budi.santoso@example.com",
        foto: "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        masjid_id: "1",
        masjid_nama: "Masjid Salman",
        created_by: "1",
        created_at: "2024-03-01T07:45:00Z",
        updated_at: "2024-03-05T08:20:00Z"
    },
    {
        id: "4",
        nama: "Ahmad Fauzi",
        telepon: "081234567890",
        alamat: "Jl. Melati No. 10, Bandung",
        email: "ahmad.fauzi@example.com",
        foto: "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        masjid_id: "1",
        masjid_nama: "Masjid Salman",
        created_by: "1",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-10T10:30:00Z"
    },
    {
        id: "5",
        nama: "Siti Rahmawati",
        telepon: "089876543210",
        alamat: "Jl. Kenanga No. 5, Jakarta",
        email: "siti.rahma@example.com",
        foto: "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        masjid_id: "1",
        masjid_nama: "Masjid Salman",
        created_by: "1",
        created_at: "2024-02-15T09:15:00Z",
        updated_at: "2024-02-20T11:45:00Z"
    },
    {
        id: "6",
        nama: "Budi Santoso",
        telepon: "082112345678",
        alamat: "Jl. Cendana No. 3, Surabaya",
        email: "budi.santoso@example.com",
        foto: "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        masjid_id: "1",
        masjid_nama: "Masjid Salman",
        created_by: "1",
        created_at: "2024-03-01T07:45:00Z",
        updated_at: "2024-03-05T08:20:00Z"
    },
    {
        id: "7",
        nama: "Ahmad Fauzi",
        telepon: "081234567890",
        alamat: "Jl. Melati No. 10, Bandung",
        email: "ahmad.fauzi@example.com",
        foto: "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        masjid_id: "1",
        masjid_nama: "Masjid Salman",
        created_by: "1",
        created_at: "2024-01-01T08:00:00Z",
        updated_at: "2024-01-10T10:30:00Z"
    },
    {
        id: "8",
        nama: "Siti Rahmawati",
        telepon: "089876543210",
        alamat: "Jl. Kenanga No. 5, Jakarta",
        email: "siti.rahma@example.com",
        foto: "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        masjid_id: "1",
        masjid_nama: "Masjid Salman",
        created_by: "1",
        created_at: "2024-02-15T09:15:00Z",
        updated_at: "2024-02-20T11:45:00Z"
    },
    {
        id: "9",
        nama: "Budi Santoso",
        telepon: "082112345678",
        alamat: "Jl. Cendana No. 3, Surabaya",
        email: "budi.santoso@example.com",
        foto: "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        masjid_id: "1",
        masjid_nama: "Masjid Salman",
        created_by: "1",
        created_at: "2024-03-01T07:45:00Z",
        updated_at: "2024-03-05T08:20:00Z"
    }
]

const ITEMS_PER_PAGE = 9;

const masjidList = [
    { id: 1, nama_masjid: "Masjid Al-Hikmah" },
    { id: 2, nama_masjid: "Masjid Salman" },
    { id: 3, nama_masjid: "Masjid Al-Ikhlas" }
];

const Employee = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [employeeList, setEmployeeList] = useState<Employee[]>(employees);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
        nama: "",
        telepon: "",
        alamat: "",
        email: "",
        foto: "",
        masjid_id: ""
    });

    const filteredEmployees = employeeList.filter(employee => 
        employee.nama.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);

    const displayedEmployees = filteredEmployees.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setNewEmployee(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSelectChange = (name: string, value: string) => {
        setNewEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const maxSize = 2 * 1024 * 1024;
          if (file.size > maxSize) {
            toast.error("Ukuran foto tidak boleh lebih dari 2MB");
            return;
          }
          setSelectedFile(file);
        }
    };
    
    const resetForm = () => {
        setNewEmployee({
          nama: "",
          telepon: "",
          alamat: "",
          email: "",
          foto: "",
          masjid_id: ""
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
          resetForm();
          setIsEditMode(false);
        }
        setIsOpen(open);
    };

    const handleEdit = (employee: Employee) => {
        setNewEmployee({
          id: employee.id,
          nama: employee.nama,
          email: employee.email,
          telepon: employee.telepon,
          alamat: employee.alamat,
          masjid_id: employee.masjid_id,
          foto: employee.foto
        });
        setIsEditMode(true);
        setIsOpen(true);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
          return;
        }
    
        setLoading(true);

        setTimeout(() => {
          setEmployeeList(prev => prev.filter(emp => emp.id !== id));
          toast.success("Karyawan berhasil dihapus");
          setLoading(false);
        }, 500);
    };

    const handleSubmit = () => {
        if (!newEmployee.nama || !newEmployee.email || !newEmployee.telepon) {
            toast.error("Nama, email, dan telepon wajib diisi");
            return;
        }

        if (newEmployee.telepon && !/^\d+$/.test(newEmployee.telepon)) {
            toast.error("Telepon harus berupa angka");
            return;
        }
    
        if (newEmployee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmployee.email)) {
            toast.error("Format email tidak valid");
            return;
        }
    
        setSubmitting(true);
        
        try {
          setTimeout(() => {
            const selectedMasjid = masjidList.find(m => m.id.toString() === newEmployee.masjid_id);
            
            if (isEditMode && newEmployee.id) {
              setEmployeeList(prev => 
                prev.map(emp => 
                  emp.id === newEmployee.id 
                    ? {
                        ...emp,
                        nama: newEmployee.nama || emp.nama,
                        email: newEmployee.email || emp.email,
                        telepon: newEmployee.telepon || emp.telepon,
                        alamat: newEmployee.alamat || emp.alamat,
                        masjid_id: newEmployee.masjid_id || emp.masjid_id,
                        masjid_nama: selectedMasjid?.nama_masjid || emp.masjid_nama,
                        foto: selectedFile ? URL.createObjectURL(selectedFile) : emp.foto,
                        updated_at: new Date().toISOString()
                      }
                    : emp
                )
              );
              toast.success("Karyawan berhasil diperbarui");
            } else {
              const newId = (Math.max(...employeeList.map(e => parseInt(e.id))) + 1).toString();
              
              setEmployeeList(prev => [
                ...prev,
                {
                  id: newId,
                  nama: newEmployee.nama || "",
                  email: newEmployee.email || "",
                  telepon: newEmployee.telepon || "",
                  alamat: newEmployee.alamat || "",
                  masjid_id: newEmployee.masjid_id || "1",
                  masjid_nama: selectedMasjid?.nama_masjid || "Masjid Al-Hikmah",
                  foto: selectedFile ? URL.createObjectURL(selectedFile) : "https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  created_by: "1",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              ]);
              toast.success("Karyawan berhasil ditambahkan");
            }
            
            setIsOpen(false);
            resetForm();
            setSubmitting(false);
          }, 500);
        } catch (error) {
          console.error("Error saving employee:", error);
          toast.error("Gagal menyimpan data karyawan");
          setSubmitting(false);
        }
    };

    return (
        <Card className="mx-auto mt-6 max-w-[70rem] p-6">
            <CardHeader>
                <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-slate-700" />
                <h2 className="text-xl font-medium text-[var(--blue)]">Karyawan</h2>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-4 items-center gap-4">
                    <div className="flex relative w-full md:w-2/5 gap-2">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Cari karyawan..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button className="bg-[#3A786D] text-white" onClick={() => setIsOpen(true)}>
                        Tambah Karyawan
                        </Button>
                    </div>
                </div>
    
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </div>
                ) : displayedEmployees.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedEmployees.map((employee) => (
                        <div 
                            key={employee.id} 
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow max-w-full overflow-hidden cursor-pointer"
                        >
                            <EmployeeCard 
                                employee={employee}
                                onClick={() => navigate(`/karyawan/${employee.id}`)}
                                onEdit={() => handleEdit(employee)}
                                onDelete={() => handleDelete(employee.id)}
                            />
                        </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <p className="text-gray-500 mb-2">Tidak ada karyawan yang ditemukan</p>
                        <p className="text-gray-400 text-sm">Silakan tambahkan karyawan baru atau ubah filter pencarian</p>
                    </div>
                )}
    
                {!loading && totalPages > 0 && (
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
                    <DialogContent className="max-w-md md:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{isEditMode ? "Edit Karyawan" : "Tambah Karyawan"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama<span className="text-red-500 ml-0.5">*</span></Label>
                                <Input 
                                id="nama"
                                name="nama" 
                                placeholder="Nama Karyawan" 
                                value={newEmployee.nama || ""} 
                                onChange={handleInputChange} 
                                />
                            </div>
                    
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Input 
                                        id="email"
                                        name="email" 
                                        type="email"
                                        placeholder="Email" 
                                        value={newEmployee.email || ""} 
                                        onChange={handleInputChange}
                                    />
                                </div>
                        
                                <div className="grid gap-2">
                                    <Label htmlFor="telepon">Telepon<span className="text-red-500 ml-0.5">*</span></Label>
                                    <Input 
                                        id="telepon"
                                        name="telepon" 
                                        placeholder="Telepon" 
                                        value={newEmployee.telepon || ""} 
                                        onChange={handleInputChange}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                    />
                                </div>
                            </div>
                    
                            <div className="grid gap-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea 
                                    id="alamat"
                                    name="alamat" 
                                    placeholder="Alamat" 
                                    rows={3}
                                    value={newEmployee.alamat || ""} 
                                    onChange={handleInputChange}
                                />
                            </div>
        
                            <div className="grid gap-2">
                                <Label htmlFor="masjid_id">Masjid<span className="text-red-500 ml-0.5">*</span></Label>
                                <select 
                                    id="masjid_id"
                                    name="masjid_id" 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newEmployee.masjid_id || ""}
                                    onChange={(e) => handleSelectChange("masjid_id", e.target.value)}
                                >
                                    <option value="">Pilih Masjid</option>
                                    {masjidList.map((masjid) => (
                                        <option key={masjid.id} value={masjid.id}>
                                        {masjid.nama_masjid}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="foto">Foto Profil</Label>
                                    <Input 
                                        id="foto"
                                        name="foto" 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                />

                                {selectedFile && (
                                <p className="text-sm text-green-600">
                                    File dipilih: {selectedFile.name}
                                </p>
                                )}

                                {newEmployee.foto && !selectedFile && (
                                    <div className="flex items-center gap-2">
                                        <img 
                                            src={newEmployee.foto}
                                            alt="Current profile"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <p className="text-sm text-gray-600">Foto profil saat ini</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsOpen(false)}
                                disabled={submitting}
                            >
                                Batal
                            </Button>
                            <Button 
                                className="bg-[#3A786D] text-white"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                                    {isEditMode ? "Memperbarui..." : "Menyimpan..."}
                                </>
                                ) : (
                                isEditMode ? "Perbarui" : "Simpan"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
      );


    // return (
    //     <Card className="mx-auto mt-6 max-w-[70rem] md:p-6">
    //         <CardHeader>
    //             <div className="flex items-center space-x-2">
    //                 <Users className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
    //                 <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Kegiatan</h2>
    //             </div>
    //         </CardHeader>
    //         <CardContent>
    //             <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 md:items-center">
    //                 <div className="flex flex-col md:flex-row w-full md:w-2/3 gap-2">
    //                     <div className="relative flex-grow items-top">
    //                     <Search className="absolute left-3 top-2.5 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
    //                     <Input
    //                         type="text"
    //                         placeholder="Search"
    //                         value={search}
    //                         onChange={(e) => setSearch(e.target.value)}
    //                         className="pl-10 max-md:h-8 max-md:text-[12px]"
    //                     />
    //                     </div>
    //                 </div>

    //                 <div className="flex items-center gap-2">
    //                     <Button className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto" onClick={() => setIsOpen(true)}>
    //                     Tambah Karyawan
    //                     </Button>
    //                 </div>

    //                 {filteredEmployees.length === 0 ? (
    //                     <div className="text-center py-8 border rounded-lg">
    //                         <p className="text-gray-500">No activities found</p>
    //                     </div>
    //                 ) : isMobileView ? (
    //                     <div></div>
    //                 ) : (

    //                 )}
    //             </div>
    //         </CardContent>
    //     </Card>
        
    // )
}

export default Employee;