import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { Employee, userData } from "@/types/employee"

const API_URL = import.meta.env.VITE_HOST_NAME;
const ITEMS_PER_PAGE = 9;

export default function useEmployee() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [masjidName, setMasjidName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [sortColumn, setSortColumn] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const displayedEmployees = search ? filteredEmployees.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    ) : employeeList;

    const handleOpenChange = (open: boolean) => {
        if (!open) {
          resetForm();
          setIsEditMode(false);
        }
        setIsOpen(open);
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

    const handleNavigate = (id: string | undefined) => {
        if (id) {
            navigate(`/karyawan/${id}`)
        }
    }

    return {
        loading,
        search,
        setSearch,
        isOpen,
        setIsOpen,
        isEditMode,
        submitting,
        masjidName,
        newEmployee,
        setNewEmployee,
        deletingEmployee,
        sortOrder,
        sortColumn,
        setSortColumn,
        setSortOrder,
        isDeleting,
        handleNavigate,
        showDeleteDialog,
        setShowDeleteDialog,
        currentPage,
        totalPages,
        setCurrentPage,
        displayedEmployees,
        handleOpenChange,
        handleDeleteEmployee,
        confirmDeleteEmployee,
        handleSubmit
    }

}