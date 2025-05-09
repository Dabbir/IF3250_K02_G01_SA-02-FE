"use client"

import type React from "react"

import { FileText } from "lucide-react"

interface FileUploadProps {
  selectedFile: File | null
  onChange: (file: File) => void
}

export const FileUpload = ({ selectedFile, onChange }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0])
    }
  }

  return (
    <div
      className="flex flex-col py-4 items-center justify-center w-full border gap-3 border-gray-300 rounded p-3 hover:bg-gray-100 cursor-pointer transition-colors"
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <FileText className="text-[#9E9E9E] w-10 h-10 md:w-14 md:h-14" />
      <input type="file" className="hidden" id="file-upload" accept=".pdf" onChange={handleFileChange} />
      <label htmlFor="file-upload" className="cursor-pointer text-[#9E9E9E] text-center">
        {selectedFile ? selectedFile.name : "Dokumen PDF (maksimal 10 MB)"}
      </label>
    </div>
  )
}
