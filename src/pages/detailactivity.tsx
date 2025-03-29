import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, Pencil, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Kegiatan {
    id: number;
    nama_aktivitas: string;
    nama_program: string;
    deskripsi?: string;
    dokumentasi?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    biaya_implementasi?: number;
    status: "Unstarted" | "Ongoing" | "Finished";
    created_at?: string;
    updated_at?: string;
}

export default function DetailKegiatan() {
    const { id } = useParams<{ id: string }>();
    const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedKegiatan, setEditedKegiatan] = useState<Kegiatan | null>(null);

    useEffect(() => {
        // Simulasi Fetch Data
        setTimeout(() => {
            setKegiatan({
                id: Number(id),
                nama_aktivitas: "Nama Kegiatan",
                nama_program: "Nama Program",
                deskripsi: "Ini adalah deskripsi lorem ipsum dolor sit amet",
                dokumentasi: `["http://localhost:3000/uploads/dokumentasi1.jpg","http://localhost:3000/uploads/dokumentasi2.jpg", "http://localhost:3000/uploads/dokumentasi1.jpg","http://localhost:3000/uploads/dokumentasi2.jpg", "http://localhost:3000/uploads/dokumentasi1.jpg","http://localhost:3000/uploads/dokumentasi2.jpg"]`,
                tanggal_mulai: "2025-03-20",
                tanggal_selesai: "2025-03-25",
                biaya_implementasi: 5000000.0,
                status: "Ongoing",
                created_at: "2025-03-24 16:45:49",
                updated_at: "2025-03-24 16:45:49",
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    const dokumentasiList: string[] = kegiatan?.dokumentasi ? JSON.parse(kegiatan.dokumentasi) : [];

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setKegiatan(editedKegiatan);
        setIsEditing(false);
        console.log(kegiatan)
    };

    const handleChange = (field: keyof Kegiatan, value: string | number) => {
        setEditedKegiatan((prev) => ({ ...prev!, [field]: value }));
    };

    const [programTerafiliasi, setProgramTerafiliasi] = useState("");
    const [filteredPrograms, setFilteredPrograms] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const programs = Array.from({ length: 100 }, (_, i) => `Program ${i + 1}`);

    const handleInputChangeProgram = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProgramTerafiliasi(value);
        if (value.trim() === "") {
            setFilteredPrograms([]);
        } else {
            const filtered = programs.filter((p) =>
                p.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredPrograms(filtered);
        }
        setShowDropdown(true);
    };

    const handleSelectProgram = (program: string) => {
        setProgramTerafiliasi(program);
        setShowDropdown(false);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (
            !inputRef.current?.contains(e.relatedTarget) &&
            !dropdownRef.current?.contains(e.relatedTarget)
        ) {
            setShowDropdown(false);
        }
    };

    return (
        <div className="m-5">
            <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-auto">
                <CardHeader>
                    <div className="justify-between items-top flex">
                        <div className="flex items-center space-x-2">
                            <Leaf className="h-6 w-6 text-slate-700" />
                            <CardTitle>Detail Kegiatan</CardTitle>
                        </div>
                        <div className="flex flex-col text-xs space-y-2 text-right text-gray-700">
                            <p>
                                <strong>Created At:</strong>{" "}
                                {kegiatan?.created_at ? new Date(kegiatan.created_at).toLocaleString() : "N/A"}
                            </p>
                            <p>
                                <strong>Updated At:</strong>{" "}
                                {kegiatan?.updated_at ? new Date(kegiatan.updated_at).toLocaleString() : "N/A"}
                            </p>
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="py-10">
                    {loading ? (
                        <Skeleton className="h-40 w-full" />
                    ) : kegiatan ? (
                        <div className="space-y-4">
                            <h1 className="text-xl font-bold">{kegiatan.nama_aktivitas}</h1>

                            <div className="flex justify-end mt-4">
                                {!isEditing ? (
                                    <Button variant="outline" size="sm" onClick={handleEditClick}>
                                        <Pencil className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={handleSaveClick}>
                                        <Save className="h-4 w-4 mr-2" /> Simpan
                                    </Button>
                                )}
                            </div>

                            <Table className="border rounded-lg overflow-hidden mb-2">
                                <TableBody>
                                    <TableRow>
                                        <TableHead>Program Terafiliasi</TableHead>
                                        <TableCell className="relative" onBlur={handleBlur}>
                                            {isEditing ? (
                                                <>
                                                    <Input
                                                        id="programTerafiliasi"
                                                        ref={inputRef}
                                                        value={programTerafiliasi}
                                                        onChange={handleInputChangeProgram}
                                                        onFocus={() => setShowDropdown(true)}
                                                        placeholder={kegiatan.nama_program}
                                                        className="w-full"
                                                    />
                                                    {showDropdown && (
                                                        <div
                                                            ref={dropdownRef}
                                                            className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-auto"
                                                        >
                                                            {filteredPrograms.length > 0
                                                                ? filteredPrograms.map((program) => (
                                                                    <div
                                                                        key={program}
                                                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                        onClick={() => handleSelectProgram(program)}
                                                                    >
                                                                        {program}
                                                                    </div>
                                                                ))
                                                                : programs.map((program) => (
                                                                    <div
                                                                        key={program}
                                                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                        onClick={() => handleSelectProgram(program)}
                                                                    >
                                                                        {program}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                String(kegiatan.nama_program)
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Tanggal Mulai</TableHead>
                                        <TableCell>
                                            {isEditing ? (
                                                <Input
                                                    value={kegiatan.tanggal_mulai}
                                                    onChange={(e) => handleChange("tanggal_mulai", e.target.value)}
                                                />
                                            ) : (
                                                String(kegiatan.tanggal_mulai)
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Tanggal Selesai</TableHead>
                                        <TableCell>
                                            {isEditing ? (
                                                <Input
                                                    value={kegiatan.tanggal_selesai}
                                                    onChange={(e) => handleChange("tanggal_selesai", e.target.value)}
                                                />
                                            ) : (
                                                String(kegiatan.tanggal_selesai)
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Biaya Implementasi</TableHead>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <span>
                                                    Rp.
                                                </span>
                                                {isEditing ? (
                                                    <Input
                                                        value={kegiatan.biaya_implementasi}
                                                        onChange={(e) => handleChange("biaya_implementasi", e.target.value)}
                                                    />
                                                ) : (
                                                    String(kegiatan.biaya_implementasi)
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableCell>
                                            {isEditing ? (
                                                <Input
                                                    value={kegiatan.status}
                                                    onChange={(e) => handleChange("status", e.target.value)}
                                                />
                                            ) : (
                                                String(kegiatan.status)
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableCell>
                                            {isEditing ? (
                                                <Textarea
                                                    value={kegiatan.deskripsi}
                                                    onChange={(e) => handleChange("deskripsi", e.target.value)}
                                                />
                                            ) : (
                                                String(kegiatan.deskripsi)
                                            )}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            {dokumentasiList.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center place-items-center">
                                    {dokumentasiList.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Dokumentasi ${index + 1}`}
                                            className="w-full h-40 object-cover rounded-lg border"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">Data tidak ditemukan.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
