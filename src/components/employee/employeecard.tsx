import React from 'react';
import { Building, Mail, Phone, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Employee {
  id: string;
  nama: string;
  telepon: string;
  alamat: string;
  email: string;
  foto: string;
  masjid_id: string;
  masjid_nama?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface EmployeeCardProps {
  employee: Employee;
  masjidNameParam: string;
  onClick: () => void;
  onDelete: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, masjidNameParam, onClick, onDelete}) => {
  const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };  

  return (
    <div className="w-full flex justify-between" onClick={onClick}>
      <div className="flex items-center gap-x-3">
        <div className="shrink-0">
          <Avatar className="h-16 w-16">
            <AvatarImage src={employee.foto} alt={employee.nama} className='w-full h-full object-cover' />
            <AvatarFallback className="text-lg bg-slate-200 text-slate-700">
              {getInitials(employee.nama)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grow overflow-hidden">
            <h1 className="text-base font-medium text-gray-800 dark:text-neutral-200 truncate">
              {truncateText(employee.nama, 15)}
            </h1>
            <div className="flex items-center space-x-2">
                <Building className='h-3 w-3 flex-shrink-0 text-gray-500'/>
                <p className='text-sm text-gray-500'>{masjidNameParam}</p>
            </div>
            <div className="flex items-center space-x-2">
                <Mail className='h-3 w-3 flex-shrink-0 text-gray-500'/>
                <p className='text-sm text-gray-500'>{truncateText(employee.email,15)}</p>
            </div>
            <div className="flex items-center space-x-2">
                <Phone className='h-3 w-3 flex-shrink-0 text-gray-500'/>
                <p className='text-sm text-gray-500'>{truncateText(employee.telepon, 15)}</p>
            </div>
        </div>
      </div>
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded hover:bg-red-50 transition-colors"
          aria-label="Hapus karyawan"
        >
          <Trash2 className="w-3 h-3 text-red-600 hover:text-red-800 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default EmployeeCard;