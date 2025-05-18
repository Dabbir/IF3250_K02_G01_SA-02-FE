import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import type { Publikasi, Program, Aktivitas, ValidationErrors } from "@/types/publication";
import { formatRupiah } from "@/utils/formatters";

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function useDetailPublication(id: string | undefined) {
  const [publikasi, setPublikasi] = useState<Publikasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPublikasi, setEditedPublikasi] = useState<Publikasi | null>(null);
  const [programList, setProgramList] = useState<Program[]>([]);
  const [aktivitasList, setAktivitasList] = useState<Aktivitas[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [prValueDisplay, setPrValueDisplay] = useState("");

  useEffect(() => {
    if (id) {
      fetchPublikasiDetail();
    }
  }, [id]);

  const fetchPublikasiDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/publication/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch publication: ${response.status}`);
      }

      const data = await response.json();
      
      const formattedData: Publikasi = {
        id: data.id || "",
        judul: data.judul_publikasi || "",
        media: data.media_publikasi || "Media Online",
        perusahaan: data.nama_perusahaan_media || "",
        tanggal: data.tanggal_publikasi || "",
        link: data.url_publikasi || "",
        prValue: data.pr_value || 0,
        nama_program: data.program_name || data.nama_program || "",
        nama_aktivitas: data.activity_name || data.nama_aktivitas || "",
        program_id: data.program_id || "",  
        aktivitas_id: data.aktivitas_id || "", 
        tone: data.tone || "Netral",
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setPublikasi(formattedData);
      setEditedPublikasi(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Gagal memuat detail publikasi!");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/program`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Gagal mengambil program: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result && result.data && Array.isArray(result.data)) {
        const formattedData: Program[] = result.data.map((item: any) => ({
          id: item.id, 
          nama_program: item.nama_program || "",
        }));
        setProgramList(formattedData);
      }
    } catch (error) {
      console.error("Error fetching program:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.warn("Token tidak ditemukan");
        return;
      }
    
      const response = await fetch(`${API_URL}/api/activity/getreport/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    
      if (!response.ok) {
        throw new Error(`Gagal mengambil aktivitas: ${response.status}`);
      }
    
      const data = await response.json();
      
      if (data && data.activity && Array.isArray(data.activity)) {
        const formattedData: Aktivitas[] = data.activity.map((item: any) => ({
          id: item.id || "",
          nama_aktivitas: item.nama_aktivitas || "",
        }));
        setAktivitasList(formattedData);
      }
    } catch (error) {
      console.error("Error fetching aktivitas:", error);
    }
  };

  const validateField = (field: keyof Publikasi, value: any): string | undefined => {
    switch (field) {
      case "judul":
        if (!value || value.trim() === "") return "Judul publikasi harus diisi";
        if (value.length < 3) return "Judul minimal 3 karakter";
        break;
      case "media":
        if (!value) return "Media publikasi harus dipilih";
        break;
      case "perusahaan":
        if (!value || value.trim() === "") return "Nama perusahaan media harus diisi";
        break;
      case "tanggal":
        if (!value) return "Tanggal publikasi harus diisi";
        const date = new Date(value);
        if (isNaN(date.getTime())) return "Format tanggal tidak valid";
        if (date > new Date()) return "Tanggal tidak boleh lebih dari hari ini";
        break;
      case "link":
        if (!value || value.trim() === "") return "Link publikasi harus diisi";
        try {
          new URL(value);
        } catch {
          return "Format URL tidak valid";
        }
        break;
      case "prValue":
        if (value === undefined || value === null || value === "") return "PR Value harus diisi";
        if (value < 0) return "PR Value tidak boleh negatif";
        break;
      case "tone":
        if (!value) return "Tone harus dipilih";
        break;
    }
    return undefined;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    fetchPrograms();
    fetchActivities();
    if (publikasi?.prValue) {
      setPrValueDisplay(formatRupiah(publikasi.prValue));
    }
  };

  const handleChange = (field: keyof Publikasi, value: string | number) => {
    if (field === "prValue") {
      let numericValue = typeof value === 'string' ? value.replace(/\D/g, '') : value.toString();
      const numberValue = parseInt(numericValue) || 0;
      
      setEditedPublikasi((prev) => (prev ? { ...prev, [field]: numberValue } : null));
      setPrValueDisplay(formatRupiah(numberValue));
      
      const error = validateField(field, numberValue);
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setEditedPublikasi((prev) => (prev ? { ...prev, [field]: value } : null));
      
      const error = validateField(field, value);
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSaveClick = async () => {
    if (!editedPublikasi) return;

    const errors: ValidationErrors = {};
    let hasError = false;

    const fieldsToValidate: (keyof ValidationErrors)[] = ['judul', 'media', 'perusahaan', 'tanggal', 'link', 'prValue', 'tone'];
    fieldsToValidate.forEach(field => {
      const error = validateField(field as keyof Publikasi, editedPublikasi[field as keyof Publikasi]);
      if (error) {
        errors[field] = error;
        hasError = true;
      }
    });

    setValidationErrors(prevErrors => ({
      ...prevErrors,
      ...errors
    }));

    if (hasError) {
      return;
    }
  
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      let formattedDate = editedPublikasi.tanggal;
      if (editedPublikasi.tanggal) {
        const date = new Date(editedPublikasi.tanggal);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0];
        }
      }
  
      const prValue = typeof editedPublikasi.prValue === 'string' 
        ? parseFloat(editedPublikasi.prValue) 
        : editedPublikasi.prValue; 

      const requestBody = {
        judul_publikasi: editedPublikasi.judul || "",
        media_publikasi: editedPublikasi.media || "Media Online",
        nama_perusahaan_media: editedPublikasi.perusahaan || "",
        tanggal_publikasi: formattedDate || "",
        url_publikasi: editedPublikasi.link || "",
        pr_value: prValue || 0,
        program_id: editedPublikasi.program_id || null, 
        aktivitas_id: editedPublikasi.aktivitas_id || null,  
        tone: editedPublikasi.tone || "Netral"
      };          
  
      const response = await fetch(`${API_URL}/api/publication/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const contentType = response.headers.get("content-type");
      let errorDetails = "";
      
      if (contentType && contentType.includes("application/json")) {
        const errorResponse = await response.json();
        errorDetails = errorResponse.message || JSON.stringify(errorResponse);
      } else {
        errorDetails = await response.text();
      }
  
      if (!response.ok) {
        throw new Error(`Failed to update publication: ${response.status} - ${errorDetails}`);
      }
  
      setPublikasi(editedPublikasi);
      setIsEditing(false);
      toast.success("Publikasi berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating publication:", error);
      toast.error(`Gagal memperbarui publikasi: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedPublikasi(publikasi);
    setValidationErrors({});
    setIsEditing(false);
  };

  return {
    publikasi,
    loading,
    saving,
    error,
    isEditing,
    editedPublikasi,
    programList,
    aktivitasList,
    validationErrors,
    prValueDisplay,
    setPrValueDisplay,
    handleEditClick,
    handleChange,
    handleSaveClick,
    handleCancel,
    validateField,
  };
}