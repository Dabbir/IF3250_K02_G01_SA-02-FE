"use client"

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import StakeholderSection from "./stakeholdersection";
import BeneficiarySection from "./beneficiarysection";
import EmployeeSection from "./employeesection";

import { DetailedKegiatan, ImageData } from "@/types/activity";

// Hooks
import useDetailActivity from "@/hooks/use-detailactivity"
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_HOST_NAME

interface AddKegiatanDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export default function AddActivityDialog({ isOpen, setIsOpen }: AddKegiatanDialogProps) {
    const {
        handleEditClick,
        programs,
        stakeholders,
        beneficiaries,
        karyawan,
        setStakeholders,
        setBeneficiaries,
        setKaryawan,
        removeStakeholder,
        removeBeneficiary,
        removeKaryawan,
        allStakeholders,
        showStakeholderDropdown,
        setShowStakeholderDropdown,
        stakeholderSearch,
        handleStakeholderSearchChange,
        handleSelectStakeholder,
        handleStakeholderDropdownBlur,
        allBeneficiaries,
        showBeneficiaryDropdown,
        setShowBeneficiaryDropdown,
        beneficiarySearch,
        handleBeneficiarySearchChange,
        handleSelectBeneficiary,
        handleBeneficiaryDropdownBlur,
        allKaryawan,
        showKaryawanDropdown,
        setShowKaryawanDropdown,
        karyawanSearch,
        handleKaryawanSearchChange,
        handleSelectKaryawan,
        handleKaryawanDropdownBlur,
    } = useDetailActivity('')

    const [isSaving, setIsSaving] = useState(false);

    // DATA INPUT HANDLING
    const [newKegiatan, setNewKegiatan] = useState<DetailedKegiatan>({
        nama_aktivitas: "",
        program_id: "",
        nama_program: "",
        deskripsi: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        status: "Belum Mulai",
        biaya_implementasi: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewKegiatan({ ...newKegiatan, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setNewKegiatan((prev) => ({ ...prev, [name]: value }));
    };

    // PROGRAM HANDLING
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [filteredPrograms, setFilteredPrograms] = useState<{ id: number; nama_program: string }[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();

    const handleInputChangeProgram = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewKegiatan({ ...newKegiatan, nama_program: value });
        setShowDropdown(true);
        setFilteredPrograms(programs.filter(p => p.nama_program.toLowerCase().includes(value.toLowerCase())));
    };

    const handleSelectProgram = (program: { id: number; nama_program: string }) => {
        setNewKegiatan((prev) => ({ ...prev, nama_program: program.nama_program, program_id: program.id.toString() }));
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

    // IMAGE HANDLING
    const [images, setImages] = useState<ImageData[]>([]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newImages: ImageData[] = files.map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // ERRORS HANDLING
    const formRef = useRef<HTMLDivElement>(null)
    const errorRefs = useRef<Record<string, HTMLElement | null>>({})
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        let firstErrorField: string | null = null

        // Clear previous error refs
        errorRefs.current = {}

        if (!newKegiatan.nama_aktivitas) {
            newErrors.nama_aktivitas = "Nama kegiatan wajib diisi!"
            firstErrorField = firstErrorField || "nama_aktivitas"
        }

        if (!newKegiatan.nama_program || !programs.some((p) => p.nama_program === newKegiatan.nama_program)) {
            newErrors.nama_program = "Pilih program dari daftar!"
            firstErrorField = firstErrorField || "nama_program"
        }

        if (!newKegiatan.tanggal_mulai || !newKegiatan.tanggal_selesai) {
            newErrors.tanggal = "Tanggal mulai dan selesai wajib diisi!"
            firstErrorField = firstErrorField || "tanggal"
        }

        if (!newKegiatan.status) {
            newErrors.status = "Status wajib dipilih"
            firstErrorField = firstErrorField || "status"
        }

        if (!newKegiatan.biaya_implementasi || newKegiatan.biaya_implementasi < 0) {
            newErrors.biaya_implementasi = "Biaya implementasi harus lebih dari 0!"
            firstErrorField = firstErrorField || "biaya_implementasi"
        }

        if (!newKegiatan.deskripsi || newKegiatan.deskripsi.length < 10) {
            newErrors.deskripsi = "Deskripsi minimal 10 karakter!"
            firstErrorField = firstErrorField || "deskripsi"
        }

        setErrors(newErrors)

        setTimeout(() => {
            if (firstErrorField && errorRefs.current[firstErrorField]) {
                errorRefs.current[firstErrorField]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                })
            }
        }, 100)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("nama_aktivitas", newKegiatan.nama_aktivitas);
            formData.append("nama_program", newKegiatan.nama_program);
            formData.append("program_id", String(newKegiatan.program_id));
            formData.append("tanggal_mulai", newKegiatan.tanggal_mulai);
            formData.append("tanggal_selesai", newKegiatan.tanggal_selesai);
            formData.append("status", newKegiatan.status);
            formData.append("biaya_implementasi", String(newKegiatan.biaya_implementasi));
            formData.append("deskripsi", newKegiatan.deskripsi);

            formData.append("stakeholders", JSON.stringify(stakeholders.map((s) => s.id)))
            formData.append("beneficiaries", JSON.stringify(beneficiaries.map((b) => b.id)))
            formData.append("employees", JSON.stringify(karyawan.map((k) => k.id)))
            console.log("Form data:", formData.get("stakeholders"));
            console.log("Form data:", formData.get("beneficiaries"));
            console.log("Form data:", formData.get("employees"));

            images.forEach((image) => {
                formData.append("dokumentasi", image.file);
            });


            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/api/activity/add`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Gagal menyimpan data");
            }
            setIsOpen(false);

            const data = await response.json(); 
            navigate(`/kegiatan/${data.id}`);

            toast.success("Kegiatan berhasil ditambahkan!")

        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            toast.error("Gagal menambahkan kegiatan!")
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setNewKegiatan({
                nama_aktivitas: "",
                program_id: "",
                nama_program: "",
                deskripsi: "",
                tanggal_mulai: "",
                tanggal_selesai: "",
                status: "Belum Mulai",
                biaya_implementasi: 0,
                stakeholders: [],
                penerima_manfaat: [],
                karyawan: [],
            })
            setStakeholders([])
            setBeneficiaries([])
            setKaryawan([])
            setErrors({})
            setImages([])
            setShowDropdown(false)
        }

        handleEditClick()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent key={isOpen ? "open" : "closed"} className="max-w-[600px] max-h-[95vh] overflow-y-auto">
                <div ref={formRef}>
                    <DialogHeader>
                        <DialogTitle className="text-center">Tambah Kegiatan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama_aktivitas">Nama Kegiatan</Label>
                            <Input
                                name="nama_aktivitas"
                                id="nama_aktivitas"
                                placeholder="Nama Kegiatan"
                                value={newKegiatan.nama_aktivitas}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                            {errors.nama_aktivitas && (
                                <p ref={(el) => { (errorRefs.current.nama_aktivitas = el) }} className="text-red-500 text-[12px]">
                                    {errors.nama_aktivitas}
                                </p>
                            )}
                        </div>

                        <div className="relative space-y-2" onBlur={handleBlur}>
                            <Label htmlFor="nama_program">Program Terafiliasi</Label>
                            <Input
                                id="nama_program"
                                ref={inputRef}
                                value={newKegiatan.nama_program}
                                onChange={handleInputChangeProgram}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Pilih program"
                                className="w-full"
                            />
                            {errors.nama_program && (
                                <p ref={(el) => { (errorRefs.current.nama_program = el) }} className="text-red-500 text-[12px]">
                                    {errors.nama_program}
                                </p>
                            )}

                            {showDropdown && (
                                <div
                                    ref={dropdownRef}
                                    className="text-[12px] absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-40 overflow-auto"
                                >
                                    {filteredPrograms.length > 0 ? (
                                        filteredPrograms.map((program) => (
                                            <div
                                                key={program.id}
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                onMouseDown={(e) => {
                                                    e.preventDefault()
                                                    handleSelectProgram(program)
                                                }}
                                            >
                                                {program.nama_program}
                                            </div>
                                        ))
                                    ) : programs.length > 0 ? (
                                        programs.map((program) => (
                                            <div
                                                key={program.id}
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                onMouseDown={(e) => {
                                                    e.preventDefault()
                                                    handleSelectProgram(program)
                                                }}
                                            >
                                                {program.nama_program}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 cursor-pointer text-gray-500">Tidak ada program</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-left space-x-5">
                                <div className="space-y-2 width-full">
                                    <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                    <Input
                                        name="tanggal_mulai"
                                        id="tanggal_mulai"
                                        type="date"
                                        value={newKegiatan.tanggal_mulai}
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                    <Input
                                        name="tanggal_selesai"
                                        id="tanggal_selesai"
                                        type="date"
                                        value={newKegiatan.tanggal_selesai}
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            {errors.tanggal && (
                                <p ref={(el) => { (errorRefs.current.tanggal = el) }} className="text-red-500 text-[12px]">
                                    {errors.tanggal}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="biaya_implementasi">Biaya Implementasi</Label>
                            <div className="flex items-center space-x-2">
                                <span>Rp.</span>
                                <Input
                                    name="biaya_implementasi"
                                    id="biaya_implementasi"
                                    type="number"
                                    placeholder="100000"
                                    value={newKegiatan.biaya_implementasi}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            {errors.biaya_implementasi && (
                                <p ref={(el) => { (errorRefs.current.biaya_implementasi = el) }} className="text-red-500 text-[12px]">
                                    {errors.biaya_implementasi}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" onValueChange={(value) => handleSelectChange("status", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Belum Mulai" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="Belum Mulai">Belum Mulai</SelectItem>
                                    <SelectItem value="Berjalan">Berjalan</SelectItem>
                                    <SelectItem value="Selesai">Selesai</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p ref={(el) => { (errorRefs.current.status = el) }} className="text-red-500 text-[12px]">
                                    {errors.status}
                                </p>
                            )}
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
                            {errors.deskripsi && (
                                <p ref={(el) => { (errorRefs.current.deskripsi = el) }} className="text-red-500 text-[12px]">
                                    {errors.deskripsi}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Stakeholder Section */}
                    <StakeholderSection
                        stakeholders={stakeholders}
                        isEditing={true}
                        onRemove={removeStakeholder}
                        allStakeholders={allStakeholders}
                        showStakeholderDropdown={showStakeholderDropdown}
                        setShowStakeholderDropdown={setShowStakeholderDropdown}
                        stakeholderSearch={stakeholderSearch}
                        onSearchChange={handleStakeholderSearchChange}
                        onSelect={handleSelectStakeholder}
                        onDropdownBlur={handleStakeholderDropdownBlur}
                    />

                    {/* Penerima Manfaat Section */}
                    <BeneficiarySection
                        beneficiaries={beneficiaries}
                        isEditing={true}
                        onRemove={removeBeneficiary}
                        allBeneficiaries={allBeneficiaries}
                        showBeneficiaryDropdown={showBeneficiaryDropdown}
                        setShowBeneficiaryDropdown={setShowBeneficiaryDropdown}
                        beneficiarySearch={beneficiarySearch}
                        onSearchChange={handleBeneficiarySearchChange}
                        onSelect={handleSelectBeneficiary}
                        onDropdownBlur={handleBeneficiaryDropdownBlur}
                    />

                    {/* Karyawan Section */}
                    <EmployeeSection
                        karyawan={karyawan}
                        isEditing={true}
                        onRemove={removeKaryawan}
                        allKaryawan={allKaryawan}
                        showKaryawanDropdown={showKaryawanDropdown}
                        setShowKaryawanDropdown={setShowKaryawanDropdown}
                        karyawanSearch={karyawanSearch}
                        onSearchChange={handleKaryawanSearchChange}
                        onSelect={handleSelectKaryawan}
                        onDropdownBlur={handleKaryawanDropdownBlur}
                    />

                    {/* Upload Documentation Section */}
                    <div className="space-y-4 mt-6 border-t pt-4">
                        <Label htmlFor="dokumentasi">Upload Dokumentasi</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50">
                            <input
                                id="dokumentasi"
                                type="file"
                                multiple
                                accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label htmlFor="dokumentasi" className="text-gray-600">
                                <div className="mb-3 text-[var(--green)] flex items-center justify-center space-x-2 text-[12px] cursor-pointer transition-transform duration-200 hover:scale-105 hover:text-blue-900">
                                    <Upload className="h-4 w-4" />
                                    <span>Klik untuk mengunggah dokumentasi!</span>
                                </div>
                            </label>

                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={img.url || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <Button
                                                size="icon"
                                                className="cursor-pointer absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeImage(index)
                                                }}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="space-y-4 mt-6 pt-4">
                        <Button
                            className="border-[var(--green)] text-[var(--green)] px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-[var(--green)] hover:bg-[var(--blue)] text-white px-4 md:px-6 py-1 md:py-2 w-full max-w-[120px] md:max-w-[140px] transition-transform duration-200 hover:scale-95 text-xs md:text-sm h-8 md:h-10"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan"
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
