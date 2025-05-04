import { utils, writeFile } from "xlsx"
import type { Kegiatan } from "@/types/activity"
import { formatDisplayDate } from "./formatters"

export const exportActivitiesToXlsx = (activities: Kegiatan[]) => {
  if (activities.length === 0) {
    alert("Tidak ada data untuk diekspor.")
    return
  }

  const data = activities.map((activity) => ({
    "Nama Aktivitas": activity.nama_aktivitas,
    "Nama Program": activity.nama_program,
    "Tanggal Mulai": formatDisplayDate(activity.tanggal_mulai),
    "Tanggal Selesai": formatDisplayDate(activity.tanggal_selesai),
    "Biaya Implementasi": activity.biaya_implementasi,
    Status: activity.status,
    Deskripsi: activity.deskripsi,
  }))

  const columnWidths = [
    { wch: 30 }, // Nama Aktivitas
    { wch: 30 }, // Nama Program
    { wch: 15 }, // Tanggal Mulai
    { wch: 15 }, // Tanggal Selesai
    { wch: 20 }, // Biaya Implementasi
    { wch: 15 }, // Status
    { wch: 50 }, // Deskripsi
  ]

  const worksheet = utils.json_to_sheet(data)
  worksheet["!cols"] = columnWidths

  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Kegiatan")

  writeFile(workbook, "Kegiatan.xlsx")
}
