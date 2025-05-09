import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { SortControlsProps } from "@/types/employee";

const EmployeeSortControls: React.FC<SortControlsProps> = ({
    sortBy,
    sortOrder,
    onSortByChange,
    onSortOrderToggle,
}) => (
    <div className="flex items-center space-x-1">
        <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="h-8 px-2 flex items-center space-x-1 text-sm">
                <ArrowUpDown className="w-4 h-4" />
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="w-32 py-1">
                <SelectItem value="nama" className="px-2 py-1 text-sm">Nama Karyawan</SelectItem>
                <SelectItem value="created_at" className="px-2 py-1 text-sm">Waktu Unggah</SelectItem>
            </SelectContent>
        </Select>

        <button
            onClick={onSortOrderToggle}
            className="h-8 w-8 flex items-center justify-center border rounded text-sm"
            aria-label="Toggle sort order"
        >
            {sortOrder === "ASC" ? (
                <ArrowUp className="w-4 h-4" />
            ) : (
                <ArrowDown className="w-4 h-4" />
            )}
        </button>
    </div>
);

export default EmployeeSortControls;
