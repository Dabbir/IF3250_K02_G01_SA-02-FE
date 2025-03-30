import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface CardProgramProps {
    program: Program;
    onClick: () => void;
    onDelete: (programId: number) => Promise<boolean>;
}

interface Program {
    id: number;
    nama_program: string;
    deskripsi_program: string;
    pilar_program: string[];
    kriteria_program: string;
    waktu_mulai: string;
    waktu_selesai: string;
    rancangan_anggaran: number;
    aktualisasi_anggaran: number;
    status_program: "Berjalan" | "Selesai";
    masjid_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return ""
    };

    const month = date.toLocaleString("id-ID", { month: "short" }); 
    const year = date.getFullYear().toString();

    return `${month} ${year}`;
};

const CardProgram: React.FC<CardProgramProps> = ({ program, onClick, onDelete }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const success = await onDelete(program.id);
            
            if (success) {
                toast.success(`Program "${program.nama_program}" berhasil dihapus`);
            } else {
                toast.error("Gagal menghapus program");
            }
        } catch (error) {
            console.error("Error deleting program:", error);
            toast.error("Terjadi kesalahan saat menghapus program");
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    return (
        <>
            <div className="flex justify-between hover:scale-101" onClick={onClick}>
                <div className="group flex flex-col h-full bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                    
                    <div className="h-52 flex justify-center items-center">
                        <img
                            src="/logo-white.svg"
                            className="w-full h-full object-cover rounded-t-xl"
                            alt="Program Logo"
                        />
                    </div>
                    <div className="p-6 md:p-8">
                        <div>

                                <p className="mb-1 text-xs font-semibold uppercase text-gray-500 dark:text-blue-500">
                                    {formatDate(program.waktu_mulai)} - {formatDate(program.waktu_selesai)}
                                </p>
                                <h3 className="cursor-default text-2xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                                    {program.nama_program}
                                </h3>
                                <div className={`mt-2 flex justify-center items-center font-semibold w-20 h-8 rounded-xl md:rounded-2xl text-xs md:text-sm text-white ${
                                    program.status_program === "Berjalan" ? "bg-[#ECA72C]" : "bg-[#3A786D]"
                                }`}>
                                    {program.status_program}
                                </div>
                        </div>

                        <p className="mt-2 text-gray-500 dark:text-neutral-500">
                            {program.deskripsi_program}
                        </p>
                    </div>

                    <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                        <button className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-[#3A786D] shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                        Ubah
                        </button>
                        <button 
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-[#804E49] shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                setShowDeleteDialog(true);
                        }}>
                        Hapus
                        </button>
                    </div>
                </div>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Program</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus program "{program.nama_program}"? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-between sm:justify-between mt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                                    Menghapus...
                                </>
                            ) : "Hapus Program"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CardProgram;