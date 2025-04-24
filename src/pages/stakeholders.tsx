"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Leaf, Pencil, Trash2, Loader2, Menu, ArrowUpDown, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AddStakeholderDialog from "@/components/stakeholder/addstakeholder";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Stakeholder {
    id: string;
    nama_stakeholder: string;
    jenis: string;
    telepon: string;
    email: string;
    foto: string;
    masjid_id: string;
    created_by: string;
}

const ITEMS_PER_PAGE = 20;
const API_URL = import.meta.env.VITE_HOST_NAME;

const TYPE_OPTIONS = ["Individu", "Organisasi", "Perusahaan"];

export default function StakeholderPage() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
    const [stakeholder, setStakeholder] = useState<Stakeholder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [jenisFilters, setJenisFilters] = useState<string[]>([]);
    const [filterOpen, setFilterOpen] = useState(false);

    // Sort states
    const [sortColumn, setSortColumn] = useState<string>("nama_stakeholder");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Function to handle sorting
    const handleSortChange = (column: string) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchStakeholder = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Authentication token not found");
                }

                const response = await fetch(`${API_URL}/api/stakeholder/getAll/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch stakeholders: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    setStakeholder(data.stakeholders || []);
                } else {
                    throw new Error(data.message || "Failed to fetch stakeholder");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                toast.error("Stakeholder gagal dimuat!");
            } finally {
                setLoading(false);
            }
        };

        fetchStakeholder();
    }, []);

    const toggleJenisFilter = (jenis: string) => {
        setJenisFilters(prev => {
            if (prev.includes(jenis)) {
                return prev.filter(j => j !== jenis);
            } else {
                return [...prev, jenis];
            }
        });
        setCurrentPage(1);
    };

    const getJenisBadge = (jenis: string) => {
        let color = "";

        switch (jenis.toLowerCase()) {
            case "individu":
                color = "bg-slate-100 text-slate-700 border border-slate-200";
                break;
            case "organisasi":
                color = "bg-amber-50 text-amber-700 border border-amber-200";
                break;
            case "perusahaan":
                color = "bg-emerald-50 text-emerald-700 border border-emerald-200";
                break;
            default:
                color = "bg-gray-100 text-gray-700 border border-gray-200";
        }

        return (
            <Badge className={`px-3 py-1 text-xs font-medium rounded-md min-w-[90px] text-center ${color}`}>
                {jenis}
            </Badge>
        );
    };

    // First filter stakeholders by search
    const filteredStakeholder = stakeholder.filter((item) => {
        const nama = item.nama_stakeholder?.toLowerCase() || "";
        const jenis = item.jenis?.toLowerCase() || "";
    
        const matchesSearch = nama.includes(search.toLowerCase());
        const matchesJenis = jenisFilters.length === 0 ||
            jenisFilters.map(j => j.toLowerCase()).includes(jenis);
    
        console.log("matchesJenis:", matchesJenis, "jenisFilters:", jenisFilters, "jenis:", jenis);
    
        return matchesSearch && matchesJenis;
    }); 

    // Then sort the filtered stakeholders
    const sortedStakeholder = [...filteredStakeholder].sort((a, b) => {
        const valueA = a[sortColumn as keyof Stakeholder];
        const valueB = b[sortColumn as keyof Stakeholder];

        // Handle string sorting
        if (typeof valueA === "string" && typeof valueB === "string") {
            return sortOrder === "asc"
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }

        return 0;
    });

    // Apply pagination to sorted stakeholders
    const totalPages = Math.ceil(sortedStakeholder.length / ITEMS_PER_PAGE);
    const displayStakeholder = sortedStakeholder.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDeleteStakeholder = async (id: string | undefined) => {
        if (!id) return;

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await fetch(`${API_URL}/api/stakeholder/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete stakeholder: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setStakeholder(stakeholder.filter(item => item.id !== id));
                toast.success("Stakeholder deleted successfully");
            } else {
                throw new Error(data.message || "Failed to delete stakeholder");
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete stakeholder");
        } finally {
            setShowDeleteDialog(false);
        }
    };

    if (loading) {
        return (
            <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
                <CardContent className="flex justify-center items-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
                <CardContent className="flex justify-center items-center h-[400px]">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-[#3A786D] text-white"
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mx-auto mt-6 max-w-[70rem] md:p-6">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
                    <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Stakeholder</h2>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 md:items-center">
                    <div className="flex flex-col md:flex-row w-full md:w-2/3 gap-2">
                        <div className="relative flex-grow items-top">
                            <Search className="absolute left-3 top-2.5 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 max-md:h-8 max-md:text-[12px]"
                            />
                        </div>
                    </div>

                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="max-md:h-8 flex items-center gap-1 md:w-auto">
                                <Filter className="h-3 w-3 md:-h4 md:w-4" />
                                <span className="max-md:text-[12px]">Filter Jenis</span>
                                {jenisFilters.length > 0 && (
                                    <Badge className="ml-1 bg-[#3A786D]">{jenisFilters.length}</Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-4">
                            <h4 className="text-[12px] font-medium mb-3">Filter berdasarkan jenis</h4>
                            <div className="space-y-2">
                                {TYPE_OPTIONS.map((jenis) => (
                                    <div key={jenis} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`jenis-${jenis}`}
                                            checked={jenisFilters.includes(jenis)}
                                            onCheckedChange={() => toggleJenisFilter(jenis)}
                                        />
                                        <Label htmlFor={`jenis-${jenis}`} className="flex items-center">
                                            {getJenisBadge(jenis)}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setJenisFilters([])}
                                    disabled={jenisFilters.length === 0}
                                    className="text-[12px]"
                                >
                                    Clear All
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setFilterOpen(false)}
                                    className="bg-[#3A786D] text-[12px]"
                                >
                                    Apply
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="flex items-center gap-2">
                        <Button className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto" onClick={() => setIsOpen(true)}>
                            Tambah Stakeholder
                        </Button>
                    </div>
                </div>

                {filteredStakeholder.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                        <p className="text-gray-500">No stakeholder found</p>
                        {(jenisFilters.length > 0 || search) && (
                            <div className="mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setJenisFilters([]);
                                        setSearch("");
                                    }}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                ) : isMobileView ? (
                    // Mobile card view
                    <div className="space-y-4">
                        {displayStakeholder.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-lg p-4 space-y-3 bg-white"
                                onClick={() => navigate(`/stakeholder/${item.id}`)}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-[var(--blue)] truncate pr-2">{item.nama_stakeholder}</h3>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Menu className="h-4 w-4" />
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="bottom" className="h-auto max-h-[30vh] rounded-t-xl">
                                            <div className="grid gap-4 py-4">
                                                <Button
                                                    className="w-full flex justify-start items-center space-x-2 bg-transparent text-blue-500 hover:bg-blue-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/stakeholder/${item.id}`);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    <span>Edit Stakeholder</span>
                                                </Button>
                                                <Button
                                                    className="w-full flex justify-start items-center space-x-2 bg-transparent text-red-500 hover:bg-red-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedStakeholder(item);
                                                        setShowDeleteDialog(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span>Hapus Stakeholder</span>
                                                </Button>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="block text-gray-500 text-xs">Jenis</span>
                                            <span className="text-[12px]">
                                                {getJenisBadge(item.jenis && item.jenis.toLowerCase()) || "-"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs">Telepon</span>
                                            <span className="text-[12px]">
                                                {(item.telepon && item.telepon.toLowerCase()) || "-"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs">Email</span>
                                            <span className="text-[12px]">
                                                {(item.email && item.email.toLowerCase()) || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Desktop table view
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-100">
                                    <TableHead
                                        className="pl-7 w-[200px] cursor-pointer"
                                        onClick={() => handleSortChange("nama_stakeholder")}
                                    >
                                        <div className="flex items-center justify-left">
                                            Nama Stakeholder
                                            {sortColumn === "nama_stakeholder" && (
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="w-[120px] text-center cursor-pointer"
                                    >
                                        <div className="flex items-center justify-left">
                                            Jenis
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="w-[120px] text-center cursor-pointer"
                                    >
                                        <div className="flex items-center justify-left">
                                            Telepon
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="w-[120px] text-center cursor-pointer"
                                    >
                                        <div className="flex items-center justify-left">
                                            Email
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="w-[120px] text-center cursor-pointer"
                                    >
                                        <div className="flex items-center justify-center">
                                            Action
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {displayStakeholder.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="border-b cursor-pointer hover:bg-gray-100 transition"
                                        onClick={() => {
                                            navigate(`/stakeholder/${item.id}`);
                                        }}
                                    >
                                        <TableCell className="pl-7 truncate max-w-[180px]">{item.nama_stakeholder}</TableCell>
                                        <TableCell className="text-left truncate">
                                            {getJenisBadge(item.jenis || "-")}
                                        </TableCell>
                                        <TableCell className="text-left truncate">
                                            {item.telepon || "-"}
                                        </TableCell>
                                        <TableCell className="text-left truncate">
                                            {item.email || "-"}
                                        </TableCell>
                                        <TableCell className="pr-5 text-left">
                                            <div className="flex gap-2 justify-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-gray-200 transition cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/stakeholder/${item.id}`);
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="hover:bg-red-100 transition cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedStakeholder(item);
                                                        setShowDeleteDialog(true);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Hapus Stakeholder</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus stakeholder "{selectedStakeholder?.nama_stakeholder}"?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-between sm:justify-between mt-4">
                            <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                Batal
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => handleDeleteStakeholder(selectedStakeholder?.id)}
                            >
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center mt-4 gap-2">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
                        >
                            Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm ${currentPage === i + 1
                                    ? "bg-[#3A786D] text-white"
                                    : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                                    }`}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="bg-[#3A786D] text-white h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
                        >
                            Next
                        </Button>
                    </div>
                )}
                <AddStakeholderDialog
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            </CardContent>
        </Card>
    );
}