import { Badge } from "@/components/ui/badge";

interface ToneBadgeProps {
  tone: string;
}

export default function ToneBadge({ tone }: ToneBadgeProps) {
  let color = "";

  switch (tone) {
    case "Positif":
      color = "bg-emerald-50 text-emerald-700 border border-emerald-200";
      break;
    case "Netral":
      color = "bg-blue-50 text-blue-700 border border-blue-200";
      break;
    case "Negatif":
      color = "bg-red-50 text-red-700 border border-red-200";
      break;
    default:
      color = "bg-gray-100 text-gray-700 border border-gray-200";
  }

  return (
    <Badge className={`px-3 py-1 text-xs font-medium rounded-md min-w-[90px] text-center ${color}`}>
      {tone}
    </Badge>
  );
}