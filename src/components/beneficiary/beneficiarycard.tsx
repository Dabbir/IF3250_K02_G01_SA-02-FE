import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Phone, Mail, Pencil, Share2, Trash2 } from "lucide-react";
import type { Beneficiary } from "@/types/beneficiary";

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  onNavigate: (id: string) => void;
  onShare: (beneficiary: Beneficiary, e: React.MouseEvent) => void;
  onDelete: (beneficiary: Beneficiary, e: React.MouseEvent) => void;
}

export default function BeneficiaryCard({
  beneficiary,
  onNavigate,
  onShare,
  onDelete,
}: BeneficiaryCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition cursor-pointer"
      onClick={() => onNavigate(beneficiary.id)}
    >
      <div className="w-full h-50 bg-slate-100 overflow-hidden">
        {beneficiary.foto ? (
          <img
            src={beneficiary.foto}
            alt={beneficiary.nama_instansi}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Building className="h-16 w-16 text-slate-300" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[var(--blue)] truncate pr-2 text-base">
            {beneficiary.nama_instansi}
          </h3>
        </div>

        {beneficiary.nama_kontak && (
          <p className="text-sm mt-2 text-gray-700">{beneficiary.nama_kontak}</p>
        )}

        <div className="mt-3 space-y-2">
          {beneficiary.telepon && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-3.5 w-3.5 mr-2" />
              <span className="truncate">{beneficiary.telepon}</span>
            </div>
          )}
          {beneficiary.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-3.5 w-3.5 mr-2" />
              <span className="truncate">{beneficiary.email}</span>
            </div>
          )}
        </div>

        <div className="flex mt-4 pt-3 border-t border-gray-100 justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(beneficiary.id);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="ml-1 text-xs">Edit</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-green-500 hover:text-green-700 hover:bg-green-50 p-1"
            onClick={(e) => onShare(beneficiary, e)}
          >
            <Share2 className="h-4 w-4" />
            <span className="ml-1 text-xs">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
            onClick={(e) => onDelete(beneficiary, e)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-1 text-xs">Hapus</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}