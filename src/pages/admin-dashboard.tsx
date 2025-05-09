"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, ArrowUpDown, UserCheck, UserX, ShieldCheck, Plus, Pencil, Trash2, Building, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  dokumen_pendaftaran?: string;
  dokumen_file_id?: string;
  dokumen_file_name?: string;
  dokumen_file_type?: string;
  dokumen_view_link?: string;
  created_at: string;
  updated_at: string;
}

interface Masjid {
  id: string;
  nama_masjid: string;
  alamat: string;
  created_at?: string;
  updated_at?: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
  // Editor Management State
  const [editorSearch, setEditorSearch] = useState("");
  const [masjidSearch, setMasjidSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [masjidCurrentPage, setMasjidCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("approval");
  const [currentApprovalTab, setCurrentApprovalTab] = useState("pending");
  const [pendingEditors, setPendingEditors] = useState<User[]>([]);
  const [approvedEditors, setApprovedEditors] = useState<User[]>([]);
  const [rejectedEditors, setRejectedEditors] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject' | 'delete-masjid', user: User | null, masjid?: Masjid }>({ type: 'approve', user: null });

  // Masjid Management State
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [masjidEditors, setMasjidEditors] = useState<User[]>([]);
  const [isLoadingEditors, setIsLoadingEditors] = useState(false);
  const [isMasjidDetailsOpen, setIsMasjidDetailsOpen] = useState(false);
  const [isMasjidFormOpen, setIsMasjidFormOpen] = useState(false);
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [masjidFormMode, setMasjidFormMode] = useState<'add' | 'edit'>('add');
  const [masjidForm, setMasjidForm] = useState<Partial<Masjid>>({
    nama_masjid: '',
    alamat: '',
  });

  // Fetch Data on Component Mount
  useEffect(() => {
    fetchPendingEditors();
    fetchApprovedEditors();
    fetchRejectedEditors();
    fetchMasjids();
  }, []);

  // Editor Management Functions
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
        
        // Immediately update the UI
        const updatedUser = { ...confirmAction.user, status: "Approved" } as User;
        
        // Remove from pending or rejected lists
        if (currentApprovalTab === "pending") {
          setPendingEditors(prev => prev.filter(editor => editor.id !== editorId));
        } else if (currentApprovalTab === "rejected") {
          setRejectedEditors(prev => prev.filter(editor => editor.id !== editorId));
        }
        
        // Add to approved list
        setApprovedEditors(prev => [...prev, updatedUser]);
        
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
        
        // Immediately update the UI
        const updatedUser = { ...confirmAction.user, status: "Rejected" } as User;
        
        // Remove from pending list
        setPendingEditors(prev => prev.filter(editor => editor.id !== editorId));
        
        // Add to rejected list
        setRejectedEditors(prev => [...prev, updatedUser]);
        
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

  // Masjid Management Functions
  const fetchMasjidEditors = async (masjidId: string) => {
    try {
      setIsLoadingEditors(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/masjid/${masjidId}/editors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch masjid editors: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setMasjidEditors(data.data);
      } else {
        console.warn("Format data editor masjid tidak sesuai:", data);
        setMasjidEditors([]);
      }
    } catch (error) {
      console.error("Error fetching masjid editors:", error);
      toast.error("Gagal memuat data editor masjid");
      setMasjidEditors([]);
    } finally {
      setIsLoadingEditors(false);
    }
  };

  const fetchMasjids = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/masjid`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch masjids: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setMasjids(data.data);
      } else {
        console.warn("Format data masjid tidak sesuai:", data);
        setMasjids([]);
      }
    } catch (error) {
      console.error("Error fetching masjids:", error);
      toast.error("Gagal memuat data masjid");
      setMasjids([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createMasjid = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!masjidForm.nama_masjid || !masjidForm.alamat) {
        toast.error("Nama masjid dan alamat harus diisi");
        return false;
      }

      const response = await fetch(`${API_URL}/api/masjid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(masjidForm),
      });

      if (!response.ok) {
        throw new Error(`Failed to create masjid: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Masjid berhasil ditambahkan");
        fetchMasjids();
        resetMasjidForm();
        return true;
      } else {
        throw new Error(data.message || "Gagal menambahkan masjid");
      }
    } catch (error) {
      console.error("Error creating masjid:", error);
      toast.error("Gagal menambahkan masjid");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMasjid = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!selectedMasjid?.id || !masjidForm.nama_masjid || !masjidForm.alamat) {
        toast.error("Nama masjid dan alamat harus diisi");
        return false;
      }

      const response = await fetch(`${API_URL}/api/masjid/${selectedMasjid.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(masjidForm),
      });

      if (!response.ok) {
        throw new Error(`Failed to update masjid: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Masjid berhasil diperbarui");
        fetchMasjids();
        resetMasjidForm();
        return true;
      } else {
        throw new Error(data.message || "Gagal memperbarui masjid");
      }
    } catch (error) {
      console.error("Error updating masjid:", error);
      toast.error("Gagal memperbarui masjid");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMasjid = async (masjidId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/masjid/${masjidId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete masjid: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Masjid berhasil dihapus");
        // Update UI by removing the deleted masjid
        setMasjids(prev => prev.filter(masjid => masjid.id !== masjidId));
        return true;
      } else {
        throw new Error(data.message || "Gagal menghapus masjid");
      }
    } catch (error) {
      console.error("Error deleting masjid:", error);
      toast.error("Gagal menghapus masjid");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetMasjidForm = () => {
    setMasjidForm({
      nama_masjid: '',
      alamat: '',
    });
    setSelectedMasjid(null);
    setIsMasjidFormOpen(false);
  };

  // UI Helper Functions
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
      console.log("Error parsing date:", e);
      return dateString;
    }
  };

  const getFilteredEditors = () => {
    let editors: User[] = [];
    
    switch(currentApprovalTab) {
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
      user.nama?.toLowerCase().includes(editorSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(editorSearch.toLowerCase()) ||
      user.nama_masjid?.toLowerCase().includes(editorSearch.toLowerCase())
    );
  };

  const getFilteredMasjids = () => {
    return masjids.filter((masjid) => 
      masjid.nama_masjid?.toLowerCase().includes(masjidSearch.toLowerCase()) ||
      masjid.alamat?.toLowerCase().includes(masjidSearch.toLowerCase())
    );
  };

  const filteredEditors = getFilteredEditors();
  const totalEditorPages = Math.ceil(filteredEditors.length / ITEMS_PER_PAGE);
  const displayedEditors = filteredEditors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filteredMasjids = getFilteredMasjids();
  const totalMasjidPages = Math.ceil(filteredMasjids.length / ITEMS_PER_PAGE);
  const displayedMasjids = filteredMasjids.slice(
    (masjidCurrentPage - 1) * ITEMS_PER_PAGE,
    masjidCurrentPage * ITEMS_PER_PAGE
  );

  const showConfirmDialog = (type: 'approve' | 'reject' | 'delete-masjid', user: User | null = null, masjid: Masjid | null = null) => {
    if (type === 'delete-masjid' && masjid) {
      setConfirmAction({ type, user: null, masjid });
    } else if (user) {
      setConfirmAction({ type, user });
    }
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    let success = false;
    
    if (confirmAction.type === 'approve' && confirmAction.user) {
      success = await approveEditor(confirmAction.user.id);
    } else if (confirmAction.type === 'reject' && confirmAction.user) {
      success = await rejectEditor(confirmAction.user.id);
    } else if (confirmAction.type === 'delete-masjid' && confirmAction.masjid) {
      success = await deleteMasjid(confirmAction.masjid.id);
    }
    
    if (success) {
      setIsConfirmDialogOpen(false);
      if (isDetailsOpen) setIsDetailsOpen(false);
      if (isMasjidDetailsOpen) setIsMasjidDetailsOpen(false);
    }
  };

  const showUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const showMasjidDetails = (masjid: Masjid) => {
    setSelectedMasjid(masjid);
    setMasjidEditors([]);
    setIsLoadingEditors(true);
    fetchMasjidEditors(masjid.id);
    setIsMasjidDetailsOpen(true);
  };

  const showAddMasjidForm = () => {
    resetMasjidForm();
    setMasjidFormMode('add');
    setIsMasjidFormOpen(true);
  };

  const showEditMasjidForm = (masjid: Masjid) => {
    setSelectedMasjid(masjid);
    setMasjidForm({
      nama_masjid: masjid.nama_masjid,
      alamat: masjid.alamat
    });
    setMasjidFormMode('edit');
    setIsMasjidFormOpen(true);
  };

  const handleMasjidFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (masjidFormMode === 'add') {
      const success = await createMasjid();
      if (success) setIsMasjidFormOpen(false);
    } else {
      const success = await updateMasjid();
      if (success) setIsMasjidFormOpen(false);
    }
  };

  const handleMasjidFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMasjidForm({
      ...masjidForm,
      [name]: value
    });
  };

  return (
    <Card className="mx-auto mt-6 max-w-[70rem] p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Admin Dashboard</h2>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="approval" value={currentTab} onValueChange={setCurrentTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="approval" className="relative">
              Persetujuan Editor
              {pendingEditors.length > 0 && (
                <Badge className="ml-2 bg-amber-500">{pendingEditors.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="masjid">
              Manajemen Masjid
              {masjids.length > 0 && (
                <Badge className="ml-2 bg-blue-500">{masjids.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Editor Approval Tab Content */}
          <TabsContent value="approval" className="space-y-4">
            <Tabs defaultValue="pending" value={currentApprovalTab} onValueChange={setCurrentApprovalTab} className="mb-6">
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
                    value={editorSearch}
                    onChange={(e) => setEditorSearch(e.target.value)}
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
                                {user.dokumen_view_link && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center text-purple-600"
                                    onClick={() => window.open(user.dokumen_view_link, '_blank')}
                                  >
                                    Dokumen
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center text-green-600"
                                  onClick={() => showConfirmDialog('approve', user)}
                                >
                                  <UserCheck className="w-4 h-4 mr-1" /> Setujui
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex items-center text-red-600"
                                  onClick={() => showConfirmDialog('reject', user)}
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
                                  onClick={() => showConfirmDialog('approve', user)}
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

            {/* Editor Approval Pagination */}
            {totalEditorPages > 0 && (
              <div className="flex justify-center mt-4 space-x-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-[#3A786D] text-white"
                >
                  Previous
                </Button>
                {Array.from({ length: totalEditorPages }, (_, i) => (
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
                  disabled={currentPage === totalEditorPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-[#3A786D] text-white"
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Masjid Management Tab Content */}
          <TabsContent value="masjid" className="space-y-4">
            <div className="flex justify-between mb-4 items-center">
              <div className="flex relative w-2/5 gap-2">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Cari berdasarkan nama masjid atau alamat"
                  value={masjidSearch}
                  onChange={(e) => setMasjidSearch(e.target.value)}
                  className="pl-10"
                />
                <Button variant="outline" className="flex items-center">
                  <ArrowUpDown className="w-4 h-4 mr-2" /> Sort
                </Button>
              </div>
              <Button 
                className="bg-[#3A786D] text-white flex items-center" 
                onClick={showAddMasjidForm}
              >
                <Plus className="w-4 h-4 mr-2" /> Tambah Masjid
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Nama Masjid</TableHead>
                    <TableHead>Alamat</TableHead>
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
                  ) : displayedMasjids.length > 0 ? (
                    displayedMasjids.map((masjid) => (
                      <TableRow key={masjid.id}>
                        <TableCell className="font-medium">{masjid.nama_masjid}</TableCell>
                        <TableCell>{masjid.alamat}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center text-blue-600"
                              onClick={() => showMasjidDetails(masjid)}
                            >
                              <Users className="w-4 h-4 mr-1" /> Editors
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center text-amber-600"
                              onClick={() => showEditMasjidForm(masjid)}
                            >
                              <Pencil className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center text-red-600"
                              onClick={() => showConfirmDialog('delete-masjid', null, masjid)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Tidak ada data masjid
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Masjid Management Pagination */}
            {totalMasjidPages > 0 && (
              <div className="flex justify-center mt-4 space-x-2">
                <Button
                  disabled={masjidCurrentPage === 1}
                  onClick={() => setMasjidCurrentPage(masjidCurrentPage - 1)}
                  className="bg-[#3A786D] text-white"
                >
                  Previous
                </Button>
                {Array.from({ length: totalMasjidPages }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => setMasjidCurrentPage(i + 1)}
                    className={`${
                      masjidCurrentPage === i + 1 ? "bg-[#3A786D] text-white" : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  disabled={masjidCurrentPage === totalMasjidPages}
                  onClick={() => setMasjidCurrentPage(masjidCurrentPage + 1)}
                  className="bg-[#3A786D] text-white"
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

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

                {selectedUser.dokumen_file_name && (
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-medium text-gray-700">Dokumen Pendaftaran</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-gray-600">{selectedUser.dokumen_file_name}</p>
                        <p className="text-sm text-gray-500">{selectedUser.dokumen_file_type}</p>
                      </div>
                      <div className="flex gap-2">
                        {selectedUser.dokumen_view_link && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(selectedUser.dokumen_view_link, '_blank')}
                          >
                            Lihat
                          </Button>
                        )}
                        {selectedUser.dokumen_pendaftaran && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(selectedUser.dokumen_pendaftaran, '_blank')}
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              {selectedUser?.status === "Pending" && (
                <>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => showConfirmDialog('reject', selectedUser)}
                  >
                    <UserX className="w-4 h-4 mr-2" /> Tolak
                  </Button>
                  <Button 
                    className="bg-[#3A786D] text-white"
                    onClick={() => showConfirmDialog('approve', selectedUser)}
                  >
                    <UserCheck className="w-4 h-4 mr-2" /> Setujui
                  </Button>
                </>
              )}
              
              {selectedUser?.status === "Rejected" && (
                <Button 
                  className="bg-[#3A786D] text-white"
                  onClick={() => showConfirmDialog('approve', selectedUser)}
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

        <Dialog open={isMasjidDetailsOpen} onOpenChange={setIsMasjidDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Masjid & Daftar Editor</DialogTitle>
            </DialogHeader>
            
            {selectedMasjid && (
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <Building className="w-10 h-10 text-gray-500" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedMasjid.nama_masjid}</h3>
                    <p className="text-gray-600">{selectedMasjid.alamat}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-lg font-medium flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-600" /> 
                    Daftar Editor ({masjidEditors.length})
                  </h4>
                  
                  {isLoadingEditors ? (
                    <div className="text-center py-6">
                      <p>Memuat daftar editor...</p>
                    </div>
                  ) : masjidEditors.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100">
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {masjidEditors.map((editor) => (
                            <TableRow key={editor.id}>
                              <TableCell className="font-medium">{editor.nama}</TableCell>
                              <TableCell>{editor.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border">
                      <p className="text-gray-500">Belum ada editor terdaftar untuk masjid ini</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                className="text-amber-600 border-amber-600 hover:bg-amber-50"
                onClick={() => {
                  setIsMasjidDetailsOpen(false);
                  showEditMasjidForm(selectedMasjid!);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" /> Edit Masjid
              </Button>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => {
                  setIsMasjidDetailsOpen(false);
                  showConfirmDialog('delete-masjid', null, selectedMasjid!);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Hapus Masjid
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsMasjidDetailsOpen(false)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Masjid Form Dialog */}
        <Dialog open={isMasjidFormOpen} onOpenChange={setIsMasjidFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{masjidFormMode === 'add' ? 'Tambah Masjid Baru' : 'Edit Masjid'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleMasjidFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama_masjid">Nama Masjid *</Label>
                <Input
                  id="nama_masjid"
                  name="nama_masjid"
                  value={masjidForm.nama_masjid}
                  onChange={handleMasjidFormChange}
                  required
                  placeholder="Nama Masjid"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat *</Label>
                <Textarea
                  id="alamat"
                  name="alamat"
                  value={masjidForm.alamat}
                  onChange={handleMasjidFormChange}
                  required
                  placeholder="Alamat Lengkap"
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetMasjidForm}>
                  Batal
                </Button>
                <Button type="submit" className="bg-[#3A786D] text-white" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : masjidFormMode === 'add' ? "Tambahkan" : "Simpan Perubahan"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Konfirmasi</DialogTitle>
              <DialogDescription>
                {confirmAction.type === 'approve' 
                  ? `Apakah Anda yakin ingin menyetujui ${confirmAction.user?.nama || ''} sebagai editor?`
                  : confirmAction.type === 'reject'
                  ? `Apakah Anda yakin ingin menolak ${confirmAction.user?.nama || ''} sebagai editor?`
                  : `Apakah Anda yakin ingin menghapus masjid ${confirmAction.masjid?.nama_masjid || ''}?`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmDialogOpen(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button 
                className={
                  confirmAction.type === 'approve' 
                    ? "bg-[#3A786D] text-white" 
                    : "bg-red-600 text-white"
                }
                onClick={handleConfirmAction}
                disabled={isLoading}
              >
                {isLoading 
                  ? "Memproses..." 
                  : confirmAction.type === 'approve' 
                    ? "Setujui" 
                    : confirmAction.type === 'reject'
                    ? "Tolak"
                    : "Hapus"
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}