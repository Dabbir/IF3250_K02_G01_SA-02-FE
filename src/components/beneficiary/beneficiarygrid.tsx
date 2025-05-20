import type { Beneficiary } from "@/types/beneficiary";
import BeneficiaryCard from "./beneficiarycard";

interface BeneficiaryGridProps {
  beneficiaries: Beneficiary[];
  onNavigate: (id: string) => void;
  onShare: (beneficiary: Beneficiary, e: React.MouseEvent) => void;
  onDelete: (beneficiary: Beneficiary, e: React.MouseEvent) => void;
}

export default function BeneficiaryGrid({
  beneficiaries,
  onNavigate,
  onShare,
  onDelete,
}: BeneficiaryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {beneficiaries.map((beneficiary) => (
        <BeneficiaryCard
          key={beneficiary.id}
          beneficiary={beneficiary}
          onNavigate={onNavigate}
          onShare={onShare}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}