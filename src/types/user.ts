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

