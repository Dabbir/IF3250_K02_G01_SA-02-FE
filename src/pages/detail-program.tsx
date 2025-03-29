import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const dataKegiatan: Kegiatan[] = Array.from({ length: 5 }, (_, i) => ({
    idKegiatan: `${i}`,
    namaKegiatan: "Kegiatan",
    tanggalMulai: "2020-05-30",
    tanggalSelesai: "2020-05-30",
    status: "Finished",
    biayaImplementasi: '3000000',
    deskripsi: "Kegiatan baru"
}));


const DetailProgram = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [program, setProgram] = useState<Program | null>(null);
    const [editedProgram, setEditedProgram] = useState<Program | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
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
                    created_at:"2025-03-20 17:01:01",
                    updated_at: "2025-03-20 17:01:01",
                    
                });
                setLoading(false);
            }, 1000);
    }, [id]);

    const handleChange = (field: keyof Program, value: string | number) => {
        setEditedProgram((prev) => ({ ...prev!, [field]: value }));
    };

    return (
        <Card className="mx-auto mt-6 max-w-[70rem] p-6">
            <CardHeader>
                <div className='justify-between items-top flex'>
                    <div className="flex items-center space-x-2">
                        <ArrowLeft className="h-6 w-6 text-slate-700" />
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
                
                <div className='space-y-2'>
                    <div className="flex justify-between align-middle">
                        <h1 className="text-3xl font-semibold">{String(program?.nama_program ?? "Program Masjid")}</h1>
                        <div className="mt-2 flex justify-center items-center font-semibold w-20 h-8 md:w-22 md:h-10 rounded-2xl md:rounded-3xl text-sm md:text-base text-white bg-[#ECA72C]">
                            Berjalan
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
                                    <Input
                                        value={program?.deskripsi_program}
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
                                        value={program?.pilar_program}
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
                                            value={program?.kriteria_program}
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
                                        value={program?.waktu_mulai}
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
                                    <Textarea
                                        value={program?.waktu_selesai}
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
                                    <Textarea
                                        value={program?.rancangan_anggaran}
                                        onChange={(e) => handleChange("rancangan_anggaran", e.target.value)}
                                    />
                                ) : (
                                    <span>
                                        Rp<span>{String(program?.rancangan_anggaran?? "0")}</span>
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>Aktualisasi Anggaran</TableHead>
                            <TableCell>
                                {isEditing ? (
                                    <Textarea
                                        value={program?.aktualisasi_anggaran}
                                        onChange={(e) => handleChange("aktualisasi_anggaran", e.target.value)}
                                    />
                                ) : (
                                    <span>
                                        Rp<span>{String(program?.aktualisasi_anggaran ?? "0")}</span>
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 border border-gray-200 rounded-lg  dark:border-neutral-700 space-y-3">
                            <Banknote/>
                            <div>
                                <p className="font-semibold text-sm text-gray-800 dark:text-neutral-200">Rancangan Anggaran</p>
                                <p className="mt-1 text-xl text-[var(--blue)] dark:text-neutral-400">Rp30.000.000,00</p>
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-gray-800 dark:text-neutral-200">Aktualisasi Anggaran</p>
                                <p className="mt-1 text-xl text-[var(--blue)] dark:text-neutral-400">Rp20.000.000,00</p>
                            </div>

                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg dark:border-neutral-700 space-y-3">
                            <HandCoins/>
                            <div>
                                <p className="font-semibold text-sm text-gray-800 dark:text-neutral-200">Penerima Manfaat</p>
                                <ul className="mt-1 text-sm text-gray-600 dark:text-neutral-400 list-disc list-inside">
                                    <li>Masyarakat Umum</li>
                                    <li>Mahasiswa ITB</li>
                                    <li>Yayasan Salman</li>
                                    <li>Pegawai ITB</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="my-6 space-y-3">
                    <h1 className="text-2xl">Kegiatan Program</h1>
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
                        {dataKegiatan.map((item, index) => (
                            <TableRow
                            key={index}
                            className="border-b cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => {
                                navigate(`/kegiatan/1`);
                            }}
                            >
                            <TableCell className="pl-7 truncate max-w-[180px]">{item.namaKegiatan}</TableCell>
                            <TableCell className="text-center truncate">{item.tanggalMulai}</TableCell>
                            <TableCell className="text-center truncate">{item.tanggalSelesai}</TableCell>
                            <TableCell className="text-center truncate">{item.status}</TableCell>
                            <TableCell className="text-left truncate max-w-[180px]">Rp{item.biayaImplementasi}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default DetailProgram