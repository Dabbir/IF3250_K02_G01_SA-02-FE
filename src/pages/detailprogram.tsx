import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building, Pencil, Save, Loader2, X, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface Program {
    id: number;
    nama_program: string;
    deskripsi_program: string;
    pilar_program: string[];
    kriteria_program: string;
    waktu_mulai: string;
    waktu_selesai: string;
    rancangan_anggaran: number;
    aktualisasi_anggaran: number;
    status_program: "Belum Mulai" | "Berjalan" | "Selesai";
    cover_image: string | null;
    masjid_id: number;
    created_by: number;
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

const pilarOptions = [
    { id: 1, name: "Tanpa Kemiskinan" },
    { id: 2, name: "Tanpa Kelaparan" },
    { id: 3, name: "Kehidupan Sehat dan Sejahtera" },
    { id: 4, name: "Pendidikan Berkualitas" },
    { id: 5, name: "Kesetaraan Gender" },
    { id: 6, name: "Air Bersih dan Sanitasi Layak" },
    { id: 7, name: "Energi Bersih dan Terjangkau" },
    { id: 8, name: "Pekerjaan Layak dan Pertumbuhan Ekonomi" },
    { id: 9, name: "Industri, Inovasi dan Infrastruktur" },
    { id: 10, name: "Berkurangnya Kesenjangan" },
    { id: 11, name: "Kota dan Pemukiman yang Berkelanjutan" },
    { id: 12, name: "Konsumsi dan Produksi yang Bertanggung Jawab" },
    { id: 13, name: "Penanganan Perubahan Iklim" },
    { id: 14, name: "Ekosistem Lautan" },
    { id: 15, name: "Ekosistem Daratan" },
    { id: 16, name: "Perdamaian, Keadilan dan Kelembagaan yang Tangguh" },
    { id: 17, name: "Kemitraan untuk Mencapai Tujuan" },
];

const DetailProgram = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [kegiatanLoading, setKegiatanLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProgram, setEditedProgram] = useState<Program | null>(null);
    const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const navigate = useNavigate();
    const [program, setProgram] = useState<Program>({
        id: 0,
        nama_program: "",
        deskripsi_program: "",
        pilar_program: [],
        kriteria_program: "",
        waktu_mulai: "",
        waktu_selesai: "",
        rancangan_anggaran: 0,
        aktualisasi_anggaran: 0,
        status_program: "Belum Mulai",
        cover_image: null,
        masjid_id: 0,
        created_by: 0,
        created_at: "",
        updated_at: ""
    });

    const statusBg = {
        "Berjalan": "bg-[#ECA72C]",
        "Selesai": "bg-[#3A786D]",
        "Belum Mulai": "bg-slate-500",
    }[program.status_program] || "bg-gray-200";

    const STATUS_BG_MAP: Record<Program["status_program"], string> = {
        "Belum Mulai": "bg-slate-500",
        Berjalan: "bg-[#ECA72C]",
        Selesai: "bg-[#3A786D]",
    };

    const editedStatusBg = editedProgram
        ? STATUS_BG_MAP[editedProgram.status_program]
        : "";

    useEffect(() => {
        const fetchProgram = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/api/program/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.message || "Gagal memuat data program");

                setProgram(data);
                setEditedProgram(data);
                setCoverPreview(data.cover_image);
            } catch (error) {
                console.error("Error fetching program:", error);
                toast.error("Gagal memuat data program");
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
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

        const now = new Date();
        const start = new Date(editedProgram.waktu_mulai);
        const end = new Date(editedProgram.waktu_selesai);

        switch (editedProgram.status_program) {
            case "Belum Mulai":
                if (start <= now) {
                    toast.error("Status “Belum Mulai” hanya boleh jika tanggal mulai di masa depan.");
                    return;
                }
                break;
            case "Berjalan":
                if (start > now || end < now) {
                    toast.error("Status “Berjalan” hanya boleh jika sekarang berada di antara tanggal mulai dan selesai.");
                    return;
                }
                break;
            case "Selesai":
                if (end >= now) {
                    toast.error("Status “Selesai” hanya boleh jika tanggal selesai sudah terlewati.");
                    return;
                }
                break;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem("token")!;
            const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
            let body: string | FormData;

            if (coverFile) {
                const form = new FormData();
                form.append("cover_image", coverFile);

                for (const key of Object.keys(editedProgram) as (keyof Program)[]) {
                    if (key === "cover_image") continue;

                    if (key === "pilar_program") {
                        form.append(key, JSON.stringify(editedProgram.pilar_program));
                    } else {
                        form.append(key, String((editedProgram as any)[key]));
                    }
                }

                body = form;
            } else {
                if (coverPreview === null) {
                    (editedProgram as any).cover_image = "";
                }
                headers["Content-Type"] = "application/json";
                body = JSON.stringify(editedProgram);
            }

            const response = await fetch(`${API_URL}/api/program/${id}`, {
                method: "PUT",
                headers,
                body,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal memperbarui program");
            }

            const data = await response.json();
            console.log(data);

            setProgram(data);
            setIsEditing(false);
            toast.success("Program berhasil diperbarui");
        } catch (error) {
            console.error("Error updating program:", error);
            toast.error("Gagal memperbarui program");
        } finally {
            setSaving(false);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    return (
        <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
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
                            <div className="mb-4">
                                {coverPreview ? (
                                    <div className="relative w-full h-96 overflow-hidden rounded-lg">
                                        <img
                                            src={coverPreview}
                                            className="w-full h-full object-cover"
                                            alt="Cover"
                                        />
                                        {isEditing && (
                                            <button
                                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                                                onClick={() => {
                                                    setCoverFile(null);
                                                    setCoverPreview(null);
                                                }}
                                            >
                                                <X className="w-4 h-4 text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    isEditing && (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                                            <input
                                                id="cover-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverChange}
                                                className="hidden"
                                            />
                                            <label htmlFor="cover-upload" className="flex items-center gap-2 text-[var(--green)] cursor-pointer">
                                                <Upload className="w-5 h-5" />
                                                <span>Unggah Cover Program</span>
                                            </label>
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="flex justify-between align-baseline">
                                <div className="space-y-4 align-bottom">
                                    <h1 className="text-3xl font-semibold">{String(program?.nama_program ?? "Program Masjid")}</h1>
                                    {isEditing ? (
                                        <Select
                                            value={editedProgram?.status_program}
                                            onValueChange={(value) =>
                                                handleChange("status_program", value as Program["status_program"])
                                            }
                                        >
                                            <SelectTrigger
                                                className={`
                                                w-32 flex items-center justify-between
                                                ${editedStatusBg} text-white
                                            `}
                                            >
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(
                                                    ["Belum Mulai", "Berjalan", "Selesai"] as Program["status_program"][]
                                                ).map((status) => (
                                                    <SelectItem
                                                        key={status}
                                                        value={status}
                                                        className={`
                                                    flex items-center px-2 py-1text-white rounded
                                                `}
                                                    >
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div
                                            className={`mt-2 flex justify-center items-center font-semibold w-28 h-8 rounded-xl md:rounded-2xl text-xs md:text-sm text-white ${statusBg}`}
                                        >
                                            {program.status_program}
                                        </div>
                                    )}
                                </div>
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
                            </div>
                            <div className="flex items-center mt-4 space-x-2">
                                <Building className='h-5 w-5 text-[#3A786D]' />
                                <p className='text-[#3A786D] font-semibold'>Masjid Salman</p>
                            </div>
                            <div className="flex items-center space-x-2 ">
                                <User className='h-5 w-5 text-gray-500' />
                                <p className='text-gray-500 font-semibold'> Dibuat oleh {String(program?.created_by ?? "Editor")}</p>
                            </div>
                        </div>

                        <Table className="border border-t-0 border-l-0 border-r-0 last:border-b-0 my-6 w-full">
                            <TableBody>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Deskripsi Program</TableHead>
                                    <TableCell className="w-full break-words">
                                        {isEditing ? (
                                            <Textarea
                                                value={editedProgram?.deskripsi_program}
                                                onChange={(e) => handleChange("deskripsi_program", e.target.value)}
                                                className="w-full min-h-[120px]"
                                            />
                                        ) : (
                                            <div className="whitespace-pre-wrap">{String(program?.deskripsi_program)}</div>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Pilar Program</TableHead>
                                    <TableCell className="w-full break-words">
                                        {isEditing ? (
                                            <div className="grid grid-cols-1 max-h-[300px] overflow-y-auto p-2">
                                                {pilarOptions.map((pilar) => (
                                                    <div key={pilar.name} className="flex items-center space-x-2 py-1">
                                                        <Checkbox
                                                            id={`pilar-${pilar.name}`}
                                                            checked={
                                                                Array.isArray(editedProgram?.pilar_program)
                                                                    ? editedProgram.pilar_program.includes(pilar.name)
                                                                    : false
                                                            }
                                                            onCheckedChange={(checked) => {
                                                                const currentPilars = Array.isArray(editedProgram?.pilar_program)
                                                                    ? editedProgram.pilar_program
                                                                    : [];

                                                                const newPilars = checked
                                                                    ? [...currentPilars, pilar.name]
                                                                    : currentPilars.filter(p => p !== pilar.name);
                                                                console.log("current pillars", currentPilars)
                                                                setEditedProgram(prev => {
                                                                    if (!prev) {
                                                                        return null;
                                                                    }

                                                                    return {
                                                                        ...prev,
                                                                        pilar_program: newPilars,
                                                                    };
                                                                });
                                                            }}
                                                        />
                                                        <Label
                                                            htmlFor={`pilar-${pilar.name}`}
                                                            className="text-sm font-normal"
                                                        >
                                                            {pilar.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="whitespace-pre-wrap">
                                                {Array.isArray(program?.pilar_program)
                                                    ? program.pilar_program.join(', ')
                                                    : String(program?.pilar_program)}
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Kriteria Program</TableHead>
                                    <TableCell className="w-full break-words">
                                        <div className="flex items-center space-x-2 w-full">
                                            {isEditing ? (
                                                <Input
                                                    value={editedProgram?.kriteria_program}
                                                    onChange={(e) => handleChange("kriteria_program", e.target.value)}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap">{String(program?.kriteria_program)}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Tanggal Mulai</TableHead>
                                    <TableCell className="w-full">
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedProgram?.waktu_mulai}
                                                onChange={(e) => handleChange("waktu_mulai", e.target.value)}
                                                className="w-full md:w-auto"
                                            />
                                        ) : (
                                            String(program?.waktu_mulai)
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Tanggal Selesai</TableHead>
                                    <TableCell className="w-full">
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedProgram?.waktu_selesai}
                                                onChange={(e) => handleChange("waktu_selesai", e.target.value)}
                                                className="w-full md:w-auto"
                                            />
                                        ) : (
                                            String(program?.waktu_selesai)
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Rancangan Anggaran</TableHead>
                                    <TableCell className="w-full break-words">
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                value={editedProgram?.rancangan_anggaran}
                                                onChange={(e) => handleChange("rancangan_anggaran", parseInt(e.target.value) || 0)}
                                                className="w-full md:w-auto"
                                            />
                                        ) : (
                                            <span>
                                                Rp{String(program?.rancangan_anggaran?.toLocaleString() ?? "0")}
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow className="flex flex-col md:table-row">
                                    <TableHead className="w-full md:w-1/4 py-3">Aktualisasi Anggaran</TableHead>
                                    <TableCell className="w-full break-words">
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
                            ) : kegiatanList.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Tidak terdapat kegiatan untuk program ini.</p>
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
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default DetailProgram;