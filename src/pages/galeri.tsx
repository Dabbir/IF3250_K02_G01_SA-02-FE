"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Camera, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_HOST_NAME;
const ITEMS_PER_PAGE = 12;

interface GalleryItem {
  aktivitas_id: string;
  url: string;
  nama_aktivitas: string;
  deskripsi_aktivitas?: string;
}

interface PaginatedResponse {
  success: boolean;
  message?: string;
  data: GalleryItem[];
  total: number;
  page: number;
  limit: number;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${API_URL}/api/gallery/paginated?page=${currentPage}&limit=${ITEMS_PER_PAGE}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch gallery: ${response.status}`);
        }

        const data: PaginatedResponse = await response.json();

        if (data.success) {
          setGalleryItems(data.data || []);
          setTotalItems(data.total || 0);
          setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
        } else {
          throw new Error(data.message || "Failed to fetch gallery");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        toast.error("Galeri gagal dimuat!");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [currentPage]);

  if (loading) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#3A786D]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6 bg-white/80 backdrop-blur-sm">
        <CardContent className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#3A786D] text-white"
            >
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6 bg-white/80 backdrop-blur-sm border-none shadow-lg">
      <CardHeader className="pb-0">
        <div className="flex items-center space-x-2 pb-2 border-b">
          <Camera className="h-5 w-5 md:h-6 md:w-6 text-[#3A786D]" />
          <h2 className="text-lg md:text-2xl font-medium text-[#3A786D]">Galeri Dokumentasi</h2>
        </div>
        <p className="text-gray-500 mt-2 text-sm italic">
          Kumpulan momen berharga dari berbagai kegiatan sustainability Masjid Salman
        </p>
      </CardHeader>
      <CardContent className="mt-6">
        {galleryItems.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <Camera className="mx-auto h-16 w-16 text-gray-300" />
            <p className="mt-4 text-gray-500 font-medium">Belum ada dokumentasi yang tersedia</p>
            <p className="text-gray-400 text-sm mt-2">Dokumentasi kegiatan akan ditampilkan di sini</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {galleryItems.map((item, index) => (
                <div 
                  key={`${item.aktivitas_id || index}-${index}`} 
                  className="group rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.nama_aktivitas || "Dokumentasi kegiatan"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Overlay gradient for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#3A786D] text-lg line-clamp-1 group-hover:text-[#245650] transition-colors">
                      {item.nama_aktivitas || "Dokumentasi kegiatan"}
                    </h3>
                    <div className="h-16 overflow-hidden">
                      <p className="text-gray-600 mt-2 line-clamp-3 text-sm">
                        {item.deskripsi_aktivitas || "Dokumentasi kegiatan sustainability Masjid Salman"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="h-9 w-9 border-[#3A786D] text-[#3A786D]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Calculate which page numbers to show
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    // Show ellipsis when needed
                    if (totalPages > 5) {
                      if (i === 0 && currentPage > 3) {
                        return (
                          <Button 
                            key="first"
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 border-[#3A786D]"
                            onClick={() => setCurrentPage(1)}
                          >
                            1
                          </Button>
                        );
                      }
                      
                      if (i === 1 && currentPage > 4) {
                        return (
                          <span key="ellipsis1" className="flex items-center justify-center h-9 w-5">
                            ...
                          </span>
                        );
                      }
                      
                      if (i === 3 && currentPage < totalPages - 3) {
                        return (
                          <span key="ellipsis2" className="flex items-center justify-center h-9 w-5">
                            ...
                          </span>
                        );
                      }
                      
                      if (i === 4 && currentPage < totalPages - 2) {
                        return (
                          <Button 
                            key="last"
                            variant="outline"
                            size="sm"
                            className="h-9 w-9 border-[#3A786D]"
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </Button>
                        );
                      }
                    }
                    
                    return (
                      <Button 
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className={`h-9 w-9 ${
                          currentPage === pageNum 
                            ? "bg-[#3A786D] text-white" 
                            : "border-[#3A786D] text-[#3A786D]"
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="h-9 w-9 border-[#3A786D] text-[#3A786D]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl">
            <div className="relative">
              <img 
                src={selectedImage?.url} 
                alt={selectedImage?.nama_aktivitas || "Dokumentasi kegiatan"} 
                className="w-full object-contain max-h-[70vh]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent py-6 px-6">
                <h2 className="text-white text-xl font-semibold">
                  {selectedImage?.nama_aktivitas || "Dokumentasi Kegiatan"}
                </h2>
              </div>
              <Button 
                variant="ghost" 
                className="absolute top-2 right-2 text-white hover:bg-black/20 rounded-full" 
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </Button>
            </div>
            {selectedImage?.deskripsi_aktivitas && (
              <div className="p-6 bg-white">
                <p className="text-gray-700 leading-relaxed">
                  {selectedImage.deskripsi_aktivitas}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}