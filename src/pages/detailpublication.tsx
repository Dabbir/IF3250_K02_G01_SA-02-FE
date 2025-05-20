"use client";

import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

// Components
import LoadingState from "@/components/loading/loading";
import ErrorState from "@/components/error/error";
import DetailHeader from "@/components/shared/detailheader";
import EditButton from "@/components/shared/editbutton";
import SaveCancelButtons from "@/components/shared/savecancelbutton";
import DetailTable from "@/components/publication/detailtable";
import MobileDetailSection from "@/components/publication/mobiledetailsection";

// Hooks
import useDetailPublication from "@/hooks/use-detailpublication";

export default function DetailPublikasi() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
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
    handleEditClick,
    handleChange,
    handleSaveClick,
    handleCancel,
  } = useDetailPublication(id);

  const handleGoBack = () => {
    navigate("/publikasi");
  };

  const handleProgramSelect = (value: string) => {
    const selectedProgram = programList.find(p => p.id === value);
    if (editedPublikasi) {
      handleChange("program_id", value);
      handleChange("nama_program", selectedProgram?.nama_program || "");
    }
  };

  const handleActivitySelect = (value: string) => {
    const selectedActivity = aktivitasList.find(a => a.id === value);
    if (editedPublikasi) {
      handleChange("aktivitas_id", value);
      handleChange("nama_aktivitas", selectedActivity?.nama_aktivitas || "");
    }
  };

  if (loading) {
    return <LoadingState title="Detail Publikasi" onGoBack={handleGoBack} Icon={BookOpen} />;
  }

  if (error || !publikasi) {
    return (
      <ErrorState
        error={error || "Publikasi tidak ditemukan"}
        title="Detail Publikasi"
        onGoBack={handleGoBack}
        Icon={BookOpen}
      />
    );
  }

  return (
    <div className="m-2 md:m-5">
      <Card className="w-full min-h-[500px] h-auto py-4 sm:py-7 px-3 sm:p-5 mx-auto border-0 shadow-inner overflow-wrap">
        <DetailHeader
          title="Detail Publikasi"
          createdAt={publikasi?.created_at ?? null}
          updatedAt={publikasi?.updated_at ?? null}
          onGoBack={handleGoBack}
          Icon={BookOpen}
        />

        <CardContent className="pb-6 px-2 sm:px-6">
          <div className="space-y-4">
            <h1 className="text-lg sm:text-xl font-bold break-words">{publikasi.judul}</h1>

            <EditButton onEdit={handleEditClick} isEditing={isEditing} />

            <MobileDetailSection
              publikasi={publikasi}
              editedPublikasi={editedPublikasi}
              isEditing={isEditing}
              programList={programList}
              aktivitasList={aktivitasList}
              prValueDisplay={prValueDisplay}
              validationErrors={validationErrors}
              onChange={handleChange}
              onProgramSelect={handleProgramSelect}
              onActivitySelect={handleActivitySelect}
            />

            <div className="hidden md:block">
              <DetailTable
                publikasi={publikasi}
                editedPublikasi={editedPublikasi}
                isEditing={isEditing}
                programList={programList}
                aktivitasList={aktivitasList}
                prValueDisplay={prValueDisplay}
                validationErrors={validationErrors}
                onChange={handleChange}
                onProgramSelect={handleProgramSelect}
                onActivitySelect={handleActivitySelect}
              />
            </div>

            {isEditing && (
              <SaveCancelButtons
                saving={saving}
                onSave={handleSaveClick}
                onCancel={handleCancel}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}