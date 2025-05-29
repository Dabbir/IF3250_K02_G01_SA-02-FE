import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import type { Employee, userData, ValidationErrors, Kegiatan } from "@/types/employee"

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
    
    const { id } = useParams<{ id: string }>();

    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [deletePhoto, setDeletePhoto] = useState(false);
    const [kegiatanLoading, setKegiatanLoading] = useState(true);
    const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
    const [errors, setErrors] = useState<ValidationErrors>({});

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

    const handleSaveClick = async () => {
        if (!validateForm()) return;
        setSaving(true);
        
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("nama", editedEmployee!.nama || "");
            formData.append("email", editedEmployee!.email || "");
            formData.append("telepon", editedEmployee!.telepon || "");
            formData.append("alamat", editedEmployee!.alamat || "");

            if (deletePhoto) {
                formData.append("deletePhoto", "true");
            }
            
            if (selectedFile) {
                formData.append("foto", selectedFile);
            }

            console.log("Isi FormData:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await fetch(`${API_URL}/api/employee/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update employee");
            }

            const updatedData = await fetch(`${API_URL}/api/employee/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await updatedData.json();
            console.log("data hasil update", data);
            const updatedEmployee = data.data;

            if (updatedEmployee.masjid_id) {
                try {
                    const masjidResponse = await fetch(`${API_URL}/api/masjid/${updatedEmployee.masjid_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    
                    if (masjidResponse.ok) {
                        const masjidData = await masjidResponse.json();

                        if (masjidData.success && masjidData.data) {
                            updatedEmployee.masjid_nama = masjidData.data.nama_masjid;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching masjid details:", error);
                }
            }

            setEmployee(updatedEmployee);
            setSelectedFile(null);
            setPreviewUrl(null);
            setIsEditing(false);
            setDeletePhoto(false);
            toast.success("Data karyawan berhasil diperbarui");
        } catch (error) {
            console.error("Error updating employee:", error);
            toast.error("Gagal memperbarui data karyawan");
        } finally {
            setSaving(false);
        }
    };

    const validateForm = (): boolean => {
        if (!editedEmployee) return false;
        
        const newErrors: ValidationErrors = {};
    
        if (!editedEmployee.nama || editedEmployee.nama.trim() === "") {
            newErrors.nama = "Nama wajib diisi";
            }

        if (!editedEmployee.email || editedEmployee.email.trim() === "") {
            newErrors.email = "Email wajib diisi";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedEmployee.email)) {
            newErrors.email = "Format email tidak valid";
        }

        if (!editedEmployee.telepon || editedEmployee.telepon.trim() === "") {
            newErrors.telepon = "Telepon wajib diisi";
        } else if (!/^\d+$/.test(editedEmployee.telepon)) {
            newErrors.telepon = "Telepon harus berupa angka";
        } else if ( editedEmployee.telepon.length < 10 || editedEmployee.telepon.length > 15) {
            newErrors.telepon = "Nomor telepon harus berupa angka (10-15 digit)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const getInitials = (name: string) => {
        return name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
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

    const handleChange = (field: keyof Employee, value: string | number) => {
        setEditedEmployee((prev) => ({ ...prev!, [field]: value }));

        if (errors[field as keyof ValidationErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setErrors({});
    };

    const handleCancel = () => {
        setEditedEmployee(employee);
        setIsEditing(false);
        setDeletePhoto(false);
        setErrors({});
    };

    const confirmDeleteEmployee = (employee: Employee) => {
        setDeletingEmployee(employee);
        setShowDeleteDialog(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 5 * 1024 * 1024;

            if (file.size > maxSize) {
                toast.error("Ukuran foto tidak boleh lebih dari 5MB");
                return;
            }
            setSelectedFile(file);

            const reader = new FileReader();

            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }

    }

    const handleDeletePhoto = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setDeletePhoto(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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

    const handleNavigateBack = () => {
        navigate(`/karyawan`)
    }

    const handleNavigateKegiatanEmployee = (idKegiatan: string | undefined) => {
        if (idKegiatan) {
            navigate(`/karyawan/${idKegiatan}`)
        }
    }

    return {
        loading,
        setLoading,
        saving,
        setSaving,
        isEditing,
        setIsEditing,
        employee, 
        setEmployee, 
        editedEmployee, 
        setEditedEmployee,
        previewUrl,
        setPreviewUrl,
        deletePhoto,
        setDeletePhoto,
        kegiatanLoading,
        setKegiatanLoading,
        kegiatanList,
        setKegiatanList,
        errors,
        setErrors,
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
        handleNavigateBack,
        handleNavigateKegiatanEmployee,
        showDeleteDialog,
        setShowDeleteDialog,
        currentPage,
        totalPages,
        setCurrentPage,
        displayedEmployees,
        handleOpenChange,
        handleDeleteEmployee,
        confirmDeleteEmployee,
        handleSubmit,
        selectedFile,
        setSelectedFile,
        fileInputRef,
        id,
        handleFileChange,
        handleDeletePhoto,
        handleChange,
        handleEditClick,
        handleCancel,
        handleSaveClick,
        validateForm,
        getInitials
    }

}