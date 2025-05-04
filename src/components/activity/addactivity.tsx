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

const API_URL = import.meta.env.VITE_HOST_NAME

interface Kegiatan {
    namaKegiatan: string;
    programTerafiliasi: string;
    idProgram: number;
    tanggalMulai: string;
    tanggalSelesai: string;
    status: string;
    biayaImplementasi: string;
    deskripsi: string;
    stakeholders: Stakeholder[];
    beneficiary: Beneficiary[];
    employee: Employee[];
}

type ImageData = {
    url: string;
    file: File;
};

interface AddKegiatanDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

interface Stakeholder {
    nama_stakeholder: string
    jenis: "Individu" | "Organisasi" | "Perusahaan"
    telepon: string
    email: string
}

interface Beneficiary {
    nama_instansi: string
    nama_kontak: string
    telepon: string
    email: string
    alamat: string
}

interface Employee {
    nama: string
    email: string
    telepon: string
    alamat: string
}

export default function AddActivityDialog({ isOpen, setIsOpen }: AddKegiatanDialogProps) {
    const [isSaving, setIsSaving] = useState(false);

    // DATA INPUT HANDLING
    const [newKegiatan, setNewKegiatan] = useState<Kegiatan>({
        namaKegiatan: "",
        programTerafiliasi: "",
        idProgram: 0,
        tanggalMulai: "",
        tanggalSelesai: "",
        status: "",
        biayaImplementasi: "",
        deskripsi: "",
        stakeholders: [],
        beneficiary: [],
        employee: [],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewKegiatan({ ...newKegiatan, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setNewKegiatan((prev) => ({ ...prev, [name]: value }));
    };

    const addStakeholder = () => {
        setNewKegiatan({
            ...newKegiatan,
            stakeholders: [...newKegiatan.stakeholders, { nama_stakeholder: "", jenis: "Individu", telepon: "", email: "" }],
        })
    }

    const addBeneficiary = () => {
        setNewKegiatan({
            ...newKegiatan,
            beneficiary: [
                ...newKegiatan.beneficiary,
                { nama_instansi: "", nama_kontak: "", telepon: "", email: "", alamat: "" },
            ],
        })
    }

    const addKaryawan = () => {
        setNewKegiatan({
            ...newKegiatan,
            employee: [...newKegiatan.employee, { nama: "", email: "", telepon: "", alamat: "" }],
        })
    }

    const handleStakeholderChange = (index: number, field: keyof Stakeholder, value: string) => {
        const updatedStakeholders = [...newKegiatan.stakeholders]
        updatedStakeholders[index] = { ...updatedStakeholders[index], [field]: value }
        setNewKegiatan({ ...newKegiatan, stakeholders: updatedStakeholders })
    }

    const handleBeneficiaryChange = (index: number, field: keyof Beneficiary, value: string) => {
        const updatedBeneficiaries = [...newKegiatan.beneficiary]
        updatedBeneficiaries[index] = { ...updatedBeneficiaries[index], [field]: value }
        setNewKegiatan({ ...newKegiatan, beneficiary: updatedBeneficiaries })
    }

    const handleKaryawanChange = (index: number, field: keyof Employee, value: string) => {
        const updatedemployee = [...newKegiatan.employee]
        updatedemployee[index] = { ...updatedemployee[index], [field]: value }
        setNewKegiatan({ ...newKegiatan, employee: updatedemployee })
    }

    const removeStakeholder = (index: number) => {
        if (newKegiatan.stakeholders.length > 0) {
            const updatedStakeholders = newKegiatan.stakeholders.filter((_, i) => i !== index)
            setNewKegiatan({ ...newKegiatan, stakeholders: updatedStakeholders })
        }
    }

    const removeBeneficiary = (index: number) => {
        if (newKegiatan.beneficiary.length > 0) {
            const updatedBeneficiaries = newKegiatan.beneficiary.filter((_, i) => i !== index)
            setNewKegiatan({ ...newKegiatan, beneficiary: updatedBeneficiaries })
        }
    }

    const removeKaryawan = (index: number) => {
        if (newKegiatan.employee.length > 0) {
            const updatedemployee = newKegiatan.employee.filter((_, i) => i !== index)
            setNewKegiatan({ ...newKegiatan, employee: updatedemployee })
        }
    }

    // PROGRAM HANDLING
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [filteredPrograms, setFilteredPrograms] = useState<{ id: number; nama_program: string }[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [programs, setPrograms] = useState<{ id: number; nama_program: string }[]>([]);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/api/activity/idprogram`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Gagal mengambil data program");

                const data = await response.json();
                setPrograms(data.idProgram);
            } catch (error) {
                console.error(error);
            }
        };

        if (isOpen) fetchPrograms();
    }, [isOpen]);

    const handleInputChangeProgram = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewKegiatan({ ...newKegiatan, programTerafiliasi: value });
        setShowDropdown(true);
        setFilteredPrograms(programs.filter(p => p.nama_program.toLowerCase().includes(value.toLowerCase())));
    };

    const handleSelectProgram = (program: { id: number; nama_program: string }) => {
        setNewKegiatan((prev) => ({ ...prev, programTerafiliasi: program.nama_program, idProgram: program.id }));
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

        if (!newKegiatan.namaKegiatan) {
            newErrors.namaKegiatan = "Nama kegiatan wajib diisi!"
            firstErrorField = firstErrorField || "namaKegiatan"
        }

        if (!newKegiatan.programTerafiliasi || !programs.some((p) => p.nama_program === newKegiatan.programTerafiliasi)) {
            newErrors.programTerafiliasi = "Pilih program dari daftar!"
            firstErrorField = firstErrorField || "programTerafiliasi"
        }

        if (!newKegiatan.tanggalMulai || !newKegiatan.tanggalSelesai) {
            newErrors.tanggal = "Tanggal mulai dan selesai wajib diisi!"
            firstErrorField = firstErrorField || "tanggal"
        }

        if (!newKegiatan.status) {
            newErrors.status = "Status wajib dipilih"
            firstErrorField = firstErrorField || "status"
        }

        if (!newKegiatan.biayaImplementasi || Number.parseInt(newKegiatan.biayaImplementasi) < 0) {
            newErrors.biayaImplementasi = "Biaya implementasi harus 0 atau lebih!"
            firstErrorField = firstErrorField || "biayaImplementasi"
        }

        if (!newKegiatan.deskripsi) {
            newErrors.deskripsi = "Deskripsi harus lebih dari 10 karakter!"
            firstErrorField = firstErrorField || "deskripsi"
        }

        // Validate each stakeholder individually
        newKegiatan.stakeholders.forEach((stakeholder, index) => {
            if (!stakeholder.nama_stakeholder) {
                newErrors[`stakeholder_${index}_nama`] = "Nama stakeholder wajib diisi!"
                firstErrorField = firstErrorField || `stakeholder_${index}_nama`
            }

            if (!stakeholder.jenis) {
                newErrors[`stakeholder_${index}_jenis`] = "Jenis stakeholder wajib diisi!"
                firstErrorField = firstErrorField || `stakeholder_${index}_jenis`
            }

            if (!stakeholder.telepon || stakeholder.telepon.trim() === "") {
                newErrors[`stakeholder_${index}_telepon`] = "Telepon wajib diisi!"
                firstErrorField = firstErrorField || `stakeholder_${index}_telepon`
            } else if (!/^\d{10,15}$/.test(stakeholder.telepon)) {
                newErrors[`stakeholder_${index}_telepon`] = "Nomor telepon harus berupa angka (10-15 digit)!"
                firstErrorField = firstErrorField || `stakeholder_${index}_telepon`
            }

            if (!stakeholder.email.trim()) {
                newErrors[`stakeholder_${index}_email`] = "Email tidak boleh kosong!"
                firstErrorField = firstErrorField || `stakeholder_${index}_email`
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stakeholder.email)) {
                newErrors[`stakeholder_${index}_email`] = "Format email tidak valid!"
                firstErrorField = firstErrorField || `stakeholder_${index}_email`
            }
        })

        // Validate each beneficiary individually
        newKegiatan.beneficiary.forEach((beneficiary, index) => {
            if (!beneficiary.nama_instansi) {
                newErrors[`beneficiary_${index}_instansi`] = "Nama instansi wajib diisi!"
                firstErrorField = firstErrorField || `beneficiary_${index}_instansi`
            }

            if (!beneficiary.nama_kontak) {
                newErrors[`beneficiary_${index}_kontak`] = "Nama kontak wajib diisi!"
                firstErrorField = firstErrorField || `beneficiary_${index}_kontak`
            }

            if (!beneficiary.telepon) {
                newErrors[`beneficiary_${index}_telepon`] = "Telepon wajib diisi!"
                firstErrorField = firstErrorField || `beneficiary_${index}_telepon`
            } else if (!/^\d{10,15}$/.test(beneficiary.telepon)) {
                newErrors[`beneficiary_${index}_telepon`] = "Nomor telepon harus berupa angka (10-15 digit)!"
                firstErrorField = firstErrorField || `beneficiary_${index}_telepon`
            }

            if (!beneficiary.email) {
                newErrors[`beneficiary_${index}_email`] = "Email wajib diisi!"
                firstErrorField = firstErrorField || `beneficiary_${index}_email`
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(beneficiary.email)) {
                newErrors[`beneficiary_${index}_email`] = "Format email tidak valid!"
                firstErrorField = firstErrorField || `beneficiary_${index}_email`
            }

            if (!beneficiary.alamat) {
                newErrors[`beneficiary_${index}_alamat`] = "Alamat wajib diisi!"
                firstErrorField = firstErrorField || `beneficiary_${index}_alamat`
            }
        })

        // Validate each employee individually
        newKegiatan.employee.forEach((employee, index) => {
            if (!employee.nama) {
                newErrors[`employee_${index}_nama`] = "Nama karyawan wajib diisi!"
                firstErrorField = firstErrorField || `employee_${index}_nama`
            }

            if (!employee.email) {
                newErrors[`employee_${index}_email`] = "Email wajib diisi!"
                firstErrorField = firstErrorField || `employee_${index}_email`
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
                newErrors[`employee_${index}_email`] = "Format email tidak valid!"
                firstErrorField = firstErrorField || `employee_${index}_email`
            }

            if (!employee.telepon) {
                newErrors[`employee_${index}_telepon`] = "Telepon wajib diisi!"
                firstErrorField = firstErrorField || `employee_${index}_telepon`
            } else if (!/^\d{10,15}$/.test(employee.telepon)) {
                newErrors[`employee_${index}_telepon`] = "Nomor telepon harus berupa angka (10-15 digit)!"
                firstErrorField = firstErrorField || `employee_${index}_telepon`
            }

            if (!employee.alamat) {
                newErrors[`employee_${index}_alamat`] = "Alamat wajib diisi!"
                firstErrorField = firstErrorField || `employee_${index}_alamat`
            }
        })

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
            formData.append("nama_aktivitas", newKegiatan.namaKegiatan);
            formData.append("programTerafiliasi", newKegiatan.programTerafiliasi);
            formData.append("program_id", String(newKegiatan.idProgram));
            formData.append("tanggal_mulai", newKegiatan.tanggalMulai);
            formData.append("tanggal_selesai", newKegiatan.tanggalSelesai);
            formData.append("status", newKegiatan.status);
            formData.append("biaya_implementasi", String(newKegiatan.biayaImplementasi));
            formData.append("deskripsi", newKegiatan.deskripsi);

            // Add stakeholders
            formData.append("stakeholders", JSON.stringify(newKegiatan.stakeholders))

            // Add beneficiaries
            formData.append("beneficiary", JSON.stringify(newKegiatan.beneficiary))

            // Add employee
            formData.append("employee", JSON.stringify(newKegiatan.employee))

            images.forEach((image) => {
                formData.append("dokumentasi", image.file);
            });

            console.log("Form data:", formData.get("dokumentasi"));

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

            console.log("Data berhasil dikirim");

            setIsOpen(false);
            setTimeout(() => window.location.reload(), 500)

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
                namaKegiatan: "",
                programTerafiliasi: "",
                idProgram: 0,
                tanggalMulai: "",
                tanggalSelesai: "",
                status: "",
                biayaImplementasi: "",
                deskripsi: "",
                stakeholders: [],
                beneficiary: [],
                employee: [],
            })
            setErrors({})
            setImages([])
            setPrograms([])
            setShowDropdown(false)
        }
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
                            <Label htmlFor="namaKegiatan">Nama Kegiatan</Label>
                            <Input
                                name="namaKegiatan"
                                id="namaKegiatan"
                                placeholder="Nama Kegiatan"
                                value={newKegiatan.namaKegiatan}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                            {errors.namaKegiatan && (
                                <p ref={(el) => { (errorRefs.current.namaKegiatan = el) }} className="text-red-500 text-[12px]">
                                    {errors.namaKegiatan}
                                </p>
                            )}
                        </div>

                        <div className="relative space-y-2" onBlur={handleBlur}>
                            <Label htmlFor="programTerafiliasi">Program Terafiliasi</Label>
                            <Input
                                id="programTerafiliasi"
                                ref={inputRef}
                                value={newKegiatan.programTerafiliasi}
                                onChange={handleInputChangeProgram}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Pilih program"
                                className="w-full"
                            />
                            {errors.programTerafiliasi && (
                                <p ref={(el) => { (errorRefs.current.programTerafiliasi = el) }} className="text-red-500 text-[12px]">
                                    {errors.programTerafiliasi}
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
                            {errors.tanggal && (
                                <p ref={(el) => { (errorRefs.current.tanggal = el) }} className="text-red-500 text-[12px]">
                                    {errors.tanggal}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="biayaImplementasi">Biaya Implementasi</Label>
                            <div className="flex items-center space-x-2">
                                <span>Rp.</span>
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
                            {errors.biayaImplementasi && (
                                <p ref={(el) => { (errorRefs.current.biayaImplementasi = el) }} className="text-red-500 text-[12px]">
                                    {errors.biayaImplementasi}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" onValueChange={(value) => handleSelectChange("status", value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Status" />
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
                    <div className="space-y-4 mt-6 border-t pt-4">
                        <Label htmlFor="deskripsi">Pemangku Kepentingan</Label>

                        {newKegiatan.stakeholders.map((stakeholder, index) => (
                            <div key={`stakeholder-${index}`} className="p-4 border rounded-md space-y-3 relative">
                                {newKegiatan.stakeholders.length > 0 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeStakeholder(index)}
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6"
                                    >
                                        <X size={14} />
                                    </Button>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`stakeholder-nama-${index}`}>Nama Stakeholder</Label>
                                        <Input
                                            id={`stakeholder-nama-${index}`}
                                            value={stakeholder.nama_stakeholder}
                                            onChange={(e) => handleStakeholderChange(index, "nama_stakeholder", e.target.value)}
                                            placeholder="Nama stakeholder"
                                        />
                                        {errors[`stakeholder_${index}_nama`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`stakeholder_${index}_nama`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`stakeholder_${index}_nama`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`stakeholder-jenis-${index}`}>Jenis</Label>
                                        <Select
                                            value={stakeholder.jenis}
                                            onValueChange={(value) =>
                                                handleStakeholderChange(index, "jenis", value as "Individu" | "Organisasi" | "Perusahaan")
                                            }
                                        >
                                            <SelectTrigger id={`stakeholder-jenis-${index}`}>
                                                <SelectValue placeholder="Pilih jenis" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Individu">Individu</SelectItem>
                                                <SelectItem value="Organisasi">Organisasi</SelectItem>
                                                <SelectItem value="Perusahaan">Perusahaan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors[`stakeholder_${index}_jenis`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`stakeholder_${index}_jenis`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`stakeholder_${index}_jenis`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`stakeholder-telepon-${index}`}>No Telepon</Label>
                                        <Input
                                            id={`stakeholder-telepon-${index}`}
                                            value={stakeholder.telepon}
                                            onChange={(e) => handleStakeholderChange(index, "telepon", e.target.value)}
                                            placeholder="No telepon"
                                        />
                                        {errors[`stakeholder_${index}_telepon`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`stakeholder_${index}_telepon`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`stakeholder_${index}_telepon`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`stakeholder-email-${index}`}>Email</Label>
                                        <Input
                                            id={`stakeholder-email-${index}`}
                                            type="email"
                                            value={stakeholder.email}
                                            onChange={(e) => handleStakeholderChange(index, "email", e.target.value)}
                                            placeholder="Email"
                                        />
                                        {errors[`stakeholder_${index}_email`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`stakeholder_${index}_email`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`stakeholder_${index}_email`]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={addStakeholder}
                            variant="outline"
                            size="sm"
                            className="text-[12px] text-[var(--green)]"
                        >
                            + Tambah Pemangku Kepentingan
                        </Button>
                    </div>

                    {/* Penerima Manfaat Section */}
                    <div className="space-y-4 mt-6 border-t pt-4">
                        <Label htmlFor="deskripsi">Penerima Manfaat</Label>

                        {newKegiatan.beneficiary.map((beneficiary, index) => (
                            <div key={`beneficiary-${index}`} className="p-4 border rounded-md space-y-3 relative">
                                {newKegiatan.beneficiary.length > 0 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeBeneficiary(index)}
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6"
                                    >
                                        <X size={14} />
                                    </Button>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`beneficiary-instansi-${index}`}>Nama Instansi/Lembaga</Label>
                                        <Input
                                            id={`beneficiary-instansi-${index}`}
                                            value={beneficiary.nama_instansi}
                                            onChange={(e) => handleBeneficiaryChange(index, "nama_instansi", e.target.value)}
                                            placeholder="Nama instansi/lembaga"
                                        />
                                        {errors[`beneficiary_${index}_instansi`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`beneficiary_${index}_instansi`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`beneficiary_${index}_instansi`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`beneficiary-kontak-${index}`}>Nama Kontak Personil</Label>
                                        <Input
                                            id={`beneficiary-kontak-${index}`}
                                            value={beneficiary.nama_kontak}
                                            onChange={(e) => handleBeneficiaryChange(index, "nama_kontak", e.target.value)}
                                            placeholder="Nama kontak personil"
                                        />
                                        {errors[`beneficiary_${index}_kontak`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`beneficiary_${index}_kontak`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`beneficiary_${index}_kontak`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`beneficiary-telepon-${index}`}>No Telepon</Label>
                                        <Input
                                            id={`beneficiary-telepon-${index}`}
                                            value={beneficiary.telepon}
                                            onChange={(e) => handleBeneficiaryChange(index, "telepon", e.target.value)}
                                            placeholder="No telepon"
                                        />
                                        {errors[`beneficiary_${index}_telepon`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`beneficiary_${index}_telepon`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`beneficiary_${index}_telepon`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`beneficiary-email-${index}`}>Email</Label>
                                        <Input
                                            id={`beneficiary-email-${index}`}
                                            type="email"
                                            value={beneficiary.email}
                                            onChange={(e) => handleBeneficiaryChange(index, "email", e.target.value)}
                                            placeholder="Email"
                                        />
                                        {errors[`beneficiary_${index}_email`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`beneficiary_${index}_email`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`beneficiary_${index}_email`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor={`beneficiary-alamat-${index}`}>Alamat</Label>
                                        <Textarea
                                            id={`beneficiary-alamat-${index}`}
                                            value={beneficiary.alamat}
                                            onChange={(e) => handleBeneficiaryChange(index, "alamat", e.target.value)}
                                            placeholder="Alamat lengkap"
                                            rows={2}
                                        />
                                        {errors[`beneficiary_${index}_alamat`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`beneficiary_${index}_alamat`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`beneficiary_${index}_alamat`]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={addBeneficiary}
                            variant="outline"
                            size="sm"
                            className="text-[12px] text-[var(--green)]"
                        >
                            + Tambah Penerima Manfaat
                        </Button>
                    </div>

                    {/* Karyawan Section */}
                    <div className="space-y-4 mt-6 border-t pt-4">
                        <Label htmlFor="deskripsi">Tambah Karyawan</Label>

                        {newKegiatan.employee.map((karyawan, index) => (
                            <div key={`karyawan-${index}`} className="p-4 border rounded-md space-y-3 relative">
                                {newKegiatan.employee.length > 0 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeKaryawan(index)}
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6"
                                    >
                                        <X size={14} />
                                    </Button>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`karyawan-nama-${index}`}>Nama</Label>
                                        <Input
                                            id={`karyawan-nama-${index}`}
                                            value={karyawan.nama}
                                            onChange={(e) => handleKaryawanChange(index, "nama", e.target.value)}
                                            placeholder="Nama karyawan"
                                        />
                                        {errors[`employee_${index}_nama`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`employee_${index}_nama`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`employee_${index}_nama`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`karyawan-email-${index}`}>Email</Label>
                                        <Input
                                            id={`karyawan-email-${index}`}
                                            type="email"
                                            value={karyawan.email}
                                            onChange={(e) => handleKaryawanChange(index, "email", e.target.value)}
                                            placeholder="Email"
                                        />
                                        {errors[`employee_${index}_email`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`employee_${index}_email`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`employee_${index}_email`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`karyawan-telepon-${index}`}>No Telepon</Label>
                                        <Input
                                            id={`karyawan-telepon-${index}`}
                                            value={karyawan.telepon}
                                            onChange={(e) => handleKaryawanChange(index, "telepon", e.target.value)}
                                            placeholder="No telepon"
                                        />
                                        {errors[`employee_${index}_telepon`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`employee_${index}_telepon`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`employee_${index}_telepon`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor={`karyawan-alamat-${index}`}>Alamat</Label>
                                        <Textarea
                                            id={`karyawan-alamat-${index}`}
                                            value={karyawan.alamat}
                                            onChange={(e) => handleKaryawanChange(index, "alamat", e.target.value)}
                                            placeholder="Alamat lengkap"
                                            rows={2}
                                        />
                                        {errors[`employee_${index}_alamat`] && (
                                            <p
                                                ref={(el) => {
                                                    errorRefs.current[`employee_${index}_alamat`] = el
                                                }}
                                                className="text-red-500 text-[12px]"
                                            >
                                                {errors[`employee_${index}_alamat`]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            onClick={addKaryawan}
                            variant="outline"
                            size="sm"
                            className="text-[12px] text-[var(--green)]"
                        >
                            + Tambah Karyawan
                        </Button>
                    </div>

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
