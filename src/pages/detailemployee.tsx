import { useEffect } from 'react';
import { ArrowLeft, Pencil, Save, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Kegiatan } from "@/types/employee"
import useEmployee from "@/hooks/use-employee";

const API_URL = import.meta.env.VITE_HOST_NAME;

const DetailEmployee = () => {
    const {
        id,
        loading,
        setLoading,
        saving,
        isEditing,
        employee,
        setEmployee,
        editedEmployee,
        setEditedEmployee,
        selectedFile,
        setSelectedFile,
        previewUrl,
        setPreviewUrl,
        deletePhoto,
        kegiatanLoading,
        setKegiatanLoading,
        kegiatanList,
        setKegiatanList,
        errors,
        handleNavigateBack,
        handleNavigateKegiatanEmployee,
        fileInputRef,
        handleFileChange,
        handleDeletePhoto,
        handleChange,
        handleEditClick,
        handleCancel,
        handleSaveClick,
        getInitials
    } = useEmployee()

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

    return (
        <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6 ">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <ArrowLeft
                        className="h-6 w-6 text-slate-700 hover:cursor-pointer"
                        onClick={() => handleNavigateBack()}
                    />
                    <h2 className="text-xl font-medium text-[var(--blue)]">Detail Karyawan</h2>
                </div>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </div>
                ) : employee ? (
                    <>
                        <div className="flex justify-end space-x-2 mt-4 md:mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEditClick}
                                disabled={isEditing}
                                className="border-[var(--green)] text-[var(--green)] px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                            >
                                <Pencil className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                                Edit
                            </Button>
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
                                            className="w-[110px] h-[32px] bg-[var(--green)] hover:bg-[var(--blue)] text-white"
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
                                        <AvatarImage src={employee.foto} alt={employee.nama} className='w-full h-full object-cover' />
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
                                        <div className="flex flex-col  space-x-2 w-full">
                                            {isEditing ? (
                                                <>
                                                    <Input
                                                        value={editedEmployee?.nama}
                                                        onChange={(e) => handleChange("nama", e.target.value)}
                                                        className="w-full"
                                                    />
                                                    {errors.nama && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
                                                    )}
                                                </>
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
                                        <div className="flex flex-col space-x-2 w-full">
                                            {isEditing ? (
                                                <>
                                                    <Input
                                                        value={editedEmployee?.telepon}
                                                        onChange={(e) => handleChange("telepon", e.target.value)}
                                                        className="w-full"
                                                    />
                                                    {errors.telepon && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{String(employee?.telepon)}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Email</TableHead>
                                    <TableCell className="w-full">
                                        <div className="flex flex-col space-x-2 w-full">
                                            {isEditing ? (
                                                <>
                                                    <Input
                                                        value={editedEmployee?.email}
                                                        onChange={(e) => handleChange("email", e.target.value)}
                                                        className="w-full"
                                                    />
                                                    {errors.email && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                                    )}
                                                </>
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

                {isEditing && (
                    <div className="flex justify-center space-x-2 mt-4 md:mt-6">
                        <Button
                            data-cy="cancel-button"
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="border-[var(--green)] text-[var(--green)] px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                        >
                            Batal
                        </Button>
                        <Button
                            data-cy="save-button"
                            type="submit"
                            disabled={saving}
                            onClick={handleSaveClick}
                            className="bg-[var(--green)] hover:bg-[var(--blue)] text-white px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan"
                            )}
                        </Button>
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
                                        onClick={() => handleNavigateKegiatanEmployee(item.idKegiatan)}
                                    >
                                        <TableCell className="pl-7 truncate max-w-[180px]">{item.namaKegiatan}</TableCell>
                                        <TableCell className="text-center truncate">{item.tanggalMulai}</TableCell>
                                        <TableCell className="text-center truncate">{item.tanggalSelesai}</TableCell>
                                        <TableCell className="text-center truncate">
                                            <span className={`px-2 py-1 rounded-full text-xs ${item.status === "Finished" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
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