"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, UserCheck, UserX, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface User {
  id: string;
  nama: string;
  email: string;
  peran: "Viewer" | "Editor" | "Admin";
  status: "Pending" | "Approved" | "Rejected";
  short_bio?: string;
  alasan_bergabung?: string;
  foto_profil?: string;
  masjid_id?: string;
  nama_masjid?: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("pending");
  const [pendingEditors, setPendingEditors] = useState<User[]>([]);
  const [approvedEditors, setApprovedEditors] = useState<User[]>([]);
  const [rejectedEditors, setRejectedEditors] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPendingEditors();
    fetchApprovedEditors();
    fetchRejectedEditors();
  }, []);

  const fetchPendingEditors = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/access/editors/pending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pending editors: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setPendingEditors(data.data);
      } else {
        console.warn("Format data tidak sesuai:", data);
        setPendingEditors([]);
      }
    } catch (error) {
      console.error("Error fetching pending editors:", error);
      toast.error("Gagal memuat data editor pending");
      setPendingEditors([]); 
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApprovedEditors = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/users/getall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch approved editors: ${response.status}`);
      }
      
      const data = await response.json();
      const approvedData = data.users.filter((user: User) => user.status === "Approved" && user.peran === "Editor");
      if (Array.isArray(approvedData)) {
        setApprovedEditors(approvedData);
      } else {
        console.warn("Format data tidak sesuai:", data);
        setApprovedEditors([]);
      }
    } catch (error) {
      console.error("Error fetching approved editors:", error);
      setApprovedEditors([]);
    }
  };

  const fetchRejectedEditors = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/users/getall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch rejected editors: ${response.status}`);
      }

      const data = await response.json();
      const rejectedData = data.users.filter((user: User) => user.status === "Rejected" && user.peran === "Editor");
      if (Array.isArray(rejectedData)) {
        setRejectedEditors(rejectedData);
      } else {
        console.warn("Format data tidak sesuai:", data);
        setRejectedEditors([]);
      }
    } catch (error) {
      console.error("Error fetching rejected editors:", error);
      setRejectedEditors([]);
    }
  };

  const approveEditor = async (editorId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/access/editors/${editorId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to approve editor: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Editor berhasil disetujui");
        
        fetchPendingEditors();
        fetchApprovedEditors();
        
        return true;
      } else {
        throw new Error(data.message || "Gagal menyetujui editor");
      }
    } catch (error) {
      console.error("Error approving editor:", error);
      toast.error("Gagal menyetujui editor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectEditor = async (editorId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/access/editors/${editorId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to reject editor: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Editor berhasil ditolak");
        
        fetchPendingEditors();
        fetchRejectedEditors();
        
        return true;
      } else {
        throw new Error(data.message || "Gagal menolak editor");
      }
    } catch (error) {
      console.error("Error rejecting editor:", error);
      toast.error("Gagal menolak editor");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", { 
        day: "2-digit",
        month: "long", 
        year: "numeric" 
      });
    } catch (e) {
      return dateString;
    }
  };

  const getFilteredEditors = () => {
    let editors: User[] = [];
    
    switch(currentTab) {
      case "pending":
        editors = pendingEditors;
        break;
      case "approved":
        editors = approvedEditors;
        break;
      case "rejected":
        editors = rejectedEditors;
        break;
    }
    
    return editors.filter((user) => 
      user.nama?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.nama_masjid?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const filteredEditors = getFilteredEditors();
  const totalPages = Math.ceil(filteredEditors.length / ITEMS_PER_PAGE);
  const displayedEditors = filteredEditors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleApprove = async (user: User) => {
    if (confirm(`Apakah Anda yakin ingin menyetujui ${user.nama} sebagai editor?`)) {
      const success = await approveEditor(user.id);
      if (success) {
        setIsDetailsOpen(false);
      }
    }
  };

  const handleReject = async (user: User) => {
    if (confirm(`Apakah Anda yakin ingin menolak ${user.nama} sebagai editor?`)) {
      const success = await rejectEditor(user.id);
      if (success) {
        setIsDetailsOpen(false);
      }
    }
  };

  const showUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  return (
    <Card className="mx-auto mt-6 max-w-[70rem] p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Persetujuan Editor</h2>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" value={currentTab} onValueChange={setCurrentTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingEditors.length > 0 && (
                <Badge className="ml-2 bg-amber-500">{pendingEditors.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">
              Disetujui
              {approvedEditors.length > 0 && (
                <Badge className="ml-2 bg-green-500">{approvedEditors.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Ditolak
              {rejectedEditors.length > 0 && (
                <Badge className="ml-2 bg-red-500">{rejectedEditors.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex justify-between mb-4 items-center">
            <div className="flex relative w-2/5 gap-2">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama, email, atau masjid"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Button variant="outline" className="flex items-center">
                <ArrowUpDown className="w-4 h-4 mr-2" /> Sort
              </Button>
            </div>
          </div>

          <TabsContent value="pending" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Masjid</TableHead>
                    <TableHead>Tanggal Daftar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Sedang memuat data...
                      </TableCell>
                    </TableRow>
                  ) : displayedEditors.length > 0 ? (
                    displayedEditors.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nama}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.nama_masjid || "-"}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Badge className="bg-amber-500">Pending</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center text-blue-600"
                              onClick={() => showUserDetails(user)}
                            >
                              Detail
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center text-green-600"
                              onClick={() => handleApprove(user)}
                            >
                              <UserCheck className="w-4 h-4 mr-1" /> Setujui
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center text-red-600"
                              onClick={() => handleReject(user)}
                            >
                              <UserX className="w-4 h-4 mr-1" /> Tolak
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Tidak ada editor pending
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Masjid</TableHead>
                    <TableHead>Tanggal Daftar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedEditors.length > 0 ? (
                    displayedEditors.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nama}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.nama_masjid || "-"}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Disetujui</Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center text-blue-600"
                            onClick={() => showUserDetails(user)}
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Tidak ada editor yang disetujui
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Masjid</TableHead>
                    <TableHead>Tanggal Daftar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedEditors.length > 0 ? (
                    displayedEditors.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nama}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.nama_masjid || "-"}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Badge className="bg-red-500">Ditolak</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center text-blue-600"
                              onClick={() => showUserDetails(user)}
                            >
                              Detail
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center text-green-600"
                              onClick={() => handleApprove(user)}
                            >
                              <UserCheck className="w-4 h-4 mr-1" /> Setujui
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Tidak ada editor yang ditolak
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {totalPages > 0 && (
          <div className="flex justify-center mt-4 space-x-2">
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

        {/* User Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Editor</DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {selectedUser.foto_profil ? (
                      <img 
                        src={selectedUser.foto_profil} 
                        alt={selectedUser.nama} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                        {selectedUser.nama.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedUser.nama}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge className={
                        selectedUser.status === "Approved" ? "bg-green-500" :
                        selectedUser.status === "Rejected" ? "bg-red-500" : "bg-amber-500"
                      }>
                        {
                          selectedUser.status === "Approved" ? "Disetujui" :
                          selectedUser.status === "Rejected" ? "Ditolak" : "Pending"
                        }
                      </Badge>
                      <Badge className="bg-blue-500">{selectedUser.peran}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="font-medium text-gray-700">Masjid</h4>
                    <p>{selectedUser.nama_masjid || "-"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Tanggal Daftar</h4>
                    <p>{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-gray-700">Bio Singkat</h4>
                  <p className="text-gray-600">{selectedUser.short_bio || "-"}</p>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-gray-700">Alasan Bergabung</h4>
                  <p className="text-gray-600">{selectedUser.alasan_bergabung || "-"}</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              {selectedUser?.status === "Pending" && (
                <>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleReject(selectedUser)}
                  >
                    <UserX className="w-4 h-4 mr-2" /> Tolak
                  </Button>
                  <Button 
                    className="bg-[#3A786D] text-white"
                    onClick={() => handleApprove(selectedUser)}
                  >
                    <UserCheck className="w-4 h-4 mr-2" /> Setujui
                  </Button>
                </>
              )}
              
              {selectedUser?.status === "Rejected" && (
                <Button 
                  className="bg-[#3A786D] text-white"
                  onClick={() => handleApprove(selectedUser)}
                >
                  <UserCheck className="w-4 h-4 mr-2" /> Setujui
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsOpen(false)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}