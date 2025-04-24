"use client"

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmployeeCard from "@/components/karyawan/employeecard";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Users, Loader2 } from "lucide-react";
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

interface userData {
    id: number;
    masjid_id: number;
}

const ITEMS_PER_PAGE = 9;

const Employee = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [masjidName, setMasjidName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<userData>({
        id: 0,
        masjid_id: 0,
    });

    const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
        nama: "",
        telepon: "",
        alamat: "",
        email: "",
        foto: ""
    });

    useEffect(() => {
        const loadInitialData = async () => {
          await fetchUser();
          if (search.trim().length > 0) {
            await fetchEmployees();
          } else {
            await fetchPaginatedEmployees(currentPage);
          }
        };
        
        loadInitialData();
    }, []);

    useEffect(() => {
        if (user.masjid_id) {
          fetchMasjidDetails();
        }
    }, [user.masjid_id]);

    useEffect(() => {
        if (search.trim().length > 0) {
          fetchEmployees();
        } else {
          fetchPaginatedEmployees(currentPage);
        }
    }, [currentPage, search, masjidName]);

    useEffect(() => {
        if (search.trim().length > 0) {
            fetchEmployees();
        } else {
            fetchPaginatedEmployees(currentPage);
        }
    }, [currentPage, search]);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Gagal memuat data pengguna");
            const { id, masjid_id } = data.user;
            setUser({ id, masjid_id });
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Gagal memuat data pengguna");
        }
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/employee`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (user.masjid_id) {
                try {
                    const masjidResponse = await fetch(`${API_URL}/api/masjid/${user.masjid_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    
                    if (masjidResponse.ok) {
                        const masjidData = await masjidResponse.json();

                        if (masjidData.success && masjidData.data) {
                            const masjid_nama = masjidData.data.nama_masjid;
                            setMasjidName(masjid_nama);
                            console.log("nama masjid: ", masjidName);
                        }
                        
                    }
                } catch (error) {
                    console.error("Error fetching masjid details:", error);
                }
            }

            const data = await response.json();

            const updatedEmployees = data.map((employee: Employee) => ({
                ...employee,
                masjid_nama: masjidName
            }));
    
            console.log("respons fetch employee", data);
            setEmployeeList(updatedEmployees);
            setTotalEmployees(data.length || 0);
        } catch (error) {
            console.error("Error fetching all employees:", error);
            toast.error("Gagal memuat semua karyawan");
        } finally {
            setLoading(false);
        }
    }

    const fetchPaginatedEmployees = async (page: number) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/employee/paginated?page=${page}&limit=${ITEMS_PER_PAGE}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            
            console.log("fetch data data", data.data)

            if (user.masjid_id) {
                try {
                    const masjidResponse = await fetch(`${API_URL}/api/masjid/${user.masjid_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    
                    if (masjidResponse.ok) {
                        const masjidData = await masjidResponse.json();

                        if (masjidData.success && masjidData.data) {
                            const masjid_nama = masjidData.data.nama_masjid;
                            setMasjidName(masjid_nama);
                            console.log("nama masjid: ", masjidName);
                        }
                        
                    }
                } catch (error) {
                    console.error("Error fetching masjid details:", error);
                }
            }

            console.log("fetch data total", data.total)
            setEmployeeList(data.data || []);
            setTotalEmployees(data.total || 0);
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error("Gagal memuat data karyawan");
        } finally {
            setLoading(false);
        }
    };

    const fetchMasjidDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const masjidResponse = await fetch(`${API_URL}/api/masjid/${user.masjid_id}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            });
          
            if (masjidResponse.ok) {
                const masjidData = await masjidResponse.json();
                if (masjidData.success && masjidData.data) {
                setMasjidName(masjidData.data.nama_masjid);
                }
            }
        } catch (error) {
          console.error("Error fetching masjid details:", error);
        }
    };

    const filteredEmployees = employeeList.filter(employee => 
        employee.nama.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(
        (search ? filteredEmployees.length : totalEmployees) / ITEMS_PER_PAGE
    );

    const displayedEmployees = search
        ? filteredEmployees.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        )
        : employeeList;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

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

    const handleDelete = async (id: string): Promise<boolean> => {
        if (!confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
            return false;
        }
        
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/employee/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Gagal menghapus karyawan");

            toast.success("Data karyawan berhasil dihapus");

            if (search.trim().length > 0) {
                await fetchEmployees();
            } else {
                await fetchPaginatedEmployees(currentPage);
            }

            const isLastItemOnPage = employeeList.length === 1 && currentPage > 1;
            const nextPage = isLastItemOnPage ? currentPage - 1 : currentPage;
            setCurrentPage(nextPage);
            return true;
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast.error("Gagal menghapus data karyawan");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
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
            fetchUser();
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const payload = {
                ...newEmployee,
                masjid_id: user.masjid_id,
                created_by: user.id,
                created_at: now,
                updated_at: now
            }

            console.log(JSON.stringify(payload))

            const response = await fetch(`${API_URL}/api/employee`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                throw new Error(errorData.message || "Failed to save employee");
            }

            const data = await response.json();

            if (response.ok) {
                toast.success("Karyawan berhasil ditambahkan");
                setIsOpen(false);
                resetForm();
                fetchPaginatedEmployees(currentPage);
            } else {
                throw new Error(data.message || "Terjadi kesalahan");
            }
        } catch (error) {
            console.error("Error saving employee:", error);
            toast.error(error instanceof Error ? error.message : "Gagal menyimpan data karyawan");
        } finally {
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
                                masjidNameParam={employee.masjid_nama || masjidName}
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
}

export default Employee;