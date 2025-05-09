export interface Program {
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

export const STATUS_OPTIONS = ["Belum Mulai", "Berjalan", "Selesai"];

export interface SortControlsProps {
    sortBy: keyof Program;
    sortOrder: "ASC" | "DESC";
    onSortByChange: (val: keyof Program) => void;
    onSortOrderToggle: () => void;
}

export interface userData {
    id: number;
    masjid_id: number;
}