export interface Beneficiary {
  id: string;
  nama_instansi: string;
  nama_kontak: string;
  alamat: string;
  telepon: string;
  email: string;
  foto: string;
  created_at: string;
  updated_at: string;
}

export interface Aktivitas {
  id: string;
  nama: string;
  tanggal: string;
  lokasi: string;
  deskripsi: string;
  foto: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}