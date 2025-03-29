import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building, Pencil, Save, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Banknote } from 'lucide-react';
import { HandCoins } from 'lucide-react';

interface Program {
    id: number;
    nama_program: string;
    deskripsi_program: string;
    pilar_program: string;
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

interface Kegiatan {
    idKegiatan: string;
    namaKegiatan: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    status: string;
    biayaImplementasi: string;
    deskripsi: string;
}

const DetailProgram = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [kegiatanLoading, setKegiatanLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [program, setProgram] = useState<Program | null>(null);
    const [editedProgram, setEditedProgram] = useState<Program | null>(null);
    const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProgram = async () => {
            setLoading(true);
            try {
                setTimeout(() => {
                    setProgram({
                        id: Number(id),
                        nama_program: "Penyediaan Buka Puasa Gratis",
                        deskripsi_program: "Program buka puasa bersama yang diselenggarakan selama bulan Ramadhan tahun 2025",
                        pilar_program: "17",
                        kriteria_program: "Program Penyejahteraan Umat",
                        waktu_mulai: "2025-03-20",
                        waktu_selesai: "2025-03-25",
                        rancangan_anggaran: 5000000,
                        aktualisasi_anggaran: 500000,
                        status_program: "Berjalan",
                        masjid_id: 2,
                        created_by: "Sabil",
                        created_at: "2025-03-20 17:01:01",
                        updated_at: "2025-03-20 17:01:01",
                    });
                    setEditedProgram({
                        id: Number(id),
                        nama_program: "Penyediaan Buka Puasa Gratis",
                        deskripsi_program: "Program buka puasa bersama yang diselenggarakan selama bulan Ramadhan tahun 2025",
                        pilar_program: "17",
                        kriteria_program: "Program Penyejahteraan Umat",
                        waktu_mulai: "2025-03-20",
                        waktu_selesai: "2025-03-25",
                        rancangan_anggaran: 5000000,
                        aktualisasi_anggaran: 500000,
                        status_program: "Berjalan",
                        masjid_id: 2,
                        created_by: "Sabil",
                        created_at: "2025-03-20 17:01:01",
                        updated_at: "2025-03-20 17:01:01",
                    });
                    setLoading(false);
                }, 1000);

                // const token = localStorage.getItem("token");
                // const response = await fetch(`${API_URL}/api/programs/${id}`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //         "Content-Type": "application/json",
                //     },
                // });
                // const data = await response.json();
                // if (data.success) {
                //     setProgram(data.program);
                //     setEditedProgram(data.program);
                // }
            } catch (error) {
                console.error("Error fetching program:", error);
                toast.error("Gagal memuat data program");
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
    }, [id]);

    // Fetch kegiatan data
    useEffect(() => {
        const fetchKegiatan = async () => {
            setKegiatanLoading(true);
            try {
                setTimeout(() => {
                    const mockKegiatanData: Kegiatan[] = Array.from({ length: 5 }, (_, i) => ({
                        idKegiatan: `${i}`,
                        namaKegiatan: `Kegiatan Buka Puasa Hari ${i + 1}`,
                        tanggalMulai: "2025-03-20",
                        tanggalSelesai: "2025-03-20",
                        status: i < 2 ? "Finished" : "Ongoing",
                        biayaImplementasi: (1000000 * (i + 1)).toString(),
                        deskripsi: `Kegiatan buka puasa bersama hari ke-${i + 1}`
                    }));
                    setKegiatanList(mockKegiatanData);
                    setKegiatanLoading(false);
                }, 1500);

                // const token = localStorage.getItem("token");
                // const response = await fetch(`${API_URL}/api/programs/${id}/kegiatan`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //         "Content-Type": "application/json",
                //     },
                // });
                // const data = await response.json();
                // if (data.success) {
                //     setKegiatanList(data.kegiatan);
                // }
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

    const handleChange = (field: keyof Program, value: string | number) => {
        setEditedProgram((prev) => ({ ...prev!, [field]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedProgram(program);
        setIsEditing(false);
    };

    const handleSaveClick = async () => {
        if (!editedProgram) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            setTimeout(() => {
                setProgram(editedProgram);
                setIsEditing(false);
                toast.success("Program berhasil diperbarui");
                setSaving(false);
            }, 1000);

            // const response = await fetch(`${API_URL}/api/programs/${id}`, {
            //     method: "PUT",
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(editedProgram),
            // });
            //
            // if (!response.ok) {
            //     throw new Error("Failed to update program");
            // }
            //
            // const data = await response.json();
            // if (data.success) {
            //     setProgram(editedProgram);
            //     setIsEditing(false);
            //     toast.success("Program berhasil diperbarui");
            // }
        } catch (error) {
            console.error("Error updating program:", error);
            toast.error("Gagal memperbarui program");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="mx-auto mt-6 max-w-[70rem] p-6">
            <CardHeader>
                <div className='justify-between items-top flex'>
                    <div className="flex items-center space-x-2">
                        <ArrowLeft 
                        className="h-6 w-6 text-slate-700 hover:cursor-pointer" 
                        onClick={() => { navigate(`/data-program`); }}
                        />
                        <h2 className="text-xl font-medium text-[var(--blue)]">Detail Program</h2>
                    </div>
                    <div className="flex flex-col text-xs space-y-2 text-right text-gray-700">
                        <p>
                            <strong>Created At:</strong>{" "}
                            {program?.created_at ? new Date(program.created_at).toLocaleString() : "N/A"}
                        </p>
                        <p>
                            <strong>Updated At:</strong>{" "}
                            {program?.updated_at ? new Date(program.updated_at).toLocaleString() : "N/A"}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </div>
                ) : (
                    <>
                        <div className='space-y-2'>
                            <div className="flex justify-between align-baseline">
                                <div className="space-y-4 align-bottom">
                                    <h1 className="text-3xl font-semibold">{String(program?.nama_program ?? "Program Masjid")}</h1>
                                    <div className="mt-2 flex justify-center items-center font-semibold w-20 h-6 md:w-22 md:h-8 rounded-xl md:rounded-2xl text-sm md:text-base text-white bg-[#ECA72C]">
                                            Berjalan
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    {!isEditing ? (
                                        <Button className='h-10' variant="outline" onClick={handleEditClick}>
                                            <Pencil className="h-4 w-4 mr-2" /> Edit
                                        </Button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                                Cancel
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
                            </div>
                            <div className="flex items-center mt-4 space-x-2">
                                <Building className='h-5 w-5 text-[#3A786D]'/>
                                <p className='text-[#3A786D] font-semibold'>Masjid Salman</p>
                            </div>
                            <div className="flex items-center space-x-2 ">
                                <User className='h-5 w-5 text-gray-500'/>
                                <p className='text-gray-500 font-semibold'> Dibuat oleh {String(program?.created_by ?? "Editor")}</p>
                            </div>
                        </div>

                        <Table className="border border-t-0 border-l-0 border-r-0 last:border-b-0 overflow-hidden my-6">
                            <TableBody>
                                <TableRow>
                                    <TableHead>Deskripsi Program</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Textarea
                                                value={editedProgram?.deskripsi_program}
                                                onChange={(e) => handleChange("deskripsi_program", e.target.value)}
                                            />
                                        ) : (
                                            String(program?.deskripsi_program)
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Pilar Program</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                value={editedProgram?.pilar_program}
                                                onChange={(e) => handleChange("pilar_program", e.target.value)}
                                            />
                                        ) : (
                                            String(program?.pilar_program)
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Kriteria Program</TableHead>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            {isEditing ? (
                                                <Input
                                                    value={editedProgram?.kriteria_program}
                                                    onChange={(e) => handleChange("kriteria_program", e.target.value)}
                                                />
                                            ) : (
                                                String(program?.kriteria_program)
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Tanggal Mulai</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedProgram?.waktu_mulai}
                                                onChange={(e) => handleChange("waktu_mulai", e.target.value)}
                                            />
                                        ) : (
                                            String(program?.waktu_mulai)
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Tanggal Selesai</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedProgram?.waktu_selesai}
                                                onChange={(e) => handleChange("waktu_selesai", e.target.value)}
                                            />
                                        ) : (
                                            String(program?.waktu_selesai)
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Rancangan Anggaran</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editedProgram?.rancangan_anggaran}
                                                onChange={(e) => handleChange("rancangan_anggaran", parseInt(e.target.value) || 0)}
                                            />
                                        ) : (
                                            <span>
                                                Rp{String(program?.rancangan_anggaran?.toLocaleString() ?? "0")}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Aktualisasi Anggaran</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editedProgram?.aktualisasi_anggaran}
                                                onChange={(e) => handleChange("aktualisasi_anggaran", parseInt(e.target.value) || 0)}
                                            />
                                        ) : (
                                            <span>
                                                Rp{String(program?.aktualisasi_anggaran?.toLocaleString() ?? "0")}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <div className="my-6 space-y-3">
                            <h1 className="text-2xl">Kegiatan Program</h1>
                            {kegiatanLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                                </div>
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
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default DetailProgram;