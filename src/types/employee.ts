export interface Employee {
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

export interface userData {
    id: number;
    masjid_id: number;
}

export interface SortControlsProps {
    sortBy: string;
    sortOrder: "ASC" | "DESC";
    onSortByChange: (val: string) => void;
    onSortOrderToggle: () => void;
}