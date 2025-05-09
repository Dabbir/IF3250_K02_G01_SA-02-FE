import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
  } from "@/components/ui/select";
  
  interface TrainingStatusFilterProps {
    status: string;
    onChange: (value: string) => void;
  }
  
  const TrainingStatusFilter: React.FC<TrainingStatusFilterProps> = ({ status, onChange }) => {
    return (
      <div className="w-full md:w-1/3">
        <Select value={status} onValueChange={onChange}>
          <SelectTrigger className="w-full max-md:h-8 max-md:text-[12px]">
            <SelectValue placeholder="Filter berdasarkan status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Semua Status</SelectItem>
            <SelectItem value="Upcoming">Upcoming</SelectItem>
            <SelectItem value="Ongoing">Ongoing</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };
  
  export default TrainingStatusFilter;