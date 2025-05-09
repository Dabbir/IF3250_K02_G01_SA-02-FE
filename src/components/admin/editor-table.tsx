"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, UserX } from "lucide-react"
import type { User } from "@/types/user"
import { formatDisplayDate } from "@/utils/formatters"

interface EditorTableProps {
  editors: User[]
  isLoading: boolean
  onViewDetails: (user: User) => void
  onApprove: (user: User) => void
  onReject: (user: User) => void
  status: "Pending" | "Approved" | "Rejected"
}

export const EditorTable = ({ editors, isLoading, onViewDetails, onApprove, onReject, status }: EditorTableProps) => {
  return (
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
          ) : editors.length > 0 ? (
            editors.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.nama}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.nama_masjid || "-"}</TableCell>
                <TableCell>{formatDisplayDate(user.created_at)}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      status === "Approved" ? "bg-green-500" : status === "Rejected" ? "bg-red-500" : "bg-amber-500"
                    }
                  >
                    {status === "Approved" ? "Disetujui" : status === "Rejected" ? "Ditolak" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-blue-600"
                      onClick={() => onViewDetails(user)}
                    >
                      Detail
                    </Button>

                    {status === "Pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center text-green-600"
                          onClick={() => onApprove(user)}
                        >
                          <UserCheck className="w-4 h-4 mr-1" /> Setujui
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center text-red-600"
                          onClick={() => onReject(user)}
                        >
                          <UserX className="w-4 h-4 mr-1" /> Tolak
                        </Button>
                      </>
                    )}

                    {status === "Rejected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center text-green-600"
                        onClick={() => onApprove(user)}
                      >
                        <UserCheck className="w-4 h-4 mr-1" /> Setujui
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                {status === "Pending"
                  ? "Tidak ada editor pending"
                  : status === "Approved"
                    ? "Tidak ada editor yang disetujui"
                    : "Tidak ada editor yang ditolak"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
