import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Pencil, Share2, Trash2 } from "lucide-react";
import { formatDisplayDate } from "@/utils/dateUtils";
import { formatRupiah } from "@/utils/formatters";
import type { Publikasi } from "@/types/publication";
import ToneBadge from "./tonebadge";

interface MobilePublicationCardProps {
  item: Publikasi;
  onNavigate: (id: string) => void;
  onShare: (item: Publikasi) => void;
  onDelete: (id: string) => void;
}

export default function MobilePublicationCard({
  item,
  onNavigate,
  onShare,
  onDelete,
}: MobilePublicationCardProps) {
  return (
    <div
      className="border rounded-lg p-4 space-y-3 bg-white"
      onClick={() => onNavigate(item.id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-[var(--blue)] truncate pr-2">{item.judul}</h3>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[30vh] rounded-t-xl">
            <div className="grid gap-4 py-4">
              <Button
                className="w-full flex justify-start items-center space-x-2 bg-transparent text-blue-500 hover:bg-blue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(item.id);
                }}
              >
                <Pencil className="h-4 w-4" />
                <span>Edit Publikasi</span>
              </Button>
              <Button
                className="w-full flex justify-start items-center space-x-2 bg-transparent text-green-500 hover:bg-green-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(item);
                }}
              >
                <Share2 className="h-4 w-4" />
                <span>Bagikan ke WhatsApp</span>
              </Button>
              <Button
                className="w-full flex justify-start items-center space-x-2 bg-transparent text-red-500 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span>Hapus Publikasi</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="space-y-4">
          <div>
            <span className="block text-gray-500 text-xs">Tanggal</span>
            <span className="text-[12px]">
              {formatDisplayDate(item.tanggal)}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 text-xs">Tone</span>
            <ToneBadge tone={item.tone} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="block text-gray-500 text-xs">Media</span>
            <span className="text-[12px]">
              {item.media}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 text-xs">PR Value</span>
            <span className="font-medium">Rp{formatRupiah(item.prValue)}</span>
          </div>
        </div>
      </div>

      <div>
        <span className="block text-gray-500 text-xs">Link</span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm truncate block"
          onClick={(e) => e.stopPropagation()}
        >
          {item.link.length > 40 ? `${item.link.substring(0, 40)}...` : item.link}
        </a>
      </div>
    </div>
  );
}