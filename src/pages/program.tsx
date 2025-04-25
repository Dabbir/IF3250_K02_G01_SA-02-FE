import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CardProgram from "@/components/ui/card-program";
import { Database, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import ChooseMethodProgram from "@/components/program/chooseMethodProgram";

const API_URL = import.meta.env.VITE_HOST_NAME;

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
    status_program: "Belum Mulai" | "Berjalan" | "Selesai";
    masjid_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
}

interface SortControlsProps {
    sortBy: keyof Program;
    sortOrder: "ASC" | "DESC";
    onSortByChange: (val: keyof Program) => void;
    onSortOrderToggle: () => void;
}

const ITEMS_PER_PAGE = 10;

const Program = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [totalPrograms, setTotalPrograms] = useState(0);
    const [programList, setProgramList] = useState<Program[]>([]);
    const [sortBy, setSortBy]       = useState<keyof Program>("created_at");
    const [sortOrder, setSortOrder] = useState<"ASC"|"DESC">("DESC");

    const fetchPrograms = async (
        page: number,
        searchTerm: string,
        sortField: keyof Program,
        order: "ASC" | "DESC"
    ) => {
        setLoading(true);
        try {
        const token = localStorage.getItem("token");
        const qs = new URLSearchParams({
            page:  page.toString(),
            limit: ITEMS_PER_PAGE.toString(),
            ...(searchTerm && { search: searchTerm }),
            sortBy:    sortField,
            sortOrder: order,
        });
        
        const res  = await fetch(`${API_URL}/api/program?${qs}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { data, total } = await res.json();
        setProgramList(data);
        setTotalPrograms(total);
        } catch (e) {
            console.error(e);
            toast.error("Gagal memuat data program");
        } finally {
            setLoading(false);
        }
      };      
    
    useEffect(() => {
        fetchPrograms(currentPage, search.trim(), sortBy, sortOrder);
    }, [currentPage, search, sortBy, sortOrder]);

    const totalPages = Math.ceil( totalPrograms / ITEMS_PER_PAGE);

    const handleDeleteProgram = async (programId: number): Promise<boolean> => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/program/${programId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Gagal menghapus program");

            const isLastItemOnPage = programList.length === 1 && currentPage > 1;
            const nextPage = isLastItemOnPage ? currentPage - 1 : currentPage;
            setCurrentPage(nextPage);
            fetchPrograms(currentPage, search.trim(), sortBy, sortOrder);
            return true;
        } catch (error) {
            console.error("Error deleting program:", error);
            toast.error("Gagal menghapus program");
            return false;
        }
    };   

    const SortControls: React.FC<SortControlsProps> = ({sortBy, sortOrder, onSortByChange, onSortOrderToggle}) => (
        <div className="flex items-center space-x-1">
          <Select value={sortBy} onValueChange={(v) => onSortByChange(v as keyof Program)}>
            <SelectTrigger className="h-8 px-2 flex items-center space-x-1 text-sm">
              <ArrowUpDown className="w-4 h-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="w-32 py-1">
              <SelectItem value="nama_program" className="px-2 py-1 text-sm">
                Nama Program
              </SelectItem>
              <SelectItem value="waktu_mulai" className="px-2 py-1 text-sm">
                Waktu Mulai
              </SelectItem>
              <SelectItem value="waktu_selesai" className="px-2 py-1 text-sm">
                Waktu Selesai
              </SelectItem>
              <SelectItem value="created_at" className="px-2 py-1 text-sm">
                Created At
              </SelectItem>
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

    return (
        <Card className="mx-auto mt-6 max-w-[70rem] p-6">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Database className="h-6 w-6 text-slate-700" />
                    <h2 className="text-xl font-medium text-[var(--blue)]">Program</h2>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-4 items-center">
                    <div className="flex relative max-w-70 md:w-2/5 gap-2 mb-4 md:mb-0">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <SortControls
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortByChange={setSortBy}
                        onSortOrderToggle={() =>
                            setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"))
                        }
                    />
                    <div className="flex items-center gap-2">
                        <Button className="bg-[#3A786D] text-white" onClick={() => setIsOpen(true)}>
                            Tambah Program
                        </Button>
                        <ChooseMethodProgram
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            onRefresh={() =>
                            fetchPrograms(currentPage, search.trim(), sortBy, sortOrder)
                            }
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </div>
                ) : programList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programList.map((program) => (
                            <CardProgram 
                                key={program.id} 
                                program={program} 
                                onClick={() => navigate(`/data-program/${program.id}`)} 
                                onDelete={handleDeleteProgram}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <p className="text-gray-500 mb-2">Tidak ada program yang ditemukan</p>
                        <p className="text-gray-400 text-sm">Silakan coba kata kunci pencarian lain atau tambahkan program baru</p>
                    </div>
                )}

                {!loading && totalPrograms > 0 && (
                    <div className="flex justify-center mt-6 space-x-2">
                        <Button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="bg-[#3A786D] text-white"
                        >
                            Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button 
                                key={i} 
                                onClick={() => setCurrentPage(i + 1)}
                                className={`${
                                    currentPage === i + 1 ? "bg-[#3A786D] text-white" : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                                }`}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button 
                            disabled={currentPage === totalPages} 
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="bg-[#3A786D] text-white"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Program;