"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { UserData, FormErrors } from "@/types/user"

interface ProfileFormProps {
    userData: UserData
    errors: FormErrors
    isEditing: boolean
    alasanLength: number
    bioLength: number
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleBlur: () => void
}

export default function ProfileForm({
    userData,
    errors,
    isEditing,
    alasanLength,
    bioLength,
    handleChange,
    handleInputChange,
    handleBlur,
}: ProfileFormProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 order-1">
                <div className="space-y-2">
                    <label htmlFor="namaDepan" className="block text-sm font-medium text-slate-700">
                        Nama Depan
                    </label>
                    <Input
                        data-cy="namaDepan-input"
                        id="namaDepan"
                        name="namaDepan"
                        value={userData.namaDepan}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        className={`border ${errors.namaDepan ? "border-red-500" : "border-[var(--green)]"}`}
                    />
                    {errors.namaDepan && <span className="text-red-500 text-xs">{errors.namaDepan}</span>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="namaBelakang" className="block text-sm font-medium text-slate-700">
                        Nama Belakang
                    </label>
                    <Input
                        data-cy="namaBelakang-input"
                        id="namaBelakang"
                        name="namaBelakang"
                        value={userData.namaBelakang}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="border-[var(--green)]"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <Input
                        data-cy="email-input"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        className={`border ${errors.email ? "border-red-500" : "border-[var(--green)]"}`}
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>
            </div>

            <div className="space-y-1 order-2">
                <div className="space-y-2">
                    <label htmlFor="alasanBergabung" className="block text-sm font-medium text-slate-700">
                        Alasan Bergabung
                    </label>
                    <Textarea
                        data-cy="alasanBergabung-textarea"
                        id="alasanBergabung"
                        name="alasanBergabung"
                        value={userData.alasanBergabung}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        className={`${isEditing ? "h-15" : "h-18"} border ${errors.alasanBergabung ? "border-red-500" : "border-[var(--green)]"
                            }`}
                    />
                    <div className="flex flex-row">
                        {errors.alasanBergabung && <span className="text-red-500 text-xs">{errors.alasanBergabung}</span>}
                        {isEditing && <p className="text-xs text-gray-500 ml-auto">{alasanLength}/100</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
                        Bio
                    </label>
                    <Textarea
                        data-cy="bio-textarea"
                        id="bio"
                        name="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`${isEditing ? "h-19" : "h-21"} border-[var(--green)]`}
                    />
                    {isEditing && <p className="text-end text-xs text-gray-500">{bioLength}/300</p>}
                </div>
            </div>
        </div>
    )
}
