"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Leaf, Pencil, Trash2, Loader2, Menu, Filter, Share2 } from "lucide-react";
import AddActivityDialog from "@/components/activity/addactivity";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Kegiatan {
  id: string;
  nama_aktivitas: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  biaya_implementasi: number;
  deskripsi: string;
  dokumentasi?: string;
}

const ITEMS_PER_PAGE = 20;
const API_URL = import.meta.env.VITE_HOST_NAME;

const STATUS_OPTIONS = ["Unstarted", "Ongoing", "Finished"];

export default function KegiatanPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Kegiatan | null>(null);
  const [activities, setActivities] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  
  const formatRupiah = (amount: number): string => {
    const roundedAmount = Math.floor(amount);
    
    return roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const shareToWhatsApp = (activity: Kegiatan) => {
    event?.stopPropagation();
    
    const tanggalMulai = new Date(activity.tanggal_mulai).toLocaleDateString('id-ID');
    const tanggalSelesai = new Date(activity.tanggal_selesai).toLocaleDateString('id-ID');
  
    const shareText = `*Detail Kegiatan*\n\n` +
      `*Nama Kegiatan:* ${activity.nama_aktivitas}\n` +
      `*Tanggal Mulai:* ${tanggalMulai}\n` +
      `*Tanggal Selesai:* ${tanggalSelesai}\n` +
      `*Status:* ${activity.status}\n` +
      `*Biaya Implementasi:* Rp ${formatRupiah(activity.biaya_implementasi)}\n` +
      (activity.deskripsi ? `*Deskripsi:* ${activity.deskripsi}\n` : '');

    const encodedText = encodeURIComponent(shareText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
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
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${API_URL}/api/activity/getactivity/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch activities: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setActivities(data.activity || []);
        } else {
          throw new Error(data.message || "Failed to fetch activities");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Kegiatan gagal dimuat!");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
    setCurrentPage(1);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.nama_aktivitas && 
      activity.nama_aktivitas.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilters.length === 0 || 
      statusFilters.includes(activity.status);
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const displayedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDeleteActivity = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/activity/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete activity: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setActivities(activities.filter(activity => activity.id !== id));
        toast.success("Activity deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete activity");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete activity");
    } finally {
      setShowDeleteDialog(false);
    }
  };  

  const getStatusBadge = (status: string) => {
    let color = "bg-gray-200 text-gray-800";
    
    switch (status.toLowerCase()) {
      case "unstarted":
        color = "bg-blue-100 text-blue-800";
        break;
      case "ongoing":
        color = "bg-yellow-100 text-yellow-800";
        break;
      case "finished":
        color = "bg-green-100 text-green-800";
        break;
      default:
        color = "bg-gray-200 text-gray-800";
    }
    
    return (
      <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
        {status}
      </Badge>
    );
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
    <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
      <CardHeader className="p-3 md:p-6">
        <div className="flex items-center space-x-2">
          <Leaf className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Kegiatan</h2>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 md:items-center">
          <div className="flex flex-col md:flex-row w-full md:w-2/3 gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 md:w-auto">
                  <Filter className="h-4 w-4" />
                  <span>Filter Status</span>
                  {statusFilters.length > 0 && (
                    <Badge className="ml-1 bg-[#3A786D]">{statusFilters.length}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4">
                <h4 className="font-medium mb-3">Filter by Status</h4>
                <div className="space-y-2">
                  {STATUS_OPTIONS.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`status-${status}`} 
                        checked={statusFilters.includes(status)}
                        onCheckedChange={() => toggleStatusFilter(status)}
                      />
                      <Label htmlFor={`status-${status}`} className="flex items-center">
                        {getStatusBadge(status)}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setStatusFilters([])}
                    disabled={statusFilters.length === 0}
                  >
                    Clear All
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setFilterOpen(false)}
                    className="bg-[#3A786D]"
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center gap-2">
            <Button className="bg-[#3A786D] text-white w-full md:w-auto" onClick={() => setIsOpen(true)}>
              Tambah Kegiatan
            </Button>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No activities found</p>
            {(statusFilters.length > 0 || search) && (
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setStatusFilters([]);
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
            {displayedActivities.map((item) => (
              <div 
                key={item.id} 
                className="border rounded-lg p-4 space-y-3 bg-white"
                onClick={() => navigate(`/kegiatan/${item.id}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-[var(--blue)] truncate pr-2">{item.nama_aktivitas}</h3>
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
                    <SheetContent side="bottom" className="h-auto max-h-[40vh] rounded-t-xl">
                      <div className="grid gap-4 py-4">
                        <Button 
                          className="w-full flex justify-start items-center space-x-2 bg-transparent text-blue-500 hover:bg-blue-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/kegiatan/${item.id}`);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Edit Kegiatan</span>
                        </Button>
                        <Button 
                          className="w-full flex justify-start items-center space-x-2 bg-transparent text-green-500 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareToWhatsApp(item);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                          <span>Bagikan ke WhatsApp</span>
                        </Button>
                        <Button 
                          className="w-full flex justify-start items-center space-x-2 bg-transparent text-red-500 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActivity(item);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Hapus Kegiatan</span>
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="block text-gray-500 text-xs">Tanggal Mulai</span>
                      <span>{new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs">Status</span>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="block text-gray-500 text-xs">Tanggal Selesai</span>
                      <span>{new Date(item.tanggal_selesai).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs">Biaya Implementasi</span>
                      <span className="font-medium">Rp {formatRupiah(item.biaya_implementasi)}</span>
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
                  <TableHead className="pl-7 w-[200px]">Nama Kegiatan</TableHead>
                  <TableHead className="w-[120px] text-center">Tanggal Mulai</TableHead>
                  <TableHead className="w-[120px] text-center">Tanggal Selesai</TableHead>
                  <TableHead className="w-[120px] text-center">Status</TableHead>
                  <TableHead className="w-[180px]">Biaya Implementasi</TableHead>
                  <TableHead className="w-[140px] text-right pr-9">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {displayedActivities.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => {
                      navigate(`/kegiatan/${item.id}`);
                    }}
                  >
                    <TableCell className="pl-7 truncate max-w-[180px]">{item.nama_aktivitas}</TableCell>
                    <TableCell className="text-center truncate">
                      {new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-center truncate">
                      {new Date(item.tanggal_selesai).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell className="text-left truncate max-w-[180px]">
                      Rp {formatRupiah(item.biaya_implementasi)}
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-200 transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/kegiatan/${item.id}`);
                          }}
                        >
                          <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-green-100 transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareToWhatsApp(item);
                          }}
                        >
                          <Share2 className="w-4 h-4 text-green-500 hover:text-green-700" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-100 transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActivity(item);
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
              <DialogTitle>Hapus Kegiatan</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus kegiatan "{selectedActivity?.nama_aktivitas}"?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between sm:justify-between mt-4">
              <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Batal
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => handleDeleteActivity(selectedActivity?.id)}
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
                className={`h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm ${
                  currentPage === i + 1 
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
        <AddActivityDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </CardContent>
    </Card>
  );
}