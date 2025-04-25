import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Save, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 5 * 1024 * 1024;

            if (file.size > maxSize) {
                toast.error("Ukuran foto tidak boleh lebih dari 2MB");
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
        
        try {
            console.log("Edited Employee", editedEmployee);
            console.log("Stringify", JSON.stringify(editedEmployee))

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("nama", editedEmployee.nama || "");
            formData.append("email", editedEmployee.email || "");
            formData.append("telepon", editedEmployee.telepon || "");
            
            if (editedEmployee.alamat) {
                formData.append("alamat", editedEmployee.alamat);
            }
            
            if (selectedFile) {
                formData.append("foto", selectedFile);
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
                            {isEditing ? (
                                <div className="flex flex-col gap-4 mt-2">
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
                                    ) : (
                                        employee.foto && (
                                            <div>
                                                <Avatar className="h-32 w-32">
                                                    <AvatarImage src={employee.foto} alt={employee.nama} className='w-full h-full object-cover'/>
                                                    <AvatarFallback className="text-lg bg-slate-200 text-slate-700">
                                                        {getInitials(employee.nama)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                        )
                                    )}

                                    <Input
                                        id="foto"
                                        name="foto"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                    />
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