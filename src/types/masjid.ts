export interface Masjid {
  id: string
  nama_masjid: string
  alamat: string
  created_at?: string
  updated_at?: string
}

export interface MasjidFormData {
  nama_masjid: string
  alamat: string
}
