"use client";

import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building } from "lucide-react";

// Components
import LoadingState from "@/components/loading/loading";
import ErrorState from "@/components/error/error";
import DetailHeader from "@/components/shared/detailheader";
import EditButton from "@/components/shared/editbutton";
import SaveCancelButtons from "@/components/shared/savecancelbutton";
import DetailTable from "@/components/beneficiary/detailtable";
import ImageUpload from "@/components/beneficiary/imageupload";
import AktivitasTable from "@/components/beneficiary/activitytable";

// Hooks
import useDetailBeneficiary from "@/hooks/use-detailbeneficiary";

export default function DetailBeneficiary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    beneficiary,
    loading,
    saving,
    error,
    isEditing,
    editedBeneficiary,
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
  } = useDetailBeneficiary(id);

  const handleGoBack = () => {
    navigate("/penerima-manfaat");
  };

  if (loading) {
    return <LoadingState title={isNewBeneficiary ? "Tambah Penerima Manfaat" : "Detail Penerima Manfaat"} onGoBack={handleGoBack} Icon={Building} />;
  }

  if (error || (!beneficiary && !isNewBeneficiary)) {
    return (
      <ErrorState
        error={error || "Penerima manfaat tidak ditemukan"}
        title={isNewBeneficiary ? "Tambah Penerima Manfaat" : "Detail Penerima Manfaat"}
        onGoBack={handleGoBack}
        Icon={Building}
      />
    );
  }

  return (
    <div className="m-5">
      <Card className="w-full min-h-[500px] h-auto py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-wrap">
        <DetailHeader
          title={isNewBeneficiary ? "Tambah Penerima Manfaat" : "Detail Penerima Manfaat"}
          createdAt={beneficiary?.created_at ?? null}
          updatedAt={beneficiary?.updated_at ?? null}
          onGoBack={handleGoBack}
          Icon={Building}
        />

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

                  <EditButton onEdit={handleEditClick} isEditing={isEditing} />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <DetailTable
                        beneficiary={beneficiary}
                        editedBeneficiary={editedBeneficiary}
                        isEditing={isEditing}
                        fieldErrors={fieldErrors}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <ImageUpload
                        beneficiary={beneficiary}
                        editedBeneficiary={editedBeneficiary}
                        isEditing={isEditing}
                        isNewBeneficiary={isNewBeneficiary}
                        imagePreview={imagePreview}
                        fieldErrors={fieldErrors}
                        fileInputRef={fileInputRef}
                        onImageChange={handleImageChange}
                        onRemoveImage={handleRemoveImage}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <SaveCancelButtons
                      saving={saving}
                      onSave={handleSaveClick}
                      onCancel={handleCancel}
                    />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="aktivitas">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Aktivitas Terkait dengan {beneficiary?.nama_instansi}</h2>
                  
                  <AktivitasTable
                    aktivitas={aktivitas}
                    loading={loadingAktivitas}
                    error={aktivitasError}
                    onViewAktivitas={handleViewAktivitas}
                    onRefetch={fetchAktivitasBeneficiary}
                  />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <EditButton onEdit={() => {}} isEditing={true} />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <DetailTable
                    beneficiary={null}
                    editedBeneficiary={editedBeneficiary}
                    isEditing={true}
                    fieldErrors={fieldErrors}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <ImageUpload
                    beneficiary={null}
                    editedBeneficiary={editedBeneficiary}
                    isEditing={true}
                    isNewBeneficiary={isNewBeneficiary}
                    imagePreview={imagePreview}
                    fieldErrors={fieldErrors}
                    fileInputRef={fileInputRef}
                    onImageChange={handleImageChange}
                    onRemoveImage={handleRemoveImage}
                  />
                </div>
              </div>

              <SaveCancelButtons
                saving={saving}
                onSave={handleSaveClick}
                onCancel={handleCancel}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}