import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Kegiatan } from "@/types/program";
import { toast } from "react-toastify";
import type { Program } from "@/types/program"

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function useDetailProgram() {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [kegiatanLoading, setKegiatanLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProgram, setEditedProgram] = useState<Program | null>(null);
    const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
    const [coverFile,    setCoverFile]    = useState<File|null>(null);
    const [coverPreview, setCoverPreview] = useState<string|null>(null);
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
        created_at:"",
        updated_at: ""
    });

    const statusBg = {
        "Berjalan":    "bg-[#ECA72C]",
        "Selesai": "bg-[#3A786D]",
        "Belum Mulai":   "bg-slate-500",
    }[program.status_program] || "bg-gray-200";

    const STATUS_BG_MAP: Record<Program["status_program"], string> = {
        "Belum Mulai": "bg-slate-500",
        Berjalan:      "bg-[#ECA72C]",
        Selesai:       "bg-[#3A786D]",
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

        const now   = new Date();
        const start = new Date(editedProgram.waktu_mulai);
        const end   = new Date(editedProgram.waktu_selesai);

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
            const headers: Record<string,string> = { Authorization: `Bearer ${token}` };
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

    const handleNavigateDetail = () => {
        if (id) {
            navigate(`/data-program`)
        }
    }

    return {
        loading,
        kegiatanLoading,
        program,
        editedProgram,
        setEditedProgram,
        saving,
        isEditing,
        kegiatanList,
        coverPreview,
        setCoverPreview,
        coverFile,
        setCoverFile,
        statusBg,
        editedStatusBg,
        handleChange,
        handleEditClick,
        handleCancel,
        handleSaveClick,
        handleCoverChange,
        handleNavigateDetail
    }
}