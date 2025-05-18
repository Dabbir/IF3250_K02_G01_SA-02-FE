import type { Beneficiary } from "@/types/beneficiary";

export const shareToWhatsApp = (beneficiary: Beneficiary) => {
  const shareText = `*Detail Penerima Manfaat*\n\n` +
    `*Nama Instansi:* ${beneficiary.nama_instansi}\n` +
    `*Nama Kontak:* ${beneficiary.nama_kontak || 'Tidak Tersedia'}\n` +
    `*Alamat:* ${beneficiary.alamat || 'Tidak Tersedia'}\n` +
    `*Telepon:* ${beneficiary.telepon || 'Tidak Tersedia'}\n` +
    `*Email:* ${beneficiary.email || 'Tidak Tersedia'}\n`;

  const encodedText = encodeURIComponent(shareText);
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;

  window.open(whatsappUrl, '_blank');
};