export interface Publikasi {
  id: string;
  judul: string;
  media: "Televisi" | "Koran" | "Radio" | "Media Online" | "Sosial Media" | "Lainnya";
  perusahaan: string;
  tanggal: string;
  link: string;
  prValue: number;
  nama_program?: string;
  nama_aktivitas?: string;
  program_id?: string;  
  aktivitas_id?: string; 
  tone: "Positif" | "Netral" | "Negatif";
  created_at?: string;
  updated_at?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  media: string[];
  programs: Array<{ id: string; nama_program: string }>;
  activities: Array<{ id: string; nama_aktivitas: string }>;
  tones: string[];
}

export interface ValidationErrors {
  judul?: string;
  media?: string;
  perusahaan?: string;
  tanggal?: string;
  link?: string;
  prValue?: string;
  tone?: string;
}

export interface Program {
  id: string;
  nama_program: string;
}

export interface Aktivitas {
  id: string;
  nama_aktivitas: string;
}

export const TONE_OPTIONS = ["Positif", "Netral", "Negatif"] as const;
export const MEDIA_OPTIONS = ["Televisi", "Koran", "Radio", "Media Online", "Sosial Media", "Lainnya"] as const;