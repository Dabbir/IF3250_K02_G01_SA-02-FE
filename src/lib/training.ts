export interface Training {
    id: string;
    nama_pelatihan: string;
    deskripsi?: string;
    waktu_mulai: string;
    waktu_akhir: string;
    lokasi: string;
    kuota: number;
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
    masjid_id: number;
    created_by?: number;
    created_at?: string;
    updated_at?: string;
    nama_masjid?: string;
    created_by_name?: string;
  }
  
  export interface Participant {
    id: string;
    pelatihan_id: string;
    pengguna_id: string;
    status_pendaftaran: 'Pending' | 'Approved' | 'Rejected' | 'Attended';
    masjid_id: number;
    catatan?: string;
    created_at?: string;
    updated_at?: string;
    nama_peserta?: string;
    email?: string;
    no_telepon?: string;
  }
  
  export interface TrainingAvailability {
    total_kuota: number;
    used_slots: number;
    available_slots: number;
  }
  
  export interface TrainingForm {
    nama_pelatihan: string;
    deskripsi: string;
    waktu_mulai: string;
    waktu_akhir: string;
    lokasi: string;
    kuota: number;
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
    masjid_id: number;
  }