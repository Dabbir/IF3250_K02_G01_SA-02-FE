import type { Stakeholder } from "@/types/stakeholder"

export function validateStakeholderForm(stakeholder: Partial<Stakeholder>): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!stakeholder.nama_stakeholder?.trim()) {
        errors.nama_stakeholder = "Nama pemangku kepentingan wajib diisi!"
    }

    if (!stakeholder.jenis?.trim()) {
        errors.jenis = "Jenis pemangku kepentingan wajib diisi!"
    }

    if (!stakeholder.telepon?.trim()) {
        errors.telepon = "Telepon wajib diisi!"
    } else if (!/^\d{10,15}$/.test(stakeholder.telepon)) {
        errors.telepon = "Nomor telepon harus berupa angka (10–15 digit)!"
    }

    if (!stakeholder.email?.trim()) {
        errors.email = "Email tidak boleh kosong!"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stakeholder.email)) {
        errors.email = "Format email tidak valid!"
    }

    return errors
}
