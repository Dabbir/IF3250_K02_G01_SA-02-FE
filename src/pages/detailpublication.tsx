"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Pencil, Save, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { toast } from "react-toastify"
import { formatRupiah } from "@/utils/formatters"

interface Publikasi {
    id: string;
    judul: string;
    media: "Televisi" | "Koran" | "Radio" | "Media Online" | "Sosial Media" | "Lainnya";
    perusahaan: string;
    tanggal: string;
    link: string;
    prValue: number;
    nama_program?: string;
    nama_aktivitas?: string;
    program_id?: string;  
    aktivitas_id?: string; 
    tone: "Positif" | "Netral" | "Negatif";
    created_at?: string;
    updated_at?: string;
}  

interface Program {
  id: string;
  nama_program: string;
}

interface Aktivitas {
  id: string;
  nama_aktivitas: string;
}

interface ValidationErrors {
    judul?: string;
    media?: string;
    perusahaan?: string;
    tanggal?: string;
    link?: string;
    prValue?: string;
    tone?: string;
}

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function DetailPublikasi() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

    if (id) {
      fetchPublikasiDetail();
    }
  }, [id]);

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

  const renderFormField = (label: string, content: React.ReactNode, fieldKey?: keyof ValidationErrors) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {content}
      {fieldKey && validationErrors[fieldKey] && (
        <p className="mt-1 text-sm text-red-600">{validationErrors[fieldKey]}</p>
      )}
    </div>
  );

  const handleGoBack = () => {
    navigate("/publikasi");
  };

  const handleCancel = () => {
    setEditedPublikasi(publikasi);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="m-2 md:m-5">
        <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-4 sm:py-7 px-2 sm:p-5 mx-auto border-0 shadow-inner">
          <CardHeader className="px-2 sm:px-6">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={handleGoBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <BookOpen className="h-6 w-6 text-slate-700" />
              <CardTitle>Detail Publikasi</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[400px] px-2 sm:px-6">
            <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !publikasi) {
    return (
      <div className="m-2 md:m-5">
        <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-4 sm:py-7 px-2 sm:p-5 mx-auto border-0 shadow-inner">
          <CardHeader className="px-2 sm:px-6">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={handleGoBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <BookOpen className="h-6 w-6 text-slate-700" />
              <CardTitle>Detail Publikasi</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[400px] px-2 sm:px-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || "Publication not found"}</p>
              <Button onClick={() => window.location.reload()} className="bg-[#3A786D] text-white">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "Positif":
        return "bg-green-100 text-green-800";
      case "Netral":
        return "bg-blue-100 text-blue-800";
      case "Negatif":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    } catch (e) {
      return dateString;
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

  return (
    <div className="m-2 md:m-5">
      <Card className="w-full min-h-[500px] h-auto py-4 sm:py-7 px-3 sm:p-5 mx-auto border-0 shadow-inner overflow-wrap">
        <CardHeader className="flex flex-col md:flex-row md:justify-between items-start gap-2 px-2 sm:px-6 pb-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-0" onClick={handleGoBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <BookOpen className="h-6 w-6 text-slate-700" />
            <CardTitle className="text-lg sm:text-xl truncate">Detail Publikasi</CardTitle>
          </div>

          <div className="flex flex-col text-xs space-y-1 text-gray-700 text-left md:text-right">
            <p className="text-[10px] sm:text-xs">
              Created: {publikasi?.created_at ? new Date(publikasi.created_at).toLocaleString() : "N/A"}
            </p>
            <p className="text-[10px] sm:text-xs">
              Updated: {publikasi?.updated_at ? new Date(publikasi.updated_at).toLocaleString() : "N/A"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pb-6 px-2 sm:px-6">
          <div className="space-y-4">
            <h1 className="text-lg sm:text-xl font-bold break-words">{publikasi.judul}</h1>

            <div className="flex justify-end mt-3">
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleEditClick} className="text-sm">
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} className="text-sm">
                    Cancel
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSaveClick} disabled={saving} className="text-sm">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" /> Simpan
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div key={JSON.stringify(validationErrors)} className="md:hidden space-y-4">
              {isEditing ? (
                <>
                  {renderFormField("Judul Publikasi", 
                    <Input
                        value={editedPublikasi?.judul || ""}
                        onChange={(e) => handleChange("judul", e.target.value)}
                        className={`w-full ${validationErrors.judul ? 'border-red-500' : ''}`}
                    />,
                    "judul"  
                  )}
                  
                  {renderFormField("Media Publikasi",
                    <Select
                        value={editedPublikasi?.media || "Media Online"}
                        onValueChange={(value) => handleChange("media", value)}
                    >
                        <SelectTrigger className={`w-full ${validationErrors.media ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Pilih Media Publikasi" />
                        </SelectTrigger>
                        <SelectContent>
                        {["Televisi", "Koran", "Radio", "Media Online", "Sosial Media", "Lainnya"].map((type) => (
                            <SelectItem key={type} value={type}>
                            {type}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>,
                    "media"  
                  )}
                  
                  {renderFormField("Perusahaan Media",
                    <Input
                      value={editedPublikasi?.perusahaan || ""}
                      onChange={(e) => handleChange("perusahaan", e.target.value)}
                      className={`w-full ${validationErrors.perusahaan ? 'border-red-500' : ''}`}
                    />,
                    "perusahaan"
                  )}
                  
                  {renderFormField("Tanggal Publikasi",
                    <Input
                      type="date"
                      value={
                        editedPublikasi?.tanggal
                          ? new Date(editedPublikasi.tanggal).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => handleChange("tanggal", e.target.value)}
                      className={`w-full ${validationErrors.tanggal ? 'border-red-500' : ''}`}
                    />,
                    "tanggal"
                  )}
                  
                  {renderFormField("Link Publikasi",
                    <Input
                      value={editedPublikasi?.link || ""}
                      onChange={(e) => handleChange("link", e.target.value)}
                      className={`w-full ${validationErrors.link ? 'border-red-500' : ''}`}
                    />,
                    "link"
                  )}
                  
                  {renderFormField("PR Value",
                    <div className="flex items-center w-full">
                        <span className="mr-1">Rp</span>
                        <Input
                        type="text"
                        value={prValueDisplay}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            handleChange("prValue", parseInt(value) || 0);
                        }}
                        className={`w-full ${validationErrors.prValue ? 'border-red-500' : ''}`}
                        placeholder="0"
                        />
                    </div>,
                    "prValue"
                  )}
                  
                  {renderFormField("Program",
                    <Select
                        value={editedPublikasi?.program_id || ""}
                        onValueChange={(value) => {
                        const selectedProgram = programList.find(p => p.id === value);
                        setEditedPublikasi(prev => prev ? {
                            ...prev,
                            program_id: value,
                            nama_program: selectedProgram?.nama_program || ""
                        } : null);
                        }}
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Program" />
                        </SelectTrigger>
                        <SelectContent>
                        {programList && programList.length > 0 ? (
                            programList.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                                {program.nama_program || "Unnamed Program"}
                            </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                            Tidak ada data program
                            </SelectItem>
                        )}
                        </SelectContent>
                    </Select>
                  )}
                  
                  {renderFormField("Aktivitas",
                    <Select
                        value={editedPublikasi?.aktivitas_id || ""}
                        onValueChange={(value) => {
                        const selectedActivity = aktivitasList.find(a => a.id === value);
                        setEditedPublikasi(prev => prev ? {
                            ...prev,
                            aktivitas_id: value,
                            nama_aktivitas: selectedActivity?.nama_aktivitas || ""
                        } : null);
                        }}
                    >
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Aktivitas" />
                        </SelectTrigger>
                        <SelectContent>
                        {aktivitasList && aktivitasList.length > 0 ? (
                            aktivitasList.map((aktivitas) => (
                            <SelectItem key={aktivitas.id} value={aktivitas.id}>
                                {aktivitas.nama_aktivitas || "Unnamed Activity"}
                            </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                            Tidak ada data aktivitas
                            </SelectItem>
                        )}
                        </SelectContent>
                    </Select>
                  )}
                  
                  {renderFormField("Tone",
                    <Select
                      value={editedPublikasi?.tone || "Netral"}
                      onValueChange={(value) => handleChange("tone", value)}
                    >
                      <SelectTrigger className={`w-full ${validationErrors.tone ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Pilih Tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Positif", "Netral", "Negatif"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>,
                    "tone"
                  )}
                </>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-3 gap-2 border-b pb-2">
                    <div className="col-span-1 font-medium text-gray-600">Media</div>
                    <div className="col-span-2">{publikasi.media}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 border-b pb-2">
                    <div className="col-span-1 font-medium text-gray-600">Perusahaan</div>
                    <div className="col-span-2">{publikasi.perusahaan}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 border-b pb-2">
                    <div className="col-span-1 font-medium text-gray-600">Tanggal</div>
                    <div className="col-span-2">{formatDate(publikasi.tanggal)}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 border-b pb-2">
                    <div className="col-span-1 font-medium text-gray-600">Link</div>
                    <div className="col-span-2 break-words">
                      <a href={publikasi.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {publikasi.link}
                      </a>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 border-b pb-2">
                    <div className="col-span-1 font-medium text-gray-600">PR Value</div>
                    <div className="col-span-2">
                      Rp{Math.round(publikasi.prValue).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 border-b pb-2">
                    <div className="col-span-1 font-medium text-gray-600">Program</div>
                    <div className="col-span-2">{publikasi.nama_program || "N/A"}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 border-b pb-2">
                    <div className="col-span-1 font-medium text-gray-600">Aktivitas</div>
                    <div className="col-span-2">{publikasi.nama_aktivitas || "N/A"}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 border-b pb-2">
                    <div className="col-span-1 font-medium text-gray-600">Tone</div>
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getToneColor(publikasi.tone)}`}>
                        {publikasi.tone}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <Table className="border rounded-lg overflow-hidden mb-2">
                <TableBody>
                <TableRow>
                    <TableHead className="w-1/4">Judul Publikasi</TableHead>
                    <TableCell>
                        <div className="space-y-1">
                        {isEditing ? (
                            <Input
                            value={editedPublikasi?.judul || ""}
                            onChange={(e) => handleChange("judul", e.target.value)}
                            className={`w-full ${validationErrors.judul ? 'border-red-500' : ''}`}
                            />
                        ) : (
                            publikasi.judul
                        )}
                        {isEditing && validationErrors.judul && (
                            <p className="text-sm text-red-600">{validationErrors.judul}</p>
                        )}
                        </div>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Media Publikasi</TableHead>
                    <TableCell>
                        <div className="space-y-1">
                        {isEditing ? (
                            <Select
                            value={editedPublikasi?.media || "Media Online"}
                            onValueChange={(value) => handleChange("media", value)}
                            >
                            <SelectTrigger className={`w-full ${validationErrors.media ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Pilih Media Publikasi" />
                            </SelectTrigger>
                            <SelectContent>
                                {["Televisi", "Koran", "Radio", "Media Online", "Sosial Media", "Lainnya"].map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        ) : (
                            publikasi.media
                        )}
                        {isEditing && validationErrors.media && (
                            <p className="text-sm text-red-600">{validationErrors.media}</p>
                        )}
                        </div>
                    </TableCell>
                </TableRow>
                <TableRow>
                        <TableHead>Perusahaan Media</TableHead>
                        <TableCell>
                            <div className="space-y-1">
                            {isEditing ? (
                                <Input
                                value={editedPublikasi?.perusahaan || ""}
                                onChange={(e) => handleChange("perusahaan", e.target.value)}
                                className={`w-full ${validationErrors.perusahaan ? 'border-red-500' : ''}`}
                                />
                            ) : (
                                publikasi.perusahaan
                            )}
                            {isEditing && validationErrors.perusahaan && (
                                <p className="text-sm text-red-600">{validationErrors.perusahaan}</p>
                            )}
                            </div>
                        </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Tanggal Publikasi</TableHead>
                    <TableCell>
                        <div className="space-y-1">
                        {isEditing ? (
                            <Input
                            type="date"
                            value={
                                editedPublikasi?.tanggal
                                ? new Date(editedPublikasi.tanggal).toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) => handleChange("tanggal", e.target.value)}
                            className={`w-full ${validationErrors.tanggal ? 'border-red-500' : ''}`}
                            />
                        ) : publikasi.tanggal ? (
                            formatDate(publikasi.tanggal)
                        ) : (
                            "N/A"
                        )}
                        {isEditing && validationErrors.tanggal && (
                            <p className="text-sm text-red-600">{validationErrors.tanggal}</p>
                        )}
                        </div>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>Link Publikasi</TableHead>
                    <TableCell>
                        <div className="space-y-1">
                        {isEditing ? (
                            <Input
                            value={editedPublikasi?.link || ""}
                            onChange={(e) => handleChange("link", e.target.value)}
                            className={`w-full ${validationErrors.link ? 'border-red-500' : ''}`}
                            />
                        ) : (
                            <a
                            href={publikasi.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                            >
                            {publikasi.link}
                            </a>
                        )}
                        {isEditing && validationErrors.link && (
                            <p className="text-sm text-red-600">{validationErrors.link}</p>
                        )}
                        </div>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableHead>PR Value</TableHead>
                    <TableCell>
                        <div className="space-y-1">
                        <div className="flex items-center">
                            {isEditing ? (
                            <div className="flex items-center w-full">
                                <span className="mr-1">Rp</span>
                                <Input
                                type="text"
                                value={prValueDisplay}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    handleChange("prValue", parseInt(value) || 0);
                                }}
                                className={`w-full ${validationErrors.prValue ? 'border-red-500' : ''}`}
                                placeholder="0"
                                />
                            </div>
                            ) : (
                            <span>Rp{formatRupiah(publikasi.prValue)}</span>
                            )}
                        </div>
                        {isEditing && validationErrors.prValue && (
                            <p className="text-sm text-red-600">{validationErrors.prValue}</p>
                        )}
                        </div>
                    </TableCell>
                </TableRow>

                <TableRow>
                <TableHead>Program</TableHead>
                <TableCell>
                    {isEditing ? (
                    <Select
                        value={editedPublikasi?.program_id || ""}
                        onValueChange={(value) => {
                        const selectedProgram = programList.find(p => p.id === value);
                        setEditedPublikasi(prev => prev ? {
                            ...prev,
                            program_id: value,
                            nama_program: selectedProgram?.nama_program || ""
                        } : null);
                        }}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Pilih Program" />
                        </SelectTrigger>
                        <SelectContent>
                        {programList && programList.length > 0 ? (
                            programList.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                                {program.nama_program || "Unnamed Program"}
                            </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                            Tidak ada data program
                            </SelectItem>
                        )}
                        </SelectContent>
                    </Select>
                    ) : (
                    publikasi.nama_program || "N/A"
                    )}
                </TableCell>
                </TableRow>

                <TableRow>
                <TableHead>Aktivitas</TableHead>
                <TableCell>
                    {isEditing ? (
                    <Select
                        value={editedPublikasi?.aktivitas_id || ""}
                        onValueChange={(value) => {
                        const selectedActivity = aktivitasList.find(a => a.id === value);
                        setEditedPublikasi(prev => prev ? {
                            ...prev,
                            aktivitas_id: value,
                            nama_aktivitas: selectedActivity?.nama_aktivitas || ""
                        } : null);
                        }}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Pilih Aktivitas" />
                        </SelectTrigger>
                        <SelectContent>
                        {aktivitasList && aktivitasList.length > 0 ? (
                            aktivitasList.map((aktivitas) => (
                            <SelectItem key={aktivitas.id} value={aktivitas.id}>
                                {aktivitas.nama_aktivitas || "Unnamed Activity"}
                            </SelectItem>
                            ))
                        ) : (
                            <SelectItem value="no-data" disabled>
                            Tidak ada data aktivitas
                            </SelectItem>
                        )}
                        </SelectContent>
                    </Select>
                    ) : (
                    publikasi.nama_aktivitas || "N/A"
                    )}
                </TableCell>
                </TableRow>

                <TableRow>
                <TableHead>Tone</TableHead>
                <TableCell>
                    <div className="space-y-1">
                    {isEditing ? (
                        <Select
                        value={editedPublikasi?.tone || "Netral"}
                        onValueChange={(value) => handleChange("tone", value)}
                        >
                        <SelectTrigger className={`w-full ${validationErrors.tone ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Pilih Tone" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Positif", "Netral", "Negatif"].map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    ) : (
                        <span className={`px-2 py-1 rounded-full text-xs ${getToneColor(publikasi.tone)}`}>
                        {publikasi.tone}
                        </span>
                    )}
                    {isEditing && validationErrors.tone && (
                        <p className="text-sm text-red-600">{validationErrors.tone}</p>
                    )}
                    </div>
                </TableCell>
                </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}