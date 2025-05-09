import type { STATUS_OPTIONS } from "@/types/program"

export function getStatusBadge(status: (typeof STATUS_OPTIONS)[number]) {
    const bg = {
        "Belum Mulai": "bg-slate-500",
        Berjalan: "bg-[#ECA72C]",
        Selesai: "bg-[#3A786D]",
    }[status];
    return (
        <span className={`${bg} text-white rounded-full px-2 py-0.5 text-xs`}>
            {status}
        </span>
    );
};
