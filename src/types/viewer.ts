export interface ViewerRequest {
  id: string
  viewer_id: string
  viewer_nama: string
  viewer_email: string
  viewer_foto?: string
  masjid_id: string
  nama_masjid: string
  status: "Pending" | "Approved" | "Rejected"
  created_at: string
  expires_at?: string
}

export type ActionType = "request" | "approve" | "reject" | "remove"

export interface CurrentAction {
  type: ActionType
  itemId: string
  itemName: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}
