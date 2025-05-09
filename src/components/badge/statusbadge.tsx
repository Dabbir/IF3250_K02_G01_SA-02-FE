import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    let color = "";

    switch (status.toLowerCase()) {
        case "belum mulai":
            color = "bg-slate-100 text-slate-700 border border-slate-200";
            break;
        case "berjalan":
            color = "bg-amber-50 text-amber-700 border border-amber-200";
            break;
        case "selesai":
            color = "bg-emerald-50 text-emerald-700 border border-emerald-200";
            break;
        default:
            color = "bg-gray-100 text-gray-700 border border-gray-200";
    }

    return (
        <Badge className={`px-3 py-1 text-xs font-medium rounded-md min-w-[90px] text-center ${color}`}>
            {status}
        </Badge>
    );
}
