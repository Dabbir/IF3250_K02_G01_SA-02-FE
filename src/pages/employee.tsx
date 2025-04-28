"use client"

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmployeeCard from "@/components/employee/employeecard";
import EmployeeDialog from "@/components/employee/addemployeedialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Users, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface SortControlsProps {
    sortBy: string;
    sortOrder: "ASC" | "DESC";
    onSortByChange: (val: string) => void;
    onSortOrderToggle: () => void;
}

const SortControls: React.FC<SortControlsProps> = ({
        sortBy,
        sortOrder,
        onSortByChange,
        onSortOrderToggle,
    }) => (
    <div className="flex items-center space-x-1">
        <Select
            value={sortBy}
            onValueChange={(v) => onSortByChange(v)}
        >
            <SelectTrigger className="h-8 px-2 flex items-center space-x-1 text-sm">
                <ArrowUpDown className="w-4 h-4" />
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="w-32 py-1">
                <SelectItem value="nama" className="px-2 py-1 text-sm">
                    Nama Karyawan
                </SelectItem>
                <SelectItem value="created_at" className="px-2 py-1 text-sm">
                    Waktu Unggah
                </SelectItem>
            </SelectContent>
        </Select>
    
        <button
            onClick={onSortOrderToggle}
            className="h-8 w-8 flex items-center justify-center border rounded text-sm"
            aria-label="Toggle sort order"
        >
            {sortOrder === "ASC" ? (
                <ArrowUp className="w-4 h-4" />
            ) : (
                <ArrowDown className="w-4 h-4" />
            )}
        </button>
    </div>
);

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
    const [sortColumn, setSortColumn] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
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
            await fetchPaginatedEmployees(currentPage, search);
          } else {
            await fetchPaginatedEmployees(currentPage);
          }
        };
        
        loadInitialData();
    }, []);

    useEffect(() => {
        if (search.trim().length > 0) {
            setCurrentPage(1);
            fetchPaginatedEmployees(1, search);
        } else {
            fetchPaginatedEmployees(currentPage);
        }
    }, [search]);

    useEffect(() => {
        if (search.trim().length > 0) {
            setCurrentPage(1);
            fetchPaginatedEmployees(1, search);
        } else {
            fetchPaginatedEmployees(currentPage);
        }
    }, [sortColumn]);

    useEffect(() => {
        if (search.trim().length > 0) {
            setCurrentPage(1);
            fetchPaginatedEmployees(1, search);
        } else {
            fetchPaginatedEmployees(currentPage);
        }
    }, [sortOrder]);
    
    useEffect(() => {
        if (search.trim().length > 0) {
            fetchPaginatedEmployees(currentPage, search);
        } else {
            fetchPaginatedEmployees(currentPage);
        }
    }, [currentPage]);

    useEffect(() => {
        if (user.masjid_id) {
          fetchMasjidDetails();
        }
    }, [user.masjid_id]);

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

    const fetchPaginatedEmployees = async (page: number, searchTerm: string = "") => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`
                ${API_URL}/api/employee?page=${page}&sortBy=${sortColumn}&sortOrder=${sortOrder}&limit=${ITEMS_PER_PAGE}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`, {
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

    const handleDeleteEmployee = async () => {
        if (!deletingEmployee) return;
        
        setIsDeleting(true);
        try {
        const success = await handleDelete(deletingEmployee.id);
        
        if (success) {
            toast.success(`Data karyawan berhasil dihapus`);
        } else {
            toast.error("Gagal menghapus karyawan");
        }
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast.error("Terjadi kesalahan saat menghapus karyawan");
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
            setDeletingEmployee(null);
        }
    };

    const confirmDeleteEmployee = (employee: Employee) => {
        setDeletingEmployee(employee);
        setShowDeleteDialog(true);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        
        try {
            fetchUser();
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const formData = new FormData();
            formData.append("nama", newEmployee.nama || "");
            formData.append("email", newEmployee.email || "");
            formData.append("telepon", newEmployee.telepon || "");
            
            if (newEmployee.alamat) {
                formData.append("alamat", newEmployee.alamat);
            }

            if (selectedFile) {
                formData.append("foto", selectedFile);
            }

            console.log("isi formData", formData);

            const response = await fetch(`${API_URL}/api/employee`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save employee");
            }
    
            const data = await response.json();
    
            toast.success("Karyawan berhasil ditambahkan");
            setIsOpen(false);
            resetForm();
            fetchPaginatedEmployees(currentPage);
        } catch (error) {
            console.error("Error saving employee:", error);
            toast.error(error instanceof Error ? error.message : "Gagal menyimpan data karyawan");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
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

                        <SortControls
                            sortBy={sortColumn}
                            sortOrder={sortOrder}
                            onSortByChange={(column) => {
                                setSortColumn(column);
                                setCurrentPage(1);
                            }}
                            onSortOrderToggle={() => {
                                setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
                                setCurrentPage(1);
                            }}
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
                                onDelete={() => confirmDeleteEmployee(employee)}
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
    
                <EmployeeDialog
                    isOpen={isOpen}
                    setIsOpen={handleOpenChange}
                    newEmployee={newEmployee}
                    setNewEmployee={setNewEmployee}
                    onSubmit={handleSubmit}
                    submitting={submitting}
                />

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Hapus Karyawan</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus karyawan "{deletingEmployee?.nama}"? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-between sm:justify-between mt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowDeleteDialog(false)}
                                disabled={isDeleting}
                            >
                                Batal
                            </Button>
                            <Button 
                                type="button" 
                                variant="destructive" 
                                onClick={handleDeleteEmployee}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                                    Menghapus...
                                </>
                                ) : "Hapus Karyawan"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

export default Employee;