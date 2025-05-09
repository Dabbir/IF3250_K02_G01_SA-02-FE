export interface UserData {
    namaDepan: string
    namaBelakang: string
    email: string
    alasanBergabung: string
    bio: string
    profileImage?: string
    namaMasjid: string
    alamatMasjid: string
}

export interface FormErrors {
    namaDepan?: string
    email?: string
    alasanBergabung?: string
}

export interface UserResponse {
    success: boolean
    user: {
        nama?: string
        email: string
        alasan_bergabung?: string
        short_bio?: string
        foto_profil?: string
        nama_masjid?: string
        alamat_masjid?: string
    }
}

export interface User {
    id: string
    nama: string
    email: string
    peran: "Viewer" | "Editor" | "Admin"
    status: "Pending" | "Approved" | "Rejected"
    short_bio?: string
    alasan_bergabung?: string
    foto_profil?: string
    masjid_id?: string
    nama_masjid?: string
    dokumen_pendaftaran?: string
    dokumen_file_id?: string
    dokumen_file_name?: string
    dokumen_file_type?: string
    created_at: string
}

export interface UserDataUpdate {
    masjid_id: number | null
    alasan_bergabung: string
    short_bio: string
    dokumen_pendaftaran?: string
    dokumen_file_id?: string
    dokumen_file_name?: string
    dokumen_file_type?: string
}

