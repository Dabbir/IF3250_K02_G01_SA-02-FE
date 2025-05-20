import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Share2, Trash2, Loader2 } from "lucide-react";
import { formatDisplayDate } from "@/utils/dateUtils";
import { formatRupiah } from "@/utils/formatters";
import type { Publikasi } from "@/types/publication";
import ToneBadge from "./tonebadge";

interface PublicationTableProps {
  publikasiList: Publikasi[];
  loading: boolean;
  sortColumn: string;
  onSortChange: (column: string) => void;
  onNavigate: (id: string) => void;
  onShare: (item: Publikasi) => void;
  onDelete: (id: string) => void;
}

export default function PublicationTable({
  publikasiList,
  loading,
  sortColumn,
  onSortChange,
  onNavigate,
  onShare,
  onDelete,
}: PublicationTableProps) {
  const SortableHeader = ({ column, label }: { column: string; label: string }) => (
    <TableHead
      className={`cursor-pointer ${column === 'judul' ? 'pl-7 w-[200px]' : column === 'tanggal' ? 'w-[120px] text-center' : column === 'prValue' ? 'w-[150px]' : column === 'tone' ? 'w-[120px] text-center' : 'w-[180px]'}`}
      onClick={() => onSortChange(column)}
    >
      <div className={`flex items-center ${column === 'tanggal' || column === 'tone' ? 'justify-center' : ''}`}>
        {label}
        {sortColumn === column && (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <SortableHeader column="judul" label="Judul Publikasi" />
            <SortableHeader column="tanggal" label="Tanggal" />
            <TableHead className="w-[180px]">
              <div className="flex items-center">
                Link
              </div>
            </TableHead>
            <SortableHeader column="prValue" label="PR Value" />
            <SortableHeader column="tone" label="Tone" />
            <TableHead className="w-[140px] text-right pr-9">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : (
            publikasiList.map((item) => (
              <TableRow
                key={item.id}
                className="border-b cursor-pointer hover:bg-gray-100 transition"
                onClick={() => onNavigate(item.id)}
              >
                <TableCell className="pl-7 truncate max-w-[180px]">{item.judul}</TableCell>
                <TableCell className="text-center truncate">
                  {formatDisplayDate(item.tanggal)}
                </TableCell>
                <TableCell className="truncate max-w-[180px]">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.link.length > 25 ? `${item.link.substring(0, 25)}...` : item.link}
                  </a>
                </TableCell>
                <TableCell className="text-left truncate max-w-[180px]">
                  Rp{formatRupiah(item.prValue)}
                </TableCell>
                <TableCell className="text-center">
                  <ToneBadge tone={item.tone} />
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-200 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(item.id);
                      }}
                    >
                      <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-green-100 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(item);
                      }}
                    >
                      <Share2 className="w-4 h-4 text-green-500 hover:text-green-700" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-red-100 transition cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}