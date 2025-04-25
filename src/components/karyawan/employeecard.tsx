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
  onEdit: () => void;
  onDelete: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, masjidNameParam, onClick, onEdit, onDelete}) => {
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical className='h-5 w-5 text-gray-500' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
              <div className='flex'>
                <Pencil className="h-4 w-4 mr-2 text-blue-500" />
                <span>Edit</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }} 
              className="cursor-pointer text-red-600"
            >
              <div className='flex'>
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                <span>Hapus</span>
              </div>
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default EmployeeCard;