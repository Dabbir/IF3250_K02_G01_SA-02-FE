import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building, Pencil, Save, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

interface Kegiatan {
    idKegiatan: string;
    namaKegiatan: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    status: string;
    biayaImplementasi: string;
    deskripsi: string;
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

const DetailEmployee = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [kegiatanLoading, setKegiatanLoading] = useState(true);
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
    const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
          const foundEmployee = employees.find(emp => emp.id === id);
          if (foundEmployee) {
            setEmployee(foundEmployee);
            setEditedEmployee(foundEmployee);
          }
          setLoading(false);
        }, 500);
    }, [id]);

    useEffect(() => {
        const fetchKegiatan = async () => {
            setKegiatanLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/api/activity/program/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
        
                const data = await response.json();
        
                if (response.status === 404 || !data.success || !Array.isArray(data.activity)) {
                    setKegiatanList([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.message || "Gagal memuat kegiatan program");
                }
        
                const listKegiatan: Kegiatan[] = data.activity.map((item: any) => ({
                    idKegiatan: String(item.id),
                    namaKegiatan: item.nama_aktivitas,
                    tanggalMulai: new Date(item.tanggal_mulai).toISOString().split("T")[0],
                    tanggalSelesai: new Date(item.tanggal_selesai).toISOString().split("T")[0],
                    status: item.status,
                    biayaImplementasi: String(item.biaya_implementasi),
                    deskripsi: item.deskripsi,
                }));
        
                setKegiatanList(listKegiatan);
            } catch (error) {
                console.error("Error fetching kegiatan:", error);
                toast.error("Gagal memuat data kegiatan");
            } finally {
                setKegiatanLoading(false);
            }
        };         

        if (id) {
            fetchKegiatan();
        }
    }, [id]);

    const handleChange = (field: keyof Employee, value: string | number) => {
        setEditedEmployee((prev) => ({ ...prev!, [field]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedEmployee(employee);
        setIsEditing(false);
    };

    const handleSaveClick = async () => {
        if (!editedEmployee) return;
        setSaving(true);
        
        setTimeout(() => {
            try {
                const updatedEmployee = {
                  ...editedEmployee,
                  updated_at: new Date().toISOString()
                };
                
                const updatedEmployees = employees.map(emp => 
                  emp.id === updatedEmployee.id ? updatedEmployee : emp
                );
                
                setEmployee(updatedEmployee);
                setIsEditing(false);
                toast.success("Karyawan berhasil diperbarui");
            } catch (error) {
                console.error("Error updating employee:", error);
                toast.error("Gagal memperbarui data karyawan");
            } finally {
                setSaving(false);
            }  
        }, 1000);
    };

    const getInitials = (name: string) => {
        return name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                toast.error("Ukuran foto tidak boleh lebih dari 2MB");
                return;
            }
            setSelectedFile(file);
          
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedEmployee(prev => prev ? {
                ...prev,
                foto: reader.result as string
                } : null);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card className="mx-auto mt-6 max-w-[70rem] p-6">
            <CardHeader>
                <div className='justify-between items-top flex'>
                    <div className="flex items-center space-x-2">
                        <ArrowLeft 
                        className="h-6 w-6 text-slate-700 hover:cursor-pointer" 
                        onClick={() => { navigate(`/karyawan`); }}
                        />
                        <h2 className="text-xl font-medium text-[var(--blue)]">Detail Karyawan</h2>
                    </div>
                    <div className="flex flex-col text-xs space-y-2 text-right text-gray-700">
                        <p>
                            <strong>Created At:</strong>{" "}
                            {employee?.created_at ? new Date(employee.created_at).toLocaleString() : "N/A"}
                        </p>
                        <p>
                            <strong>Updated At:</strong>{" "}
                            {employee?.updated_at ? new Date(employee.updated_at).toLocaleString() : "N/A"}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </div>
                ) : employee? (
                    <>
                        <div className="flex justify-end mt-6">
                            {!isEditing ? (
                                <Button className='h-10' variant="outline" onClick={handleEditClick}>
                                    <Pencil className="h-4 w-4 mr-2" /> Ubah
                                </Button>
                            ) : (
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={handleCancel}>
                                        Batal
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleSaveClick}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" /> Simpan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center items-center">
                            <div className="h-48 w-48 overflow-hidden rounded-full border border-gray-200">
                                <img
                                    src={employee?.foto || "/logo-white.svg"}
                                    alt={employee?.nama || "Foto Karyawan"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>


                        <Table className="border border-t-0 border-l-0 border-r-0 last:border-b-0 my-6 w-full">
                            <TableBody>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Nama</TableHead>
                                    <TableCell className="w-full break-words">
                                        <div className="flex items-center space-x-2 w-full">
                                            {isEditing ? (
                                                <Input
                                                    value={editedEmployee?.nama}
                                                    onChange={(e) => handleChange("nama", e.target.value)}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap">{String(employee?.nama)}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Masjid</TableHead>
                                    <TableCell className="w-full break-words">
                                        <div className="flex items-center space-x-2 w-full">
                                        {isEditing ? (
                                            <div className="whitespace-pre-wrap">{String(employee?.masjid_nama)}</div>
                                        ) : (
                                            <div className="whitespace-pre-wrap">{String(employee?.masjid_nama)}</div>
                                        )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Telepon</TableHead>
                                    <TableCell className="w-full break-words">
                                        <div className="flex items-center space-x-2 w-full">
                                            {isEditing ? (
                                                <Input
                                                    value={editedEmployee?.telepon}
                                                    onChange={(e) => handleChange("telepon", e.target.value)}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap">{String(employee?.telepon)}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Email</TableHead>
                                    <TableCell className="w-full">
                                        <div className="flex items-center space-x-2 w-full">
                                            {isEditing ? (
                                                <Input
                                                    value={editedEmployee?.email}
                                                    onChange={(e) => handleChange("email", e.target.value)}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap">{String(employee?.email)}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Alamat</TableHead>
                                    <TableCell className="w-full">
                                        <div className="flex items-center space-x-2 w-full">
                                            {isEditing ? (
                                                <Input
                                                    value={editedEmployee?.alamat}
                                                    onChange={(e) => handleChange("alamat", e.target.value)}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap">{String(employee?.alamat)}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </>
                ) : (
                    <div className="flex justify-center items-center h-40">
                        <p>Karyawan tidak ditemukan</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DetailEmployee;