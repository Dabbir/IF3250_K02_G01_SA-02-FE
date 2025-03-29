"use client"

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Kegiatan {
    namaKegiatan: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    status: string;
    biayaImplementasi: string;
    deskripsi: string;
    dokumentasi: File[];
}

interface AddKegiatanDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function AddActivityDialog({ isOpen, setIsOpen }: AddKegiatanDialogProps) {
    const [newKegiatan, setNewKegiatan] = useState<Kegiatan>({
        namaKegiatan: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        status: "",
        biayaImplementasi: "",
        deskripsi: "",
        dokumentasi: [],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewKegiatan({ ...newKegiatan, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setNewKegiatan((prev) => ({ ...prev, [name]: value }));
    };

    const [programTerafiliasi, setProgramTerafiliasi] = useState("");
    const [filteredPrograms, setFilteredPrograms] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const programs = Array.from({ length: 100 }, (_, i) => `Program ${i + 1}`);

    const handleInputChangeProgram = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProgramTerafiliasi(value);
        if (value.trim() === "") {
            setFilteredPrograms([]);
        } else {
            const filtered = programs.filter((p) =>
                p.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredPrograms(filtered);
        }
        setShowDropdown(true);
    };

    const handleSelectProgram = (program: string) => {
        setProgramTerafiliasi(program);
        setShowDropdown(false);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (
            !inputRef.current?.contains(e.relatedTarget) &&
            !dropdownRef.current?.contains(e.relatedTarget)
        ) {
            setShowDropdown(false);
        }
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Tambah Kegiatan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="namaKegiatan">Nama Kegiatan</Label>
                        <Input
                            name="namaKegiatan"
                            id="namaKegiatan"
                            placeholder="Nama Kegiatan"
                            value={newKegiatan.namaKegiatan}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    <div className="relative space-y-2" onBlur={handleBlur}>
                        <Label htmlFor="programTerafiliasi">Program Terafiliasi</Label>
                        <Input
                            id="programTerafiliasi"
                            ref={inputRef}
                            value={programTerafiliasi}
                            onChange={handleInputChangeProgram}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Ketik untuk mencari..."
                            className="w-full"
                        />

                        {showDropdown && (
                            <div
                                ref={dropdownRef}
                                className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-auto"
                            >
                                {filteredPrograms.length > 0 ? (
                                    filteredPrograms.map((program) => (
                                        <div
                                            key={program}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSelectProgram(program)}
                                        >
                                            {program}
                                        </div>
                                    ))
                                ) : (
                                    programs.map((program) => (
                                        <div
                                            key={program}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSelectProgram(program)}
                                        >
                                            {program}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-left space-x-5">
                        <div className="space-y-2 width-full">
                            <Label htmlFor="tanggalMulai">Tanggal Mulai</Label>
                            <Input
                                name="tanggalMulai"
                                id="tanggalMulai"
                                type="date"
                                value={newKegiatan.tanggalMulai}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tanggalSelesai">Tanggal Selesai</Label>
                            <Input
                                name="tanggalSelesai"
                                id="tanggalSelesai"
                                type="date"
                                value={newKegiatan.tanggalSelesai}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="biayaImplementasi">Biaya Implementasi</Label>
                        <div className="flex items-center space-x-2">
                            <span>
                                Rp.
                            </span>
                            <Input
                                name="biayaImplementasi"
                                id="biayaImplementasi"
                                type="number"
                                placeholder="100000"
                                value={newKegiatan.biayaImplementasi}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            name="status"
                            onValueChange={(value) => handleSelectChange("status", value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectItem value="Unstarted">Unstarted</SelectItem>
                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                <SelectItem value="Finished">Finished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Textarea
                            name="deskripsi"
                            id="deskripsi"
                            placeholder="Deskripsi kegiatan..."
                            value={newKegiatan.deskripsi}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dokumentasi">Dokumentasi</Label>
                        <Input
                            name="dokumentasi"
                            id="dokumentasi"
                            type="file"
                            multiple
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                    <Button className="bg-[#3A786D] text-white">Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
