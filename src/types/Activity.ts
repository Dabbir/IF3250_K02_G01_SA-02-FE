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
