"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"
import type { ViewerRequest } from "@/types/viewer"
import { formatDisplayDate } from "@/utils/formatters"

interface PendingRequestsTableProps {
  isLoading: boolean
  displayedItems: ViewerRequest[]
  onApprove: (requestId: string, viewerName: string) => void
  onReject: (requestId: string, viewerName: string) => void
}

export const PendingRequestsTable = ({ isLoading, displayedItems, onApprove, onReject }: PendingRequestsTableProps) => {
  return (
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
          displayedItems.map((request: ViewerRequest) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.viewer_nama}</TableCell>
              <TableCell>{request.viewer_email}</TableCell>
              <TableCell>{formatDisplayDate(request.created_at)}</TableCell>
              <TableCell>
                <Badge className="bg-amber-500">Pending</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-green-600"
                    onClick={() => onApprove(request.id, request.viewer_nama)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Setujui
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-red-600"
                    onClick={() => onReject(request.id, request.viewer_nama)}
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
  )
}
