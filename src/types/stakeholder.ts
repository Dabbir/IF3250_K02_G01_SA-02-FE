export interface Stakeholder {
  id: string
  nama_stakeholder: string
  jenis: string
  telepon: string
  email: string
  foto: string
  masjid_id: string
  created_by: string
}

export interface StakeholderDetail extends Stakeholder {
  created_at: string
  updated_at: string
}

export const TYPE_OPTIONS = ["Individu", "Organisasi", "Perusahaan"]
