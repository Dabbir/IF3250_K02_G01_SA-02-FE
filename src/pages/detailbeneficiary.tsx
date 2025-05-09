"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Pencil, Save, Loader2, ArrowLeft, Upload, X, Calendar, Eye } from "lucide-react"
import { toast } from "react-toastify"

interface Beneficiary {
  id: string;
  nama_instansi: string;
  nama_kontak: string;
  alamat: string;
  telepon: string;
  email: string;
  foto: string;
  created_at: string;
  updated_at: string;
}

interface Aktivitas {
  id: string;
  nama: string;
  tanggal: string;
  lokasi: string;
  deskripsi: string;
  foto: string;
  created_at: string;
  updated_at: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function DetailBeneficiary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBeneficiary, setEditedBeneficiary] = useState<Beneficiary | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isNewBeneficiary = id === "tambah";
  
  const [aktivitas, setAktivitas] = useState<Aktivitas[]>([]);
  const [loadingAktivitas, setLoadingAktivitas] = useState(false);
  const [aktivitasError, setAktivitasError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

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

    if (id) {
      fetchBeneficiaryDetail();
    }
  }, [id, isNewBeneficiary]);

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
          result.errors.forEach((error: ValidationError) => {
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

  const handleGoBack = () => {
    navigate("/penerima-manfaat");
  };

  const handleViewAktivitas = (aktivitasId: string) => {
    navigate(`/aktivitas/${aktivitasId}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="m-5">
        <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={handleGoBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Building className="h-6 w-6 text-slate-700" />
              <CardTitle>{isNewBeneficiary ? "Tambah Penerima Manfaat" : "Detail Penerima Manfaat"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || (!beneficiary && !isNewBeneficiary)) {
    return (
      <div className="m-5">
        <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-0 mr-2" onClick={handleGoBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Building className="h-6 w-6 text-slate-700" />
              <CardTitle>{isNewBeneficiary ? "Tambah Penerima Manfaat" : "Detail Penerima Manfaat"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || "Penerima manfaat tidak ditemukan"}</p>
              <Button onClick={() => window.location.reload()} className="bg-[#3A786D] text-white">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="m-5">
      <Card className="w-full min-h-[500px] h-auto py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-wrap">
        <CardHeader className="flex flex-col md:flex-row md:justify-between items-start gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-0" onClick={handleGoBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Building className="h-6 w-6 text-slate-700" />
            <CardTitle>{isNewBeneficiary ? "Tambah Penerima Manfaat" : "Detail Penerima Manfaat"}</CardTitle>
          </div>

          {!isNewBeneficiary && beneficiary && (
            <div className="flex flex-col text-xs space-y-1 text-gray-700 text-left md:text-right">
              <p>
                Created At:{" "}
                {beneficiary?.created_at ? new Date(beneficiary.created_at).toLocaleString() : "N/A"}
              </p>
              <p>
                Updated At:{" "}
                {beneficiary?.updated_at ? new Date(beneficiary.updated_at).toLocaleString() : "N/A"}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-10">
          {!isNewBeneficiary ? (
            <Tabs defaultValue="profile" onValueChange={handleTabChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="aktivitas">Aktivitas Terkait</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <div className="space-y-4">
                  <h1 className="text-xl font-bold">{beneficiary?.nama_instansi}</h1>

                  <div className="flex justify-end mt-4">
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={handleEditClick}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleSaveClick} disabled={saving}>
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                    <Table className="border rounded-lg overflow-hidden mb-2">
                      <TableBody>
                        <TableRow>
                          <TableHead className="w-1/3">Nama Instansi</TableHead>
                          <TableCell>
                            {isEditing ? (
                              <div className="space-y-1">
                                <Input
                                  id="nama_instansi"
                                  value={editedBeneficiary?.nama_instansi || ""}
                                  onChange={(e) => handleChange("nama_instansi", e.target.value)}
                                  placeholder="Nama instansi/lembaga"
                                  className={fieldErrors.nama_instansi ? "border-red-500" : ""}
                                />
                                {fieldErrors.nama_instansi && (
                                  <p className="text-red-500 text-sm">{fieldErrors.nama_instansi}</p>
                                )}
                              </div>
                            ) : (
                              <span>{beneficiary?.nama_instansi || "N/A"}</span>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Nama Kontak</TableHead>
                          <TableCell>
                            {isEditing ? (
                              <div className="space-y-1">
                                <Input
                                  id="nama_kontak"
                                  value={editedBeneficiary?.nama_kontak || ""}
                                  onChange={(e) => handleChange("nama_kontak", e.target.value)}
                                  placeholder="Nama kontak personil"
                                  className={fieldErrors.nama_kontak ? "border-red-500" : ""}
                                />
                                {fieldErrors.nama_kontak && (
                                  <p className="text-red-500 text-sm">{fieldErrors.nama_kontak}</p>
                                )}
                              </div>
                            ) : (
                              <span>{beneficiary?.nama_kontak || "N/A"}</span>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableCell>
                            {isEditing ? (
                              <div className="space-y-1">
                                <Input
                                  id="email"
                                  type="email"
                                  value={editedBeneficiary?.email || ""}
                                  onChange={(e) => handleChange("email", e.target.value)}
                                  placeholder="Email kontak"
                                  className={fieldErrors.email ? "border-red-500" : ""}
                                />
                                {fieldErrors.email && (
                                  <p className="text-red-500 text-sm">{fieldErrors.email}</p>
                                )}
                              </div>
                            ) : (
                              <span>{beneficiary?.email || "N/A"}</span>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Telepon</TableHead>
                          <TableCell>
                            {isEditing ? (
                              <div className="space-y-1">
                                <Input
                                  id="telepon"
                                  type="tel"
                                  value={editedBeneficiary?.telepon || ""}
                                  onChange={(e) => handleChange("telepon", e.target.value)}
                                  placeholder="Nomor telepon"
                                  className={fieldErrors.telepon ? "border-red-500" : ""}
                                />
                                {fieldErrors.telepon && (
                                  <p className="text-red-500 text-sm">{fieldErrors.telepon}</p>
                                )}
                              </div>
                            ) : (
                              <span>{beneficiary?.telepon || "N/A"}</span>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableHead>Alamat</TableHead>
                          <TableCell>
                            {isEditing ? (
                              <div className="space-y-1">
                                <Textarea
                                  id="alamat"
                                  value={editedBeneficiary?.alamat || ""}
                                  onChange={(e) => handleChange("alamat", e.target.value)}
                                  placeholder="Alamat lengkap"
                                  className={`min-h-[100px] ${fieldErrors.alamat ? "border-red-500" : ""}`}
                                />
                                {fieldErrors.alamat && (
                                  <p className="text-red-500 text-sm">{fieldErrors.alamat}</p>
                                )}
                              </div>
                            ) : (
                              <span className="whitespace-pre-wrap">{beneficiary?.alamat || "N/A"}</span>
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    </div>

                    <div>
                    <div className="border rounded-lg p-4 mb-4">
                      <h3 className="font-medium text-lg mb-4">Foto Instansi/Lembaga</h3>
                      
                      {isEditing ? (
                        <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {(imagePreview || editedBeneficiary?.foto) ? (
                            <div className="relative">
                              <div className="aspect-video bg-white rounded-md overflow-hidden mb-3">
                                <img
                                  src={imagePreview || editedBeneficiary?.foto}
                                  alt={editedBeneficiary?.nama_instansi}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-white hover:bg-red-50 text-red-600 border border-red-200"
                              >
                                <X className="h-4 w-4 mr-1" /> Hapus Foto
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                              <div className="text-sm text-gray-600 mb-4">
                                Belum ada foto yang diunggah
                              </div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/jpeg, image/png, image/gif, image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                                id="foto-upload"
                              />
                              
                              <label
                                htmlFor="foto-upload"
                                className="inline-flex items-center px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Pilih Foto
                              </label>
                            </div>
                          )}
                          
                          {fieldErrors.foto && (
                            <p className="text-red-500 text-sm mt-2">{fieldErrors.foto}</p>
                          )}
                          
                          <p className="text-xs text-gray-500 mt-3 text-center">
                            Format yang didukung: JPG, PNG, WEBP, GIF. Ukuran maksimal: 2MB
                          </p>
                        </div>
                      ) : (
                        <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-md overflow-hidden">
                          {beneficiary?.foto ? (
                            <img
                              src={beneficiary.foto}
                              alt={beneficiary.nama_instansi}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building className="h-16 w-16 text-slate-300" />
                          )}
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="aktivitas">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Aktivitas Terkait dengan {beneficiary?.nama_instansi}</h2>
                  
                  {loadingAktivitas ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
                    </div>
                  ) : aktivitasError ? (
                    <div className="py-6 text-center">
                      <p className="text-red-500 mb-2">{aktivitasError}</p>
                      <Button onClick={fetchAktivitasBeneficiary} className="bg-[#3A786D] text-white">
                        Coba Lagi
                      </Button>
                    </div>
                  ) : aktivitas.length === 0 ? (
                    <div className="py-6 text-center border rounded-lg">
                      <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-gray-500">Belum ada aktivitas terkait dengan penerima manfaat ini</p>
                    </div>
                  ) : (
                    <Table className="border rounded-lg">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Nama Aktivitas</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Lokasi</TableHead>
                          <TableHead className="w-[250px]">Deskripsi</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aktivitas.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.nama}</TableCell>
                            <TableCell>{formatDate(item.tanggal)}</TableCell>
                            <TableCell>{item.lokasi || "N/A"}</TableCell>
                            <TableCell className="max-w-[250px] truncate">
                              {item.deskripsi || "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewAktivitas(item.id)}
                              >
                                <Eye className="h-4 w-4 mr-2" /> Lihat
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end mt-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSaveClick} disabled={saving}>
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Table className="border rounded-lg overflow-hidden mb-2">
                    <TableBody>
                      <TableRow>
                        <TableHead className="w-1/3">Nama Instansi</TableHead>
                        <TableCell>
                          <Input
                            value={editedBeneficiary?.nama_instansi || ""}
                            onChange={(e) => handleChange("nama_instansi", e.target.value)}
                            placeholder="Nama instansi/lembaga"
                            required
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Nama Kontak</TableHead>
                        <TableCell>
                          <Input
                            value={editedBeneficiary?.nama_kontak || ""}
                            onChange={(e) => handleChange("nama_kontak", e.target.value)}
                            placeholder="Nama kontak personil"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableCell>
                          <Input
                            type="email"
                            value={editedBeneficiary?.email || ""}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Email kontak"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Telepon</TableHead>
                        <TableCell>
                          <Input
                            type="tel"
                            value={editedBeneficiary?.telepon || ""}
                            onChange={(e) => handleChange("telepon", e.target.value)}
                            placeholder="Nomor telepon"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableHead>Alamat</TableHead>
                        <TableCell>
                          <Textarea
                            value={editedBeneficiary?.alamat || ""}
                            onChange={(e) => handleChange("alamat", e.target.value)}
                            placeholder="Alamat lengkap"
                            className="min-h-[100px]"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <div className="border rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-lg mb-4">Foto Instansi/Lembaga</h3>
                    
                    <div className="aspect-video bg-slate-100 flex items-center justify-center rounded-md overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building className="h-16 w-16 text-slate-300" />
                      )}
                    </div>

                    <div className="mt-4 flex flex-col items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg, image/png, image/gif, image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                        id="foto-upload"
                      />
                      
                      <div className="flex gap-2">
                        <label
                          htmlFor="foto-upload"
                          className="bg-[#3A786D] cursor-pointer inline-flex items-center px-4 py-2 text-white rounded-md hover:bg-opacity-90"
                        >
                          <Upload className="h-4 w-4 mr-2" /> Upload Foto
                        </label>
                        
                        {imagePreview && (
                          <Button
                            variant="outline"
                            size="default"
                            onClick={handleRemoveImage}
                            className="text-red-500 border-red-200"
                          >
                            <X className="h-4 w-4 mr-2" /> Hapus
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Format: JPG, PNG, WEBP, GIF. Ukuran maksimal: 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}