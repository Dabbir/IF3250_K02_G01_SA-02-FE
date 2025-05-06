export interface Kegiatan {
  id?: string
  nama_aktivitas: string
  nama_program: string
  tanggal_mulai: string
  tanggal_selesai: string
  biaya_implementasi: number
  status: string
  deskripsi?: string
}

export const STATUS_OPTIONS = ["Belum Mulai", "Berjalan", "Selesai"]

export interface DetailedKegiatan {
  id: string
  nama_aktivitas: string
  program_id: string
  nama_program: string
  deskripsi: string
  dokumentasi?: string
  tanggal_mulai: string
  tanggal_selesai: string
  biaya_implementasi: number
  status: "Belum Mulai" | "Berjalan" | "Selesai"
  created_at?: string
  updated_at?: string
}

export interface Program {
  id: number
  nama_program: string
}

export type ImageData = {
  url: string
  file: File
}