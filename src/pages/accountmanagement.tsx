"use client"

import { Pencil, User } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// Components
import ProfileImageSection from "@/components/accountmanagement/profileimage"
import ProfileForm from "@/components/accountmanagement/profileform"
import { EditButton, SaveCancelButtons } from "@/components/shared/actionbutton"

// Hooks
import useUserProfile from "@/hooks/use-accountmanagement"
import LoadingState from "@/components/loading/loading"
import ErrorState from "@/components/error/error"

export default function ManajemenAkun() {
    const {
        isEditing,
        setIsEditing,
        isLoading,
        isSaving,
        userData,
        previewImage,
        showDeleteDialog,
        setShowDeleteDialog,
        shouldDeleteImage,
        errorsForm,
        alasanLength,
        bioLength,
        handleChange,
        handleInputChange,
        handleImageChange,
        handleDeletePhoto,
        handleSubmit,
        handleCancel,
        handleImageUpload,
        handleBlur,
        error,
    } = useUserProfile()

    if (isLoading) {
        return <LoadingState
            title="Manajemen Akun"
            Icon={User}
        />
    }

    if (error) {
        return <ErrorState
            error={error}
            title="Manajemen Akun"
            Icon={User}
        />
    }

    return (
        <div className="m-5">
            <Card className="w-full min-h-[500px] h-auto sm:h-[calc(85vh)] py-7 sm:p-5 mx-auto border-0 shadow-inner overflow-auto">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                        <User className="h-6 w-6 text-slate-700" />
                        <h2 className="text-xl font-medium text-[var(--blue)]">Manajemen Akun</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <ProfileImageSection
                            profileImage={userData.profileImage}
                            previewImage={previewImage}
                            shouldDeleteImage={shouldDeleteImage}
                            isEditing={isEditing}
                            showDeleteDialog={showDeleteDialog}
                            setShowDeleteDialog={setShowDeleteDialog}
                            handleImageUpload={handleImageUpload}
                            handleDeletePhoto={handleDeletePhoto}
                        />

                        <div className="flex flex-col text-center md:text-end space-y-2">
                            <h3 className="text-lg sm:text-xl font-medium text-[var(--blue)]">{userData.namaMasjid}</h3>
                            <p className="text-xs sm:text-sm text-slate-600">{userData.alamatMasjid}</p>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        {!isEditing && (
                            <EditButton
                                onClick={() => setIsEditing(true)}
                                icon={<Pencil className="text-[var(--green)] h-4 w-4 mr-2" />}
                            >
                                Edit
                            </EditButton>
                        )}
                        {isEditing && <div className="h-8 invisible" />}
                    </div>

                    <form onSubmit={handleSubmit} className="mt-4 sm:mt-8 space-y-4 sm:space-y-6">
                        <ProfileForm
                            userData={userData}
                            errors={errorsForm}
                            isEditing={isEditing}
                            alasanLength={alasanLength}
                            bioLength={bioLength}
                            handleChange={handleChange}
                            handleInputChange={handleInputChange}
                            handleBlur={handleBlur}
                        />

                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/jpeg, image/png, image/gif, image/webp, image/svg+xml"
                            className="hidden"
                            onChange={handleImageChange}
                            disabled={!isEditing}
                        />

                        {isEditing && <SaveCancelButtons onCancel={handleCancel} isSaving={isSaving} />}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
