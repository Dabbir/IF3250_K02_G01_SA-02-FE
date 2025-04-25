"use client"

import { utils, writeFile } from 'xlsx';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Building, Pencil, Trash2, Loader2, Menu, Share2, Phone, Mail, HandCoins, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AddBeneficiary from "@/components/beneficiary/addbeneficiary";

interface Beneficiary {
  id: string;
  nama_instansi: string;
  nama_kontak: string;
  alamat: string;
  telepon: string;
  email: string;
  foto: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 20;
const API_URL = import.meta.env.VITE_HOST_NAME;

export default function BeneficiaryPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

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
    const fetchBeneficiaries = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${API_URL}/api/beneficiary`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch beneficiaries: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setBeneficiaries(data.data || []);
        } else {
          throw new Error(data.message || "Failed to fetch beneficiaries");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Penerima manfaat gagal dimuat!");
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiaries();
  }, []);

  const handleShareToWhatsApp = (beneficiary: Beneficiary) => {
    event?.stopPropagation();

    const shareText = `*Detail Penerima Manfaat*\n\n` +
      `*Nama Instansi:* ${beneficiary.nama_instansi}\n` +
      `*Nama Kontak:* ${beneficiary.nama_kontak || 'Tidak Tersedia'}\n` +
      `*Alamat:* ${beneficiary.alamat || 'Tidak Tersedia'}\n` +
      `*Telepon:* ${beneficiary.telepon || 'Tidak Tersedia'}\n` +
      `*Email:* ${beneficiary.email || 'Tidak Tersedia'}\n`;

    const encodedText = encodeURIComponent(shareText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = 
      (beneficiary.nama_instansi && beneficiary.nama_instansi.toLowerCase().includes(search.toLowerCase())) ||
      (beneficiary.nama_kontak && beneficiary.nama_kontak.toLowerCase().includes(search.toLowerCase()));

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredBeneficiaries.length / ITEMS_PER_PAGE);
  const displayedBeneficiaries = filteredBeneficiaries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDeleteBeneficiary = async (id: string | undefined) => {
    if (!id) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/beneficiary/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete beneficiary: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBeneficiaries(beneficiaries.filter(beneficiary => beneficiary.id !== id));
        toast.success(data.message || "Penerima manfaat berhasil dihapus");
      } else {
        throw new Error(data.message || "Failed to delete beneficiary");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete beneficiary");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const exportXlsx = () => {
    if (beneficiaries.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    // Membentuk data sesuai struktur
    const data = beneficiaries.map(beneficiary => ({
      "Nama Instansi": beneficiary.nama_instansi,
      "Nama Kontak": beneficiary.nama_kontak || "",
      "Alamat": beneficiary.alamat || "",
      "Telepon": beneficiary.telepon || "",
      "Email": beneficiary.email || ""
    }));

    const columnWidths = [
      { wch: 30 }, // Nama Instansi
      { wch: 25 }, // Nama Kontak
      { wch: 40 }, // Alamat
      { wch: 20 }, // Telepon
      { wch: 30 }  // Email
    ];

    const worksheet = utils.json_to_sheet(data);
    worksheet['!cols'] = columnWidths;

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Penerima Manfaat");

    writeFile(workbook, "Penerima_Manfaat.xlsx");
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
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <HandCoins className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Penerima Manfaat</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 md:items-center">
          <div className="relative flex-grow items-top w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari nama instansi atau kontak"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 max-md:h-8 max-md:text-[12px]"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* Export Button */}
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full flex items-center justify-center gap-1"
              onClick={exportXlsx}
            >
              <Download className="h-4 w-4" />
              Unduh Publikasi
            </Button>

            {/* Add Publication Button */}
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full flex items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              Tambah Publikasi
            </Button>
          </div>
        </div>

        {filteredBeneficiaries.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">Tidak ada data penerima manfaat</p>
            {search && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearch("")}
                >
                  Hapus Filter
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedBeneficiaries.map((beneficiary) => (
              <Card 
                key={beneficiary.id} 
                className="overflow-hidden hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/penerima-manfaat/${beneficiary.id}`)}
              >
                <div className="w-full h-50 bg-slate-100 overflow-hidden">
                  {beneficiary.foto ? (
                    <img 
                      src={beneficiary.foto} 
                      alt={beneficiary.nama_instansi}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Building className="h-16 w-16 text-slate-300" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-[var(--blue)] truncate pr-2 text-base">
                      {beneficiary.nama_instansi}
                    </h3>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 relative z-10"
                          onClick={(e) => {e.stopPropagation();}}
                        >
                          <Menu className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent 
                        side="bottom" 
                        className="h-auto max-h-[30vh] rounded-t-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid gap-4 py-4">
                          <Button
                            className="w-full flex justify-start items-center space-x-2 bg-transparent text-blue-500 hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/penerima-manfaat/${beneficiary.id}`);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            <span>Edit Penerima Manfaat</span>
                          </Button>
                          <Button
                            className="w-full flex justify-start items-center space-x-2 bg-transparent text-green-500 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareToWhatsApp(beneficiary);
                            }}
                          >
                            <Share2 className="h-4 w-4" />
                            <span>Bagikan ke WhatsApp</span>
                          </Button>
                          <Button
                            className="w-full flex justify-start items-center space-x-2 bg-transparent text-red-500 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBeneficiary(beneficiary);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Hapus Penerima Manfaat</span>
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  
                  {beneficiary.nama_kontak && (
                    <p className="text-sm mt-2 text-gray-700">{beneficiary.nama_kontak}</p>
                  )}
                  
                  <div className="mt-3 space-y-2">
                    {beneficiary.telepon && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3.5 w-3.5 mr-2" />
                        <span className="truncate">{beneficiary.telepon}</span>
                      </div>
                    )}
                    {beneficiary.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3.5 w-3.5 mr-2" />
                        <span className="truncate">{beneficiary.email}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Hapus Penerima Manfaat</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus penerima manfaat "{selectedBeneficiary?.nama_instansi}"?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between sm:justify-between mt-4">
              <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleDeleteBeneficiary(selectedBeneficiary?.id)}
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
        
        {/* Add Beneficiary Dialog */}
        <AddBeneficiary 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          onSuccess={() => {
            window.location.reload();
          }}
        />
      </CardContent>
    </Card>
  );
}