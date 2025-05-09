"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Search, Users } from "lucide-react"

// Components
import LoadingState from "@/components/loading/loading"
import ErrorState from "@/components/error/error"
import { ConfirmDeleteDialog } from "@/components/dialog/deletedialog"
import Pagination from "@/components/pagination/pagination"
import MobileStakeholderCard from "@/components/stakeholder/mobilestakeholdercard"
import StakeholderTable from "@/components/stakeholder/stakeholdertable"
import FilterStakeholder from "@/components/stakeholder/filterstakeholder"
import AddStakeholderDialog from "@/components/stakeholder/addstakeholder"

// Hooks
import useResponsive from "@/hooks/use-responsive"
import useStakeholders from "@/hooks/use-stakeholder"

// Types
import type { Stakeholder } from "@/types/stakeholder"

export default function StakeholderPage() {
    const navigate = useNavigate()
    const { isMobileView } = useResponsive()
    const [isOpen, setIsOpen] = useState(false)

    const {
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        showDeleteDialog,
        setShowDeleteDialog,
        selectedStakeholder,
        setSelectedStakeholder,
        loading,
        error,
        jenisFilters,
        filterOpen,
        setFilterOpen,
        sortColumn,
        displayedStakeholders,
        totalPages,
        filteredStakeholders,
        handleDeleteStakeholder,
        handleSortChange,
        toggleJenisFilter,
        clearJenisFilters,
        clearAllFilters,
    } = useStakeholders()

    const handleNavigate = (id: string) => {
        navigate(`/stakeholder/${id}`)
    }

    const handleDeleteClick = (stakeholder: Stakeholder) => {
        setSelectedStakeholder(stakeholder)
        setShowDeleteDialog(true)
    }

    if (loading) {
        return <LoadingState
            title="Pemangku Kepentingan"
            Icon={Users}
        />
    }

    if (error) {
        return <ErrorState
            error={error}
            title="Pemangku Kepentingan"
            Icon={Users}
        />
    }

    return (
        <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
            <CardHeader>
                <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
                    <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Pemangku Kepentingan</h2>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 md:items-center">
                    <div className="flex flex-col md:flex-row w-full md:w-2/3 gap-2">
                        <div className="relative flex-grow items-top">
                            <Search className="absolute left-3 top-2.5 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                            <Input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 max-md:h-8 max-md:text-[12px]"
                            />
                        </div>

                        <FilterStakeholder
                            open={filterOpen}
                            onOpenChange={setFilterOpen}
                            jenisFilters={jenisFilters}
                            onToggleFilter={toggleJenisFilter}
                            onClearFilters={clearJenisFilters}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto" onClick={() => setIsOpen(true)}>
                            Tambah Pemangku Kepentingan
                        </Button>
                    </div>
                </div>

                {filteredStakeholders.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                        <p className="text-gray-500">Pemangku kepentingan tidak ditemukan</p>
                        {(jenisFilters.length > 0 || search) && (
                            <div className="mt-2">
                                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                ) : isMobileView ? (
                    // Mobile card view
                    <div className="space-y-4">
                        {displayedStakeholders.map((item) => (
                            <MobileStakeholderCard
                                key={item.id}
                                item={item}
                                onNavigate={handleNavigate}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                ) : (
                    // Desktop table view
                    <StakeholderTable
                        stakeholders={displayedStakeholders}
                        sortColumn={sortColumn}
                        onSortChange={handleSortChange}
                        onNavigate={handleNavigate}
                        onDelete={handleDeleteClick}
                    />
                )}

                <ConfirmDeleteDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    selectedItem={selectedStakeholder}
                    itemName="stakeholder"
                    itemLabelKey="nama_stakeholder"
                    onDelete={handleDeleteStakeholder}
                    title="Hapus Stakeholder"
                    descriptionPrefix="Apakah Anda yakin ingin menghapus stakeholder"
                />

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                <AddStakeholderDialog isOpen={isOpen} setIsOpen={setIsOpen} />
            </CardContent>
        </Card>
    )
}
