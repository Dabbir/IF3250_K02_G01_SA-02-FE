"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import DashboardDisplay from "@/assets/dashboard-display.png"
import { MasjidDropdown } from "@/components/registration/masjid-dropdown"
import { FileUpload } from "@/components/registration/file-upload"
import { useMasjids } from "@/hooks/use-masjid"
import { useRegistration } from "@/hooks/use-registration"
import type { Masjid } from "@/types/masjid"

const RegisterDataDiri = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = location.state?.userId

  // State
  const [masjidId, setMasjidId] = useState<number | null>(null)
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null)
  const [alasan_bergabung, setAlasanBergabung] = useState("")
  const [short_bio, setBio] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Custom hooks
  const { masjids, isLoading: isLoadingMasjids, fetchMasjids } = useMasjids()
  const { isLoading: isRegistering, registerUser } = useRegistration()

  // Fetch masjid data when component mounts
  useEffect(() => {
    fetchMasjids()
  }, [fetchMasjids])

  const handleMasjidSelect = (masjid: Masjid) => {
    setMasjidId(Number(masjid.id))
    setSelectedMasjid(masjid)
  }

  const handleFileChange = (file: File) => {
    setSelectedFile(file)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedMasjid) {
      toast.error("Silakan pilih masjid.")
      return
    }

    if (alasan_bergabung.length < 8) {
      toast.error("Alasan bergabung harus lebih dari 8 karakter.")
      return
    }

    try {
      const userData = {
        masjid_id: masjidId,
        alasan_bergabung,
        short_bio,
      }

      const success = await registerUser(userId, userData, selectedFile)

      if (success) {
        navigate("/wait-verification")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Coba lagi nanti.")
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-white min-h-screen">
      {/* Left Side - Form (Full width on mobile, half on desktop) */}
      <div className="w-full md:w-1/2 z-10 flex flex-col justify-start p-4 md:p-8 lg:p-12 order-2 md:order-1 overflow-y-auto no-scrollbar">
        <div className="max-w-[430px] w-full mx-auto md:mx-0 md:ml-auto md:mr-12 lg:mr-24">
          <h1 className="text-3xl md:text-4xl lg:text-[48px] font-semibold font-cooper text-[#3A786D] tracking-[-1px] mb-4 md:mb-8">
            Data Diri
          </h1>

          <form onSubmit={handleRegister} className="w-full">
            <div className="mb-4">
              <label className="block text-sm font-cooper mb-2">Asal Masjid</label>
              <MasjidDropdown
                masjidList={masjids}
                selectedMasjid={selectedMasjid}
                onSelect={handleMasjidSelect}
                isLoading={isLoadingMasjids}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-cooper mb-2">Alasan Bergabung</label>
              <textarea
                placeholder="Masukkan alasan bergabung"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none h-24"
                value={alasan_bergabung}
                onChange={(e) => setAlasanBergabung(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-cooper mb-2">Bio</label>
              <textarea
                placeholder="Masukkan bio Anda"
                className="font-cooper w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none h-24"
                value={short_bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-cooper">Unggah Bukti Keanggotaan</label>
              <p className="text-sm text-[#9E9E9E] py-2 font-cooper">
                Lampirkan bukti keanggotaan dengan mengunggah surat keterangan aktif DKM terkait atau bukti keanggotaan
                lainnya
              </p>
              <FileUpload selectedFile={selectedFile} onChange={handleFileChange} />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-700 hover:bg-teal-800 text-[#FBFAF8] py-2 rounded-md transition-colors h-10 mb-8 md:mb-0"
              disabled={isRegistering}
            >
              {isRegistering ? "Memproses..." : "Daftar"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Image (Hidden on small screens, shown on md and up) */}
      <div className="relative w-full md:w-1/2 h-40 md:h-full order-1 md:order-2 overflow-hidden">
        {/* Skewed edge - Hidden on mobile */}
        <div
          className="absolute top-0 bottom-0 left-0 w-24 bg-white hidden md:block"
          style={{
            transform: "skewX(-6deg) translateX(-50%)",
            zIndex: 5,
            height: "100vh",
          }}
        ></div>

        <div className="h-full w-full bg-[#E7DECD] flex flex-col items-center justify-center pt-4 md:pt-12 px-4 md:px-8">
          <img src="/logo-green.svg" className="w-40 md:w-70" alt="Logo" />
          <div className="py-2 md:py-8 hidden md:block">
            <img src={DashboardDisplay || "/placeholder.svg"} alt="Dashboard Preview" className="max-w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterDataDiri
