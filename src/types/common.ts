export interface ConfirmAction {
  type: "approve" | "reject" | "delete-masjid"
  user: User | null
  masjid?: Masjid
}

export type FormMode = "add" | "edit"

export const ITEMS_PER_PAGE = 10

import type { User } from "./user"
import type { Masjid } from "./masjid"
