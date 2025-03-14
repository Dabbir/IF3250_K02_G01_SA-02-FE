"use client"

import type React from "react"

import { useState } from "react"
import { Image, Pencil, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

export default function ManajemenAkun() {
    const [isEditing, setIsEditing] = useState(false)
    const [userData, setUserData] = useState({
        namaDepan: "Mirwandi",
        namaBelakang: "Maizori",
        email: "MirMai@salman.sustain.org.id",
        alasanBergabung: "Memakmurkan masjid",
        bio: "Hidup bermanfaat untuk siapa saja",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsEditing(false)
        // integration later
    }

    const handleCancel = () => {
        setIsEditing(false)
        // integration later
    }

    return (
        <div className="m-5">
            <Card className="w-full h-[calc(85vh)] p-5 mx-auto border-0 shadow-inner">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                        <User className="h-6 w-6 text-slate-700" />
                        <h2 className="text-xl font-medium text-slate-700">Manajemen Akun</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <div className="flex items-center relative gap-10">
                                <div className="w-36 h-36">
                                    <Avatar className="w-full h-full rounded-full bg-slate-200">
                                        <AvatarImage src="/path-to-profile.jpg" alt="User Profile" />
                                        <AvatarFallback className="flex items-center justify-center text-slate-400 text-4xl">
                                            <div className="w-36 h-36 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="80"
                                                    height="80"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#9ca3af"
                                                    strokeWidth="1"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                            </div>
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex flex-col space-y-6 mt-4 justify-center md:justify-start">
                                    <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
                                        <Image className="h-4 w-4 mr-2" />
                                        Ubah
                                    </Button>
                                    <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col text-end space-y-2">
                            <h3 className="text-xl font-medium text-slate-700">Masjid Salman ITB</h3>
                            <p className="text-sm text-slate-600">Jalan Ganesha 10, Coblong, Bandung</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        {!isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-300"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                        {isEditing && <div className="h-8 invisible" />}
                    </div>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="namaDepan" className="block text-sm font-medium text-slate-700">
                                    Nama Depan
                                </label>
                                <Input
                                    id="namaDepan"
                                    name="namaDepan"
                                    value={userData.namaDepan}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="border-slate-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="alasanBergabung" className="block text-sm font-medium text-slate-700">
                                    Alasan Bergabung
                                </label>
                                <Input
                                    id="alasanBergabung"
                                    name="alasanBergabung"
                                    value={userData.alasanBergabung}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="border-slate-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="namaBelakang" className="block text-sm font-medium text-slate-700">
                                    Nama Belakang
                                </label>
                                <Input
                                    id="namaBelakang"
                                    name="namaBelakang"
                                    value={userData.namaBelakang}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="border-slate-300"
                                />
                            </div>

                            <div className="space-y-2 row-span-2">
                                <label htmlFor="bio" className="block text-sm font-medium text-slate-700">
                                    Bio
                                </label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    value={userData.bio}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="h-32 border-slate-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="border-slate-300"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-center space-x-2 mt-6">
                                <Button type="button" variant="outline" onClick={handleCancel} className="border-slate-300">
                                    Batal
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Simpan
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

