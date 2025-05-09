"use client"

import React from "react"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import type { DetailedKegiatan, Program, ImageData, StakeholderActivity, BeneficiaryActivity, EmployeeActivity } from "@/types/activity"

const API_URL = import.meta.env.VITE_HOST_NAME

export default function useDetailActivity(id: string | undefined) {
    const [kegiatan, setKegiatan] = useState<DetailedKegiatan | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedKegiatan, setEditedKegiatan] = useState<DetailedKegiatan | null>(null)
    const [deletedImages, setDeletedImages] = useState<string[]>([])
    const [dokumentasiList, setDokumentasiList] = useState<string[]>([])
    const [images, setImages] = useState<ImageData[]>([])
    const [prevDokumentasi, setPrevDokumentasi] = useState<string[]>([])
    const [programs, setPrograms] = useState<Program[]>([])

    const [stakeholders, setStakeholders] = useState<StakeholderActivity[]>([])
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryActivity[]>([])
    const [karyawan, setKaryawan] = useState<EmployeeActivity[]>([])

    const [allStakeholders, setAllStakeholders] = useState<StakeholderActivity[]>([])
    const [allBeneficiaries, setAllBeneficiaries] = useState<BeneficiaryActivity[]>([])
    const [allKaryawan, setAllKaryawan] = useState<EmployeeActivity[]>([])    

    const [showStakeholderDropdown, setShowStakeholderDropdown] = useState(false)
    const [showBeneficiaryDropdown, setShowBeneficiaryDropdown] = useState(false)
    const [showKaryawanDropdown, setShowKaryawanDropdown] = useState(false)

    const [stakeholderSearch, setStakeholderSearch] = useState("")
    const [beneficiarySearch, setBeneficiarySearch] = useState("")
    const [karyawanSearch, setKaryawanSearch] = useState("")

    const getDokumentasiList = (dokumentasi?: string): string[] => {
        if (!dokumentasi) return []

        try {
            const parsed = JSON.parse(dokumentasi)
            return Array.isArray(parsed) ? parsed : [parsed]
        } catch (error) {
            console.error(error)
            return dokumentasi.startsWith("http") ? [dokumentasi] : []
        }
    }

    useEffect(() => {
        const fetchActivityDetail = async () => {
            if (!id) return

            try {
                setLoading(true)
                const token = localStorage.getItem("token")

                if (!token) {
                    throw new Error("Authentication token not found")
                }

                const response = await fetch(`${API_URL}/api/activity/getactivity/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Gagal memuat detail aktivitas: ${response.status}`)
                }

                const data = await response.json()

                if (data.success) {
                    setKegiatan(data.activity)
                    setEditedKegiatan(data.activity)
                    setDokumentasiList(getDokumentasiList(data.activity?.dokumentasi))
                    setStakeholders(data.stakeholder ?? []);
                    setBeneficiaries(data.beneficiary ?? []);
                    setKaryawan(data.employee ?? []);

                } else {
                    throw new Error(data.message || "Failed to fetch activity")
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
                toast.error("Gagal memuat detail aktivitas!")
            } finally {
                setLoading(false)
            }
        }

        fetchActivityDetail()
    }, [id])

    useEffect(() => {
        if (kegiatan) {
            setDokumentasiList(getDokumentasiList(kegiatan.dokumentasi))
        }
    }, [kegiatan])

    const fetchPrograms = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_URL}/api/activity/idprogram`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) throw new Error("Gagal mengambil data program")

            const data = await response.json()
            setPrograms(data.idProgram)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchAllStakeholders = React.useCallback(async (page = 1, limit = 10) => {
        try {
            const token = localStorage.getItem("token");

            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", limit.toString());
            if (stakeholderSearch) {
                params.append("nama_stakeholder", stakeholderSearch);
            }

            const response = await fetch(`${API_URL}/api/stakeholder/getAll?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) throw new Error("Gagal mengambil data stakeholder")

            const data = await response.json()
            if (data.success) {
                setAllStakeholders(data.stakeholders || [])
            }
        } catch (error) {
            console.error(error)
        }
    }, [stakeholderSearch]);

    const fetchAllBeneficiaries = React.useCallback(async (page = 1, limit = 10) => {
        try {
            const token = localStorage.getItem("token");

            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", limit.toString());
            if (beneficiarySearch) {
                params.append("nama_instansi", beneficiarySearch);
            }

            const response = await fetch(`${API_URL}/api/beneficiary?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Gagal mengambil data penerima manfaat");

            const data = await response.json();
            if (data.success) {
                setAllBeneficiaries(data.data || []);
            }
        } catch (error) {
            console.error(error);
        }
    }, [beneficiarySearch]);

    const fetchAllKaryawan = React.useCallback(async (page = 1, limit = 9, sortBy = "created_at", sortOrder = "DESC") => {
        try {
            const token = localStorage.getItem("token");

            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", limit.toString());
            params.append("sortBy", sortBy);
            params.append("sortOrder", sortOrder);
            if (karyawanSearch) {
                params.append("search", karyawanSearch);
            }

            const response = await fetch(`${API_URL}/api/employee?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Gagal mengambil data karyawan");

            const data = await response.json();
            if (data.success) {
                setAllKaryawan(data.data || []);
            }
        } catch (error) {
            console.error(error);
        }
    }, [karyawanSearch]);

    const [debouncedSearchStakeholder, setDebouncedSearchStakeholder] = useState(stakeholderSearch);
    const [debouncedSearchBeneficiary, setDebouncedSearchBeneficiary] = useState(beneficiarySearch);
    const [debouncedSearchKaryawan, setDebouncedSearchKaryawan] = useState(karyawanSearch);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchStakeholder(stakeholderSearch);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [stakeholderSearch]);

    useEffect(() => {
        if (!stakeholderSearch) return;
        fetchAllStakeholders(1, 10);
    }, [debouncedSearchStakeholder, fetchAllStakeholders, stakeholderSearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchBeneficiary(beneficiarySearch);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [beneficiarySearch]);

    useEffect(() => {
        if (!beneficiarySearch) return;
        fetchAllBeneficiaries(1, 10);
    }, [debouncedSearchBeneficiary, fetchAllBeneficiaries, beneficiarySearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchKaryawan(karyawanSearch);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [karyawanSearch]);

    useEffect(() => {
        if (!karyawanSearch) return;
        fetchAllKaryawan();
    }, [debouncedSearchKaryawan, fetchAllKaryawan, karyawanSearch]);

    const handleEditClick = () => {
        setIsEditing(true)
        fetchPrograms()
        setPrevDokumentasi(dokumentasiList)
        setImages([])
    }

    const handleCancel = () => {
        setEditedKegiatan(kegiatan)
        setDeletedImages([])
        setImages([])
        setIsEditing(false)
        setStakeholders([])
        setBeneficiaries([])
        setKaryawan([])
    }

    const handleChange = (field: keyof DetailedKegiatan, value: string | number) => {
        setEditedKegiatan((prev) => (prev ? { ...prev, [field]: value } : null))
    }

    const handleProgramSelect = (program: Program) => {
        setEditedKegiatan((prev) =>
            prev ? { ...prev, nama_program: program.nama_program, program_id: program.id.toString() } : null,
        )
    }

    const handleProgramChange = (value: string) => {
        setEditedKegiatan((prev) => (prev ? { ...prev, nama_program: value } : null))
    }

    const handleRemoveImage = (index: number) => {
        const imageToRemove = dokumentasiList[index]
        const isNewUpload = imageToRemove.startsWith("blob:")

        setDokumentasiList((prev) => prev.filter((_, i) => i !== index))

        if (!isNewUpload) {
            setDeletedImages((prev) => [...prev, imageToRemove])
        }

        if (isNewUpload) {
            setImages((prev) => prev.filter((img) => img.url !== imageToRemove))
        }

        setPrevDokumentasi((prev) => prev.filter((_, i) => i !== index))
    }

    const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        if (files.length === 0) return

        const newImages: ImageData[] = files.map((file) => ({
            url: URL.createObjectURL(file),
            file,
        }))
        setImages((prev) => [...prev, ...newImages])
        setDokumentasiList((prev) => [...prev, ...newImages.map((image) => image.url)])
    }

    const removeStakeholder = (index: number) => {
        setStakeholders((prev) => prev.filter((_, i) => i !== index))
    }

    const removeBeneficiary = (index: number) => {
        setBeneficiaries((prev) => prev.filter((_, i) => i !== index))
    }

    const removeKaryawan = (index: number) => {
        setKaryawan((prev) => prev.filter((_, i) => i !== index))
    }

    const handleStakeholderSearchChange = (value: string) => {
        setStakeholderSearch(value)
        setShowStakeholderDropdown(true)
    }

    const handleBeneficiarySearchChange = (value: string) => {
        setBeneficiarySearch(value)
        setShowBeneficiaryDropdown(true)
    }

    const handleKaryawanSearchChange = (value: string) => {
        setKaryawanSearch(value)
        setShowKaryawanDropdown(true)
    }

    const handleSelectStakeholder = (stakeholder: StakeholderActivity) => {
        setStakeholders((prev) => {
            if (prev.find((s) => s.id === stakeholder.id)) return prev;
            return [...prev, stakeholder];
        });
        setStakeholderSearch("");
        setShowStakeholderDropdown(false);
    };


    const handleSelectBeneficiary = (beneficiary: BeneficiaryActivity) => {
        setBeneficiaries((prev) => {
            if (prev.find((b) => b.id === beneficiary.id)) return prev;
            return [...prev, beneficiary];
        });
        setBeneficiarySearch("");
        setShowBeneficiaryDropdown(false);
    };


    const handleSelectKaryawan = (karyawan: EmployeeActivity) => {
        setKaryawan((prev) => {
            if (prev.find((k) => k.id === karyawan.id)) return prev;
            return [...prev, karyawan];
        });
        setKaryawanSearch("");
        setShowKaryawanDropdown(false);
    };

    const handleStakeholderDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setShowStakeholderDropdown(false)
        }
    }

    const handleBeneficiaryDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setShowBeneficiaryDropdown(false)
        }
    }

    const handleKaryawanDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setShowKaryawanDropdown(false)
        }
    }

    const handleSaveClick = async () => {
        if (!editedKegiatan || !id) return

        setSaving(true)
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                throw new Error("Authentication token not found")
            }

            const formData = new FormData()
            formData.append("nama_aktivitas", editedKegiatan.nama_aktivitas)
            formData.append("programTerafiliasi", editedKegiatan.nama_program)
            formData.append("program_id", String(editedKegiatan.program_id))
            formData.append("tanggal_mulai", editedKegiatan.tanggal_mulai)
            formData.append("tanggal_selesai", editedKegiatan.tanggal_selesai)
            formData.append("status", editedKegiatan.status)
            formData.append("biaya_implementasi", String(editedKegiatan.biaya_implementasi))
            formData.append("deskripsi", editedKegiatan.deskripsi)

            deletedImages.forEach((image) => {
                formData.append("deleted_images[]", image)
            })

            prevDokumentasi.forEach((image) => {
                formData.append("prev_dokumentasi[]", image)
            })

            images.forEach((image) => {
                formData.append(`dokumentasi`, image.file)
            })

            formData.append("stakeholders", JSON.stringify(stakeholders.map((s) => s.id)))
            formData.append("beneficiaries", JSON.stringify(beneficiaries.map((b) => b.id)))
            formData.append("employees", JSON.stringify(karyawan.map((k) => k.id)))

            const response = await fetch(`${API_URL}/api/activity/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `Gagal memperbarui kegiatan!: ${response.status}`)
            }

            const data = await response.json()

            setTimeout(() => window.location.reload(), 500)

            if (data.success) {
                setIsEditing(false)
                setImages([])
                setDeletedImages([])
                toast.success("Kegiatan berhasil diperbarui!")
            } else {
                throw new Error(data.message || "Gagal memperbarui kegiatan!")
            }
        } catch (error) {
            console.error("Error updating activity:", error)
            toast.error(error instanceof Error ? error.message : "Gagal memperbarui kegiatan!")
        } finally {
            setSaving(false)
        }
    }

    return {
        kegiatan,
        loading,
        saving,
        error,
        isEditing,
        setIsEditing,
        fetchPrograms,
        editedKegiatan,
        dokumentasiList,
        programs,
        stakeholders,
        beneficiaries,
        karyawan,
        allStakeholders,
        allBeneficiaries,
        allKaryawan,
        showStakeholderDropdown,
        setShowStakeholderDropdown,
        showBeneficiaryDropdown,
        setShowBeneficiaryDropdown,
        showKaryawanDropdown,
        setShowKaryawanDropdown,
        stakeholderSearch,
        beneficiarySearch,
        karyawanSearch,
        handleEditClick,
        handleCancel,
        handleChange,
        handleProgramSelect,
        handleProgramChange,
        handleRemoveImage,
        handleAddImages,
        handleSaveClick,
        removeStakeholder,
        removeBeneficiary,
        removeKaryawan,
        handleStakeholderSearchChange,
        handleBeneficiarySearchChange,
        handleKaryawanSearchChange,
        handleSelectStakeholder,
        handleSelectBeneficiary,
        handleSelectKaryawan,
        handleStakeholderDropdownBlur,
        handleBeneficiaryDropdownBlur,
        handleKaryawanDropdownBlur,
    }
}
