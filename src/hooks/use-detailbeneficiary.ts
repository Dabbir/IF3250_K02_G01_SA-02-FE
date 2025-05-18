import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Beneficiary, Aktivitas, ValidationErrors } from "@/types/beneficiary";

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function useDetailBeneficiary(id: string | undefined) {
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBeneficiary, setEditedBeneficiary] = useState<Beneficiary | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aktivitas, setAktivitas] = useState<Aktivitas[]>([]);
  const [loadingAktivitas, setLoadingAktivitas] = useState(false);
  const [aktivitasError, setAktivitasError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isNewBeneficiary = id === "tambah";

  useEffect(() => {
    if (isNewBeneficiary) {
      setLoading(false);
      setIsEditing(true);
      setEditedBeneficiary({
        id: "",
        nama_instansi: "",
        nama_kontak: "",
        alamat: "",
        telepon: "",
        email: "",
        foto: "",
        created_at: "",
        updated_at: ""
      });
      return;
    }

    if (id) {
      fetchBeneficiaryDetail();
    }
  }, [id, isNewBeneficiary]);

  const fetchBeneficiaryDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/beneficiary/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch beneficiary: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setBeneficiary(result.data);
        setEditedBeneficiary(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch beneficiary");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Gagal memuat detail penerima manfaat!");
    } finally {
      setLoading(false);
    }
  };

  const fetchAktivitasBeneficiary = async () => {
    if (isNewBeneficiary || !id) return;
    
    try {
      setLoadingAktivitas(true);
      setAktivitasError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/api/beneficiary/aktivitas/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch aktivitas: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setAktivitas(result.data || []);
      } else {
        throw new Error(result.message || "Failed to fetch aktivitas");
      }
    } catch (err) {
      setAktivitasError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching aktivitas:", err);
    } finally {
      setLoadingAktivitas(false);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "aktivitas" && aktivitas.length === 0 && !loadingAktivitas) {
      fetchAktivitasBeneficiary();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) { 
        toast.error("Ukuran file terlalu besar. Maksimal 2MB");
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Format file tidak valid. Gunakan JPG, PNG, GIF, atau WEBP");
        return;
      }
      
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    if (editedBeneficiary && !isNewBeneficiary) {
      setEditedBeneficiary({
        ...editedBeneficiary,
        foto: ""
      });
    }
  };

  const handleChange = (field: keyof Beneficiary, value: string) => {
    setEditedBeneficiary((prev) => (prev ? { ...prev, [field]: value } : null));
    
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveClick = async () => {
    if (!editedBeneficiary) return;
  
    setSaving(true);
    setFieldErrors({}); 
    
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      const formData = new FormData();
      formData.append("nama_instansi", editedBeneficiary.nama_instansi);
      formData.append("nama_kontak", editedBeneficiary.nama_kontak || "");
      formData.append("alamat", editedBeneficiary.alamat || "");
      formData.append("telepon", editedBeneficiary.telepon || "");
      formData.append("email", editedBeneficiary.email || "");
      
      if (selectedImage) {
        formData.append("foto", selectedImage);
      } else if (editedBeneficiary.foto === "" && !isNewBeneficiary) {
        formData.append("remove_foto", "true");
      }
  
      const url = isNewBeneficiary 
        ? `${API_URL}/api/beneficiary`
        : `${API_URL}/api/beneficiary/${id}`;
      
      const method = isNewBeneficiary ? "POST" : "PUT";
  
      const response = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        if (result.errors && Array.isArray(result.errors)) {
          const errorObj: ValidationErrors = {};
          result.errors.forEach((error: { field: string; message: string }) => {
            errorObj[error.field] = error.message;
          });
          setFieldErrors(errorObj);
          
          const firstError = result.errors[0];
          const firstErrorField = document.getElementById(firstError.field);
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorField.focus();
          }
          
        } else {
          toast.error(result.message || `Gagal ${isNewBeneficiary ? 'menambahkan' : 'memperbarui'} penerima manfaat!`);
        }
        return;
      }
  
      if (result.success) {
        toast.success(result.message || `Penerima manfaat berhasil ${isNewBeneficiary ? 'ditambahkan' : 'diperbarui'}!`);
        
        if (isNewBeneficiary) {
          navigate(`/penerima-manfaat/${result.data.id}`);
        } else {
          setBeneficiary({...result.data});
          setIsEditing(false);
          setSelectedImage(null);
          setImagePreview(null);
        }
      } else {
        throw new Error(result.message || `Failed to ${isNewBeneficiary ? 'create' : 'update'} beneficiary`);
      }
    } catch (error) {
      console.error("Error saving beneficiary:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isNewBeneficiary) {
      navigate("/penerima-manfaat");
    } else {
      setEditedBeneficiary(beneficiary);
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
      setFieldErrors({}); 
    }
  };

  const handleViewAktivitas = (aktivitasId: string) => {
    navigate(`/aktivitas/${aktivitasId}`);
  };

  return {
    beneficiary,
    loading,
    saving,
    error,
    isEditing,
    editedBeneficiary,
    selectedImage,
    imagePreview,
    aktivitas,
    loadingAktivitas,
    aktivitasError,
    fieldErrors,
    fileInputRef,
    isNewBeneficiary,
    handleTabChange,
    handleEditClick,
    handleImageChange,
    handleRemoveImage,
    handleChange,
    handleSaveClick,
    handleCancel,
    handleViewAktivitas,
    fetchAktivitasBeneficiary,
  };
}