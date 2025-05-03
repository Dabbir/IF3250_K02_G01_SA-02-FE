"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Leaf, Search, Download } from "lucide-react"

// Components
import LoadingState from "@/components/loading/loading"
import ErrorState from "@/components/error/error"
import DeleteDialog from "@/components/dialog/deletedialog"
import Pagination from "@/components/pagination/pagination"
import MobileActivityCard from "@/components/activity/mobileactivitycard"
import ActivitiesList from "@/components/activity/activitieslist"
import FilterActivity from "@/components/activity/filteractivity"
import ChooseMethod from "@/components/activity/choosemethod"

// Hooks and Utils
import useResponsive from "@/hooks/use-responsive"
import useActivity from "@/hooks/use-activity"
import { exportActivitiesToXlsx } from "@/utils/exportactivity"

export default function KegiatanPage() {
  // State and Hooks
  const {
    loading,
    error,
    search,
    setSearch,
    filterOpen,
    setFilterOpen,
    statusFilters,
    toggleStatusFilter,
    clearStatusFilters,
    activities,
    filteredActivities,
    clearAllFilters,
    displayedActivities,
    handleNavigate,
    handleShareActivity,
    handleDeleteClick,
    sortColumn,
    handleSortChange,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedActivity,
    handleDeleteActivity,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useActivity()

  const [isOpen, setIsOpen] = useState(false)
  const { isMobileView } = useResponsive()

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Leaf className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Kegiatan</h2>
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

            <FilterActivity
              open={filterOpen}
              onOpenChange={setFilterOpen}
              statusFilters={statusFilters}
              onToggleFilter={toggleStatusFilter}
              onClearFilters={clearStatusFilters}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            {/* Export Button */}
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center justify-center gap-1"
              onClick={() => exportActivitiesToXlsx(activities)}
            >
              <Download className="h-4 w-4" />
              Unduh Kegiatan
            </Button>

            {/* Add Kegiatan Button */}
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              Tambah Kegiatan
            </Button>
          </div>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No activities found</p>
            {(statusFilters.length > 0 || search) && (
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
            {displayedActivities.map((item) => (
              <MobileActivityCard
                key={item.id}
                item={item}
                onNavigate={handleNavigate}
                onShare={handleShareActivity}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          // Desktop table view
          <ActivitiesList
            activities={displayedActivities}
            sortColumn={sortColumn}
            onSortChange={handleSortChange}
            onNavigate={handleNavigate}
            onShare={handleShareActivity}
            onDelete={handleDeleteClick}
          />
        )}

        <DeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          selectedActivity={selectedActivity}
          onDelete={handleDeleteActivity}
        />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        <ChooseMethod isOpen={isOpen} setIsOpen={setIsOpen} />
      </CardContent>
    </Card>
  )
}
