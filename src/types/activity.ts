export interface StakeholderActivity {
  id?: string
  nama_stakeholder: string
  jenis: "Individu" | "Organisasi" | "Perusahaan"
  telepon: string
  email: string
}

export interface BeneficiaryActivity {
  id?: string
  nama_instansi: string
  nama_kontak: string
  telepon: string
  email: string
  alamat: string
}

export interface EmployeeActivity {
  id?: string
  nama: string
  email: string
  telepon: string
  alamat: string
}

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
  id?: string
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
  stakeholders?: StakeholderActivity[]
  penerima_manfaat?: BeneficiaryActivity[]
  karyawan?: EmployeeActivity[]
}

export interface Program {
  id: number
  nama_program: string
}

export type ImageData = {
  url: string
  file: File
}
