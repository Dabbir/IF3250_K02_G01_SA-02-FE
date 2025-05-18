import { formatDisplayDate } from "@/utils/dateUtils";
import { formatRupiah } from "@/utils/formatters";
import type { Publikasi } from "@/types/publication";

export const shareToWhatsApp = (item: Publikasi) => {
  const formattedDate = formatDisplayDate(item.tanggal);

  const shareText = `*Detail Publikasi*\n\n` +
    `*Judul:* ${item.judul}\n` +
    `*Media:* ${item.media}\n` +
    `*Perusahaan:* ${item.perusahaan}\n` +
    `*Tanggal:* ${formattedDate}\n` +
    `*PR Value:* Rp${formatRupiah(item.prValue)}\n` +
    `*Tone:* ${item.tone}\n` +
    `*Link:* ${item.link}\n` +
    (item.nama_program ? `*Program:* ${item.nama_program}\n` : '') +
    (item.nama_aktivitas ? `*Aktivitas:* ${item.nama_aktivitas}\n` : '');

  const encodedText = encodeURIComponent(shareText);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;

  window.open(whatsappUrl, '_blank');
};