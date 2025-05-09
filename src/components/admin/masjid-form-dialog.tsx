"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Masjid, MasjidFormData } from "@/types/masjid"
import type { FormMode } from "@/types/common"
import { useState, useEffect } from "react"

interface MasjidFormDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mode: FormMode
  masjid: Masjid | null
  onSubmit: (formData: MasjidFormData) => Promise<void>
  isLoading: boolean
}

export const MasjidFormDialog = ({
  isOpen,
  onOpenChange,
  mode,
  masjid,
  onSubmit,
  isLoading,
}: MasjidFormDialogProps) => {
  const [formData, setFormData] = useState<MasjidFormData>({
    nama_masjid: "",
    alamat: "",
  })

  useEffect(() => {
    if (mode === "edit" && masjid) {
      setFormData({
        nama_masjid: masjid.nama_masjid,
        alamat: masjid.alamat,
      })
    } else {
      setFormData({
        nama_masjid: "",
        alamat: "",
      })
    }
  }, [mode, masjid, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Masjid Baru" : "Edit Masjid"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_masjid">Nama Masjid *</Label>
            <Input
              id="nama_masjid"
              name="nama_masjid"
              value={formData.nama_masjid}
              onChange={handleChange}
              required
              placeholder="Nama Masjid"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamat">Alamat *</Label>
            <Textarea
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              required
              placeholder="Alamat Lengkap"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className="bg-[#3A786D] text-white" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : mode === "add" ? "Tambahkan" : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
