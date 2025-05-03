import type { Kegiatan } from "@/types/Activity"
import { formatDisplayDate, formatRupiah } from "./formatters"

export const shareToWhatsApp = (activity: Kegiatan) => {
    const tanggalMulai = formatDisplayDate(activity.tanggal_mulai)
    const tanggalSelesai = formatDisplayDate(activity.tanggal_selesai)

    const shareText =
        `*Detail Kegiatan*\n\n` +
        `*Nama Kegiatan:* ${activity.nama_aktivitas}\n` +
        `*Tanggal Mulai:* ${tanggalMulai}\n` +
        `*Tanggal Selesai:* ${tanggalSelesai}\n` +
        `*Status:* ${activity.status}\n` +
        `*Biaya Implementasi:* Rp${formatRupiah(activity.biaya_implementasi)}\n` +
        (activity.deskripsi ? `*Deskripsi:* ${activity.deskripsi}\n` : "")

    const encodedText = encodeURIComponent(shareText)
    const whatsappUrl = `https://wa.me/?text=${encodedText}`

    window.open(whatsappUrl, "_blank")
}
