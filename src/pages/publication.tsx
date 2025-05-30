"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, BookOpen, Loader2 } from "lucide-react";
import ChooseMethodPublication from "@/components/publication/choosemethodpublication";
import usePublication from "@/hooks/use-publication";
import useResponsive from "@/hooks/use-responsive";
import ErrorState from "@/components/error/error";
import Pagination from "@/components/pagination/pagination";
import FilterPublication from "@/components/publication/filterpublication";
import MobilePublicationCard from "@/components/publication/mobilepublicationcard";
import PublicationTable from "@/components/publication/publicationtable";
import { ConfirmDeleteDialog } from "@/components/dialog/deletedialog";

export default function PublikasiPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobileView } = useResponsive();

  const {
    loading,
    error,
    search,
    setSearch,
    publikasiList,
    pagination,
    currentPage,
    setCurrentPage,
    sortColumn,
    handleSortChange,
    
    // Filters
    toneFilters,
    toggleToneFilter,
    mediaFilters,
    setMediaFilters,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    prValueMin,
    setPrValueMin,
    prValueMax,
    setPrValueMax,
    filterOptions,
    filterOpen,
    setFilterOpen,
    clearAllFilters,
    
    // Delete dialog
    showDeleteDialog,
    setShowDeleteDialog,
    selectedPublication,
    
    // Actions
    handleSharePublication,
    handleDeletePublication,
    handleDeleteClick,
    handleNavigate,
    refreshData,
  } = usePublication();

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Publikasi"
        Icon={BookOpen}
      />
    );
  }

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Publikasi</h2>
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

            <FilterPublication
              open={filterOpen}
              onOpenChange={setFilterOpen}
              toneFilters={toneFilters}
              onToggleToneFilter={toggleToneFilter}
              mediaFilters={mediaFilters}
              onMediaFiltersChange={setMediaFilters}
              dateFrom={dateFrom}
              onDateFromChange={setDateFrom}
              dateTo={dateTo}
              onDateToChange={setDateTo}
              prValueMin={prValueMin}
              onPrValueMinChange={setPrValueMin}
              prValueMax={prValueMax}
              onPrValueMaxChange={setPrValueMax}
              filterOptions={filterOptions}
              onClearFilters={clearAllFilters}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              Tambah Publikasi
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
          </div>
        ) : publikasiList.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">No publications found</p>
            {(toneFilters.length > 0 || search || mediaFilters.length > 0 || dateFrom || dateTo || prValueMin !== undefined || prValueMax !== undefined) && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        ) : isMobileView ? (
          <div className="space-y-4">
            {publikasiList.map((item) => (
              <MobilePublicationCard
                key={item.id}
                item={item}
                onNavigate={handleNavigate}
                onShare={handleSharePublication}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <PublicationTable
            publikasiList={publikasiList}
            loading={loading}
            sortColumn={sortColumn}
            onSortChange={handleSortChange}
            onNavigate={handleNavigate}
            onShare={handleSharePublication}
            onDelete={handleDeleteClick}
          />
        )}

        <ConfirmDeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          selectedItem={selectedPublication}
          itemName="publikasi"
          itemLabelKey="judul"
          onDelete={handleDeletePublication}
          title="Hapus Publikasi"
          descriptionPrefix="Apakah Anda yakin ingin menghapus"
        />

        <Pagination 
          currentPage={currentPage} 
          totalPages={pagination.totalPages} 
          onPageChange={setCurrentPage} 
        />

        <ChooseMethodPublication
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onRefreshData={refreshData}
        />
      </CardContent>
    </Card>
  );
}