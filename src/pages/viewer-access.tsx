"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building, Search } from "lucide-react"
import { useViewerAccess } from "@/hooks/use-vieweraccess"
import { AvailableMasjidsTable } from "@/components/vieweraccess/available-masjids-table"
import { MyAccessTable } from "@/components/vieweraccess/my-access-table"
import { PendingRequestsTable } from "@/components/vieweraccess/pending-requests-table"
import { ApprovedViewersTable } from "@/components/vieweraccess/approved-viewers-access"
import Pagination from "@/components/pagination/pagination"
import { ConfirmationDialog } from "@/components/vieweraccess/confirmation-dialog"
import type { ViewerRequest } from "@/types/viewer"
import type { Masjid } from "@/types/masjid"

export default function ViewerAccessManagement() {
  const {
    search,
    currentTab,
    currentPage,
    isLoading,
    isConfirmOpen,
    currentAction,
    pendingViewerRequests,
    displayedItems,
    totalPages,
    setCurrentPage,
    setIsConfirmOpen,
    confirmAction,
    handleAction,
    changeTab,
    handleSearch,
  } = useViewerAccess()

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Building className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Manajemen Akses Masjid</h2>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="available-masjids" value={currentTab} onValueChange={changeTab} className="mb-6">
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
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <TabsContent value="available-masjids" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <AvailableMasjidsTable
                isLoading={isLoading}
                displayedItems={displayedItems as Masjid[]}
                onRequestAccess={(masjidId, masjidName) => confirmAction("request", masjidId, masjidName)}
              />
            </div>
          </TabsContent>

          <TabsContent value="my-access" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <MyAccessTable isLoading={isLoading} displayedItems={displayedItems as Masjid[]} />
            </div>
          </TabsContent>

          <TabsContent value="pending-requests" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <PendingRequestsTable
                isLoading={isLoading}
                displayedItems={displayedItems as ViewerRequest[]}
                onApprove={(requestId, viewerName) => confirmAction("approve", requestId, viewerName)}
                onReject={(requestId, viewerName) => confirmAction("reject", requestId, viewerName)}
              />
            </div>
          </TabsContent>

          <TabsContent value="approved-viewers" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <ApprovedViewersTable
                isLoading={isLoading}
                displayedItems={displayedItems as ViewerRequest[]}
                onRemoveAccess={(requestId, viewerName) => confirmAction("remove", requestId, viewerName)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        <ConfirmationDialog
          isOpen={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleAction}
          actionType={currentAction?.type || null}
          itemName={currentAction?.itemName || ""}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}
