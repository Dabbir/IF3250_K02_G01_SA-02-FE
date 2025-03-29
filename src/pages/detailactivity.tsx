import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Pencil, Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

interface Kegiatan {
    id: string;
    nama_aktivitas: string;
    program_id: string;
    nama_program?: string;
    deskripsi?: string;
    dokumentasi?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    biaya_implementasi?: number;
    status: "Unstarted" | "Ongoing" | "Finished";
    created_at?: string;
    updated_at?: string;
}

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function DetailKegiatan() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [kegiatan, setKegiatan] = useState<Kegiatan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedKegiatan, setEditedKegiatan] = useState<Kegiatan | null>(null);

    useEffect(() => {
        const fetchActivityDetail = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                
                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await fetch(`${API_URL}/api/activity/getactivity/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch activity: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.success) {
                    setKegiatan(data.activity);
                    setEditedKegiatan(data.activity);
                } else {
                    throw new Error(data.message || "Failed to fetch activity");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                toast.error("Failed to load activity details");
            } finally {
                console.log("udah")
                setLoading(false);
            }
        };

        if (id) {
            fetchActivityDetail();
        }
    }, [id]);

    const getDokumentasiList = (dokumentasi?: string): string[] => {
        if (!dokumentasi) return [];
        
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(dokumentasi);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (error) {
          // If parsing fails, it might be a single URL string
          return dokumentasi.startsWith('http') ? [dokumentasi] : [];
        }
    };
      
    const dokumentasiList: string[] = getDokumentasiList(kegiatan?.dokumentasi);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            setIsEditing(false);
            toast.success("Activity updated successfully");
        } catch (error) {
            toast.error("Failed to update activity");
        }
    };

    const handleChange = (field: keyof Kegiatan, value: string | number) => {
        setEditedKegiatan((prev) => prev ? ({ ...prev, [field]: value }) : null);
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
        
        if (editedKegiatan) {
            setEditedKegiatan({
                ...editedKegiatan,
                nama_program: program
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (
            !inputRef.current?.contains(e.relatedTarget) &&
            !dropdownRef.current?.contains(e.relatedTarget)
        ) {
            setShowDropdown(false);
        }
    };

    const handleGoBack = () => {
        navigate('/kegiatan');
    };

    if (loading) {
        return (
            <div className="m-5">
                <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-auto">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-0 mr-2"
                                onClick={handleGoBack}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <Leaf className="h-6 w-6 text-slate-700" />
                            <CardTitle>Detail Kegiatan</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !kegiatan) {
        return (
            <div className="m-5">
                <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-auto">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-0 mr-2"
                                onClick={handleGoBack}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <Leaf className="h-6 w-6 text-slate-700" />
                            <CardTitle>Detail Kegiatan</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-[400px]">
                        <div className="text-center">
                            <p className="text-red-500 mb-4">{error || "Activity not found"}</p>
                            <Button 
                                onClick={() => window.location.reload()} 
                                className="bg-[#3A786D] text-white"
                            >
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="m-5">
            <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-auto">
                <CardHeader>
                    <div className="justify-between items-center flex">
                        <div className="flex items-center space-x-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-0 mr-2"
                                onClick={handleGoBack}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
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
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold">{kegiatan.nama_aktivitas}</h1>

                        <div className="flex justify-end mt-4">
                            {!isEditing ? (
                                <Button variant="outline" size="sm" onClick={handleEditClick}>
                                    <Pencil className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" >
                                    <Save className="h-4 w-4 mr-2" onClick={handleSaveClick}/> Simpan
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
                                                    value={programTerafiliasi || editedKegiatan?.nama_program || ''}
                                                    onChange={handleInputChangeProgram}
                                                    onFocus={() => setShowDropdown(true)}
                                                    placeholder={kegiatan.nama_program || "Pilih Program"}
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
                                            kegiatan.nama_program || "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Tanggal Mulai</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedKegiatan?.tanggal_mulai ? new Date(editedKegiatan.tanggal_mulai).toISOString().split('T')[0] : ''}
                                                onChange={(e) => handleChange("tanggal_mulai", e.target.value)}
                                            />
                                        ) : (
                                            kegiatan.tanggal_mulai ? new Date(kegiatan.tanggal_mulai).toLocaleDateString('id-ID') : "N/A"
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Tanggal Selesai</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={editedKegiatan?.tanggal_selesai ? new Date(editedKegiatan.tanggal_selesai).toISOString().split('T')[0] : ''}
                                                onChange={(e) => handleChange("tanggal_selesai", e.target.value)}
                                            />
                                        ) : (
                                            kegiatan.tanggal_selesai ? new Date(kegiatan.tanggal_selesai).toLocaleDateString('id-ID') : "N/A"
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
                                                    type="number"
                                                    value={editedKegiatan?.biaya_implementasi || 0}
                                                    onChange={(e) => handleChange("biaya_implementasi", Number(e.target.value))}
                                                />
                                            ) : (
                                                kegiatan.biaya_implementasi ? kegiatan.biaya_implementasi.toLocaleString('id-ID') : "0"
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <select
                                                value={editedKegiatan?.status || "Unstarted"}
                                                onChange={(e) => handleChange("status", e.target.value as "Unstarted" | "Ongoing" | "Finished")}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="Unstarted">Unstarted</option>
                                                <option value="Ongoing">Ongoing</option>
                                                <option value="Finished">Finished</option>
                                            </select>
                                        ) : (
                                            kegiatan.status
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableCell>
                                        {isEditing ? (
                                            <Textarea
                                                value={editedKegiatan?.deskripsi || ""}
                                                onChange={(e) => handleChange("deskripsi", e.target.value)}
                                                className="min-h-[100px]"
                                            />
                                        ) : (
                                            kegiatan.deskripsi || "No description available"
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        {dokumentasiList.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-lg font-medium mb-4">Dokumentasi</h2>
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
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}