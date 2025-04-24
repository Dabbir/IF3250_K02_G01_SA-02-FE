"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Eye, CheckCircle, XCircle, Building, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_HOST_NAME;

interface Masjid {
  id: number;
  nama_masjid: string;
  alamat: string;
  created_at?: string;
  updated_at?: string;
}

interface ViewerRequest {
  id: string;
  viewer_id: string;
  viewer_nama: string;
  viewer_email: string;
  viewer_foto?: string;
  masjid_id: string;
  nama_masjid: string;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
  expires_at?: string;
}

const ITEMS_PER_PAGE = 10;

export default function ViewerAccessManagement() {
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState("available-masjids");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    type: "request" | "approve" | "reject" | "remove";
    itemId: string;
    itemName: string;
  } | null>(null);

  const [availableMasjids, setAvailableMasjids] = useState<Masjid[]>([]);
  const [accessibleMasjids, setAccessibleMasjids] = useState<Masjid[]>([]);
  const [pendingViewerRequests, setPendingViewerRequests] = useState<ViewerRequest[]>([]);
  const [approvedViewers, setApprovedViewers] = useState<ViewerRequest[]>([]);
  const [userMasjidId, setUserMasjidId] = useState<string | null>(null);
  
  useEffect(() => {
    const getUserMasjidId = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        
        const response = await fetch(`${API_URL}/api/users/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        
        const userData = await response.json();
        if (userData.success && userData.user) {
          setUserMasjidId(userData.user.masjid_id);
          return userData.user.masjid_id;
        } else if (userData.user.id) {
          setUserMasjidId(userData.user.masjid_id);
          return userData.user.masjid_id;
        }
        
        return null;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    };
  
    (async () => {
      const masjidId = await getUserMasjidId();
      if (masjidId) {
        fetchData(masjidId);
      }
    })();
  }, []);

  const fetchData = async (masjidId: string) => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchAvailableMasjids(),
        fetchAccessibleMasjids(),
        fetchPendingViewerRequests(masjidId),
        fetchApprovedViewers(masjidId)
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableMasjids = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/masjid`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch available masjids: ${response.status}`);
      }
  
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setAvailableMasjids(result.data);
        console.log("Available Masjids woi:", availableMasjids);
        console.log("Available Masjids:", result.data.map((masjid: Masjid) => masjid.nama_masjid));
      } else {
        console.warn("Format data tidak sesuai:", result);
        setAvailableMasjids([]);
      }
    } catch (error) {
      console.error("Error fetching available masjids:", error);
      setAvailableMasjids([]);
    }
  };

  const fetchAccessibleMasjids = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/access/masjids`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch accessible masjids: ${response.status}`);
      }

      const data = await response.json();
      console.log("Accessible Masjids:", data.data);
      if (data.success && Array.isArray(data.data)) {
        setAccessibleMasjids(data.data);
      } else {
        console.warn("Format data tidak sesuai:", data);
        setAccessibleMasjids([]);
      }
    } catch (error) {
      console.error("Error fetching accessible masjids:", error);
      setAccessibleMasjids([]);
    }
  };

  const fetchPendingViewerRequests = async (masjidId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/access/viewers/pending/masjid/${masjidId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pending viewer requests: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setPendingViewerRequests(data.data);
      } else {
        console.warn("Format data tidak sesuai:", data);
        setPendingViewerRequests([]);
      }
    } catch (error) {
      console.error("Error fetching pending viewer requests:", error);
      setPendingViewerRequests([]);
    }
  };

  const fetchApprovedViewers = async (masjidId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/access/viewers/masjid/${masjidId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch approved viewers: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setApprovedViewers(data.data);
      } else {
        console.warn("Format data tidak sesuai:", data);
        setApprovedViewers([]);
      }
    } catch (error) {
      console.error("Error fetching approved viewers:", error);
      setApprovedViewers([]);
    }
  };

  const requestViewerAccess = async (masjidId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/access/viewers/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ masjidId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to request viewer access: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Permintaan akses berhasil dikirim");
        await fetchAccessibleMasjids();
        return true;
      } else {
        throw new Error(data.message || "Gagal mengirim permintaan akses");
      }
    } catch (error) {
      console.error("Error requesting viewer access:", error);
      toast.error(error instanceof Error ? error.message : "Gagal mengirim permintaan akses");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const approveViewerRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/access/viewers/${requestId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ masjidId: userMasjidId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to approve viewer request: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Permintaan akses viewer berhasil disetujui");
        
        if (userMasjidId) {
          await Promise.all([
            fetchPendingViewerRequests(userMasjidId),
            fetchApprovedViewers(userMasjidId)
          ]);
        }
        return true;
      } else {
        throw new Error(data.message || "Gagal menyetujui permintaan akses");
      }
    } catch (error) {
      console.error("Error approving viewer request:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menyetujui permintaan akses");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectViewerRequest = async (requestId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/access/viewers/${requestId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ masjidId: userMasjidId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to reject viewer request: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Permintaan akses viewer berhasil ditolak");
        
        if (userMasjidId) {
          await fetchPendingViewerRequests(userMasjidId);
        }
        return true;
      } else {
        throw new Error(data.message || "Gagal menolak permintaan akses");
      }
    } catch (error) {
      console.error("Error rejecting viewer request:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menolak permintaan akses");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeViewerAccess = async (requestId: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/access/viewers/${requestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ masjidId: userMasjidId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to remove viewer access: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success("Akses viewer berhasil dihapus");
        
        if (userMasjidId) {
          await fetchApprovedViewers(userMasjidId);
        }
        return true;
      } else {
        throw new Error(data.message || "Gagal menghapus akses viewer");
      }
    } catch (error) {
      console.error("Error removing viewer access:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menghapus akses viewer");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
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

  const handleAction = async () => {
    if (!currentAction) return;

    switch (currentAction.type) {
      case "request":
        await requestViewerAccess(currentAction.itemId);
        break;
      case "approve":
        await approveViewerRequest(currentAction.itemId);
        break;
      case "reject":
        await rejectViewerRequest(currentAction.itemId);
        break;
      case "remove":
        await removeViewerAccess(currentAction.itemId);
        break;
    }
    setIsConfirmOpen(false);
    setCurrentAction(null);
  };

  const confirmAction = (type: "request" | "approve" | "reject" | "remove", itemId: string, itemName: string) => {
    setCurrentAction({ type, itemId, itemName });
    setIsConfirmOpen(true);
  };

  const getFilteredItems = () => {
    let items: Masjid[] | ViewerRequest[] = [];
    
    switch(currentTab) {
      case "available-masjids":
        items = availableMasjids.filter(masjid => 
          !accessibleMasjids.some(access => access.id === masjid.id) &&
          String(masjid.id) !== userMasjidId
        );
        break;
      case "my-access":
        items = accessibleMasjids.filter(masjid => String(masjid.id) !== userMasjidId);
        break;
      case "pending-requests":
        items = pendingViewerRequests;
        break;
      case "approved-viewers":
        items = approvedViewers;
        break;
    }
    
    if (search) {
      return items.filter((item) => {
        const masjidItem = item as Masjid;
        const viewerItem = item as ViewerRequest;
        
        if ('nama_masjid' in item && masjidItem.nama_masjid) {
          return masjidItem.nama_masjid.toLowerCase().includes(search.toLowerCase());
        } 
        else if ('viewer_nama' in item) {
          return (
            (viewerItem.viewer_nama && viewerItem.viewer_nama.toLowerCase().includes(search.toLowerCase())) ||
            (viewerItem.viewer_email && viewerItem.viewer_email.toLowerCase().includes(search.toLowerCase()))
          );
        }
        return false;
      });
    }
    
    return items;
  };

  const filteredItems = getFilteredItems();
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const displayedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getActionText = () => {
    if (!currentAction) return "";
    
    switch (currentAction.type) {
      case "request":
        return `meminta akses ke ${currentAction.itemName}`;
      case "approve":
        return `menyetujui permintaan akses dari ${currentAction.itemName}`;
      case "reject":
        return `menolak permintaan akses dari ${currentAction.itemName}`;
      case "remove":
        return `mencabut akses viewer dari ${currentAction.itemName}`;
    }
  };

  const renderAvailableMasjids = () => (
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
            <TableCell colSpan={3} className="text-center py-4">
              Sedang memuat data...
            </TableCell>
          </TableRow>
        ) : displayedItems.length > 0 ? (
          displayedItems
            .filter((item): item is Masjid => 'alamat' in item)
            .map((masjid: Masjid) => (
              <TableRow key={masjid.id}>
                <TableCell className="font-medium">{masjid.nama_masjid}</TableCell>
                <TableCell>{masjid.alamat || "-"}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center text-blue-600"
                    onClick={() => confirmAction("request", String(masjid.id), masjid.nama_masjid)}
                  >
                    <Eye className="w-4 h-4 mr-1" /> Minta Akses
                  </Button>
                </TableCell>
              </TableRow>
            ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              Tidak ada masjid yang tersedia untuk diminta aksesnya
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderMyAccess = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead>Nama Masjid</TableHead>
          <TableHead>Alamat</TableHead>
          <TableHead>Tipe Akses</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              Sedang memuat data...
            </TableCell>
          </TableRow>
        ) : displayedItems.length > 0 ? (
          displayedItems
            .filter((item): item is Masjid => 'alamat' in item)
            .map((masjid) => (
              <TableRow key={masjid.id}>
                <TableCell className="font-medium">{masjid.nama_masjid}</TableCell>
                <TableCell>{masjid.alamat || "-"}</TableCell>
              </TableRow>
            ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              Anda belum memiliki akses ke masjid lain
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderPendingRequests = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tanggal Permintaan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Sedang memuat data...
            </TableCell>
          </TableRow>
        ) : displayedItems.length > 0 ? (
          displayedItems
            .filter((item): item is ViewerRequest => 'viewer_id' in item)
            .map((request: ViewerRequest) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.viewer_nama}</TableCell>
              <TableCell>{request.viewer_email}</TableCell>
              <TableCell>{formatDate(request.created_at)}</TableCell>
              <TableCell>
                <Badge className="bg-amber-500">Pending</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center text-green-600"
                    onClick={() => confirmAction("approve", request.id, request.viewer_nama)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Setujui
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center text-red-600"
                    onClick={() => confirmAction("reject", request.id, request.viewer_nama)}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Tolak
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Tidak ada permintaan akses yang menunggu persetujuan
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderApprovedViewers = () => (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tanggal Disetujui</TableHead>
          <TableHead>Masa Berlaku</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Sedang memuat data...
            </TableCell>
          </TableRow>
        ) : displayedItems.length > 0 ? (
          displayedItems
            .filter((item): item is ViewerRequest => 'viewer_id' in item)
            .map((viewer: ViewerRequest) => (
            <TableRow key={viewer.id}>
              <TableCell className="font-medium">{viewer.viewer_nama}</TableCell>
              <TableCell>{viewer.viewer_email}</TableCell>
              <TableCell>{formatDate(viewer.created_at)}</TableCell>
              <TableCell>{viewer.expires_at ? formatDate(viewer.expires_at) : "Tidak ada batas"}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center text-red-600"
                  onClick={() => confirmAction("remove", viewer.id, viewer.viewer_nama)}
                >
                  <EyeOff className="w-4 h-4 mr-1" /> Cabut Akses
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Tidak ada viewer yang disetujui
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Manajemen Akses Masjid</h2>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="available-masjids" value={currentTab} onValueChange={(value) => {
          setCurrentTab(value);
          setCurrentPage(1);
          setSearch("");
        }} className="mb-6">
          <TabsList className="mb-4 grid grid-cols-4 gap-2">
            <TabsTrigger value="available-masjids">Masjid Tersedia</TabsTrigger>
            <TabsTrigger value="my-access">Akses Saya</TabsTrigger>
            <TabsTrigger value="pending-requests">
              Permintaan Masuk
              {pendingViewerRequests.length > 0 && (
                <Badge className="ml-2 bg-amber-500">{pendingViewerRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved-viewers">Viewer Masjid Saya</TabsTrigger>
          </TabsList>

          <div className="flex justify-between mb-4 items-center">
            <div className="flex relative w-2/5 gap-2">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Cari..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="available-masjids" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              {renderAvailableMasjids()}
            </div>
          </TabsContent>

          <TabsContent value="my-access" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              {renderMyAccess()}
            </div>
          </TabsContent>

          <TabsContent value="pending-requests" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              {renderPendingRequests()}
            </div>
          </TabsContent>

          <TabsContent value="approved-viewers" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              {renderApprovedViewers()}
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

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Konfirmasi</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Apakah Anda yakin ingin {getActionText()}?</p>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmOpen(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button 
                className="bg-[#3A786D] text-white"
                onClick={handleAction}
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Ya, Lanjutkan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}