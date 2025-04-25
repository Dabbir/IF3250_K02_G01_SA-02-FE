import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Save, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const DetailEmployee = () => {
    const { id } = useParams<{ id: string }>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [deletePhoto, setDeletePhoto] = useState(false);
    const [kegiatanLoading, setKegiatanLoading] = useState(true);
    const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            setLoading(true);
            try {
                console.log("Fetch employee pertama kali")
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/api/employee/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
        
                const data = await response.json();
                console.log("data", data);
        
                if (!response.ok) throw new Error(data.message || "Gagal memuat data karyawan");
                const empData = data.data;

                if (empData.masjid_id) {
                    try {
                        const masjidResponse = await fetch(`${API_URL}/api/masjid/${empData.masjid_id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        });
                        
                        if (masjidResponse.ok) {
                            const masjidData = await masjidResponse.json();

                            if (masjidData.success && masjidData.data) {
                                empData.masjid_nama = masjidData.data.nama_masjid;
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching masjid details:", error);
                    }
                }

                setEmployee(empData);
                setEditedEmployee(empData);
            } catch (error) {
                console.error("Error fetching employee:", error);
                toast.error("Gagal memuat data karyawan");
            } finally {
                setLoading(false);
            }
        };        

        fetchEmployee();
    }, [id]);

    useEffect(() => {
        const fetchKegiatan = async () => {
            setKegiatanLoading(true);

            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/api/employee/activity/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                console.log("data kegiatan employee", data);

                if (response.status === 404 || !data.success || !Array.isArray(data.data)) {
                    setKegiatanList([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error(data.message || "Gagal memuat kegiatan karyawan");
                }

                const listKegiatan: Kegiatan[] = data.data.map((item: any) => ({
                    idKegiatan: String(item.id),
                    namaKegiatan: item.nama_aktivitas,
                    tanggalMulai: new Date(item.tanggal_mulai).toISOString().split("T")[0],
                    tanggalSelesai: new Date(item.tanggal_selesai).toISOString().split("T")[0],
                    status: item.status,
                    biayaImplementasi: String(item.biaya_implementasi),
                    deskripsi: item.deskripsi,
                }));
                console.log("List kegiatan")
                console.log(listKegiatan);
        
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

    const handleChange = (field: keyof Employee, value: string | number) => {
        setEditedEmployee((prev) => ({ ...prev!, [field]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedEmployee(employee);
        setIsEditing(false);
        setDeletePhoto(false);
    };

    const handleSaveClick = async () => {
        if (!editedEmployee) return;
        const errors = [];
    
        if (!editedEmployee.nama || editedEmployee.nama.trim() === '') {
            errors.push("Nama wajib diisi");
        }
        
        if (!editedEmployee.email || editedEmployee.email.trim() === '') {
            errors.push("Email wajib diisi");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedEmployee.email)) {
            errors.push("Format email tidak valid");
        }
        
        if (!editedEmployee.telepon || editedEmployee.telepon.trim() === '') {
            errors.push("Telepon wajib diisi!");
        } else if (!/^\d+$/.test(editedEmployee.telepon)) {
            errors.push("Telepon harus berupa angka!");
        } else if (editedEmployee.telepon.length < 10 || editedEmployee.telepon.length > 15) {
            errors.push("Nomor telepon harus berupa angka (10-15 digit)!");
        }
        
        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }
        
        setSaving(true);
        
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("nama", editedEmployee.nama || "");
            formData.append("email", editedEmployee.email || "");
            formData.append("telepon", editedEmployee.telepon || "");
            
            if (editedEmployee.alamat) {
                formData.append("alamat", editedEmployee.alamat);
            }

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

    const getInitials = (name: string) => {
        return name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .substring(0, 2);
    };

    return (
        <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6 ">
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
                            {isEditing ? (
                                <div className="flex flex-col gap-4 mt-2 items-center">
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img 
                                                src={previewUrl} 
                                                alt="Preview" 
                                                className="w-32 h-32 rounded-full object-cover" 
                                            />
                                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-5 w-5 text-red-500 hover:text-red-600"
                                                    onClick={() => {
                                                        setSelectedFile(null);
                                                        setPreviewUrl(null);
                                                        if (fileInputRef.current) {
                                                            fileInputRef.current.value = "";
                                                        }
                                                    }}
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        </div>
                                    ) : !deletePhoto && employee.foto ? (
                                        <Avatar className="h-32 w-32">
                                            <AvatarImage
                                            src={employee.foto}
                                            alt={employee.nama}
                                            className="w-full h-full object-cover"
                                            />
                                            <AvatarFallback className="text-lg bg-slate-200 text-slate-700">
                                            {getInitials(employee.nama)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : null}

                                    <div className="flex flex-col items-center gap-2">
                                        {!previewUrl && !deletePhoto && employee.foto && (
                                        <Button
                                            size="sm"
                                            type="button"
                                            className="w-[110px] h-[32px] bg-red-600 hover:bg-red-700 text-white"
                                            onClick={handleDeletePhoto}
                                        >
                                            Hapus Foto
                                        </Button>
                                        )}

                                        <Button
                                            size="sm"
                                            type="button"
                                            className="w-[110px] h-[32px] bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={() => fileInputRef.current?.click()}
                                            >
                                            Pilih Foto
                                        </Button>

                                        <input
                                            id="foto"
                                            name="foto"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                            className="hidden"
                                        />

                                        {selectedFile && (
                                            <span className="text-sm text-gray-600">{selectedFile.name}</span>
                                        )}

                                        {deletePhoto && (
                                            <div className="text-sm text-red-500 text-center">
                                                Foto akan dihapus setelah menyimpan perubahan
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="shrink-0">
                                    <Avatar className="h-32 w-32">
                                        <AvatarImage src={employee.foto} alt={employee.nama} className='w-full h-full object-cover'/>
                                        <AvatarFallback className="text-lg bg-slate-200 text-slate-700">
                                            {getInitials(employee.nama)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div> 
                            )}
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
                                            <div className="whitespace-pre-wrap">{String(employee?.masjid_nama)}</div>
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
                                                <div className="whitespace-pre-wrap">{employee?.alamat || "-"}</div>
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

                <div className="my-6 space-y-3">
                    <h1 className="text-2xl">Kegiatan Karyawan</h1>
                    {kegiatanLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                        </div>
                    ) : kegiatanList.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Tidak terdapat kegiatan yang terkait dengan data karyawan ini.</p>
                    ) : (
                        <Table className="border overflow-hidden">
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead className="pl-7 w-[200px]">Nama Kegiatan</TableHead>
                                    <TableHead className="w-[120px] text-center">Tanggal Mulai</TableHead>
                                    <TableHead className="w-[120px] text-center">Tanggal Selesai</TableHead>
                                    <TableHead className="w-[120px] text-center">Status</TableHead>
                                    <TableHead className="w-[180px]">Biaya Implementasi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {kegiatanList.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        className="border-b cursor-pointer hover:bg-gray-100 transition"
                                        onClick={() => {
                                            navigate(`/kegiatan/${item.idKegiatan}`);
                                        }}
                                    >
                                        <TableCell className="pl-7 truncate max-w-[180px]">{item.namaKegiatan}</TableCell>
                                        <TableCell className="text-center truncate">{item.tanggalMulai}</TableCell>
                                        <TableCell className="text-center truncate">{item.tanggalSelesai}</TableCell>
                                        <TableCell className="text-center truncate">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                item.status === "Finished" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-left truncate max-w-[180px]">
                                            Rp{parseInt(item.biayaImplementasi).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

            </CardContent>
        </Card>
    );
};

export default DetailEmployee;