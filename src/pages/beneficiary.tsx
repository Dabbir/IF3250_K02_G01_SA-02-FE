"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HandCoins, Download, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { utils, writeFile } from 'xlsx';

// Components
import useBeneficiary from "@/hooks/use-beneficiary";
import ErrorState from "@/components/error/error";
import Pagination from "@/components/pagination/pagination";
import BeneficiaryGrid from "@/components/beneficiary/beneficiarygrid";
import AddBeneficiary from "@/components/beneficiary/addbeneficiary";
import { ConfirmDeleteDialog } from "@/components/dialog/deletedialog";

export default function BeneficiaryPage() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    loading,
    error,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    beneficiaries,
    pagination,
    showDeleteDialog,
    setShowDeleteDialog,
    selectedBeneficiary,
    handleShareBeneficiary,
    handleDeleteBeneficiary,
    handleNavigate,
    handleDeleteClick,
    refreshData,
    clearSearch,
  } = useBeneficiary();

  const exportXlsx = () => {
    if (beneficiaries.length === 0) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }

    const data = beneficiaries.map(beneficiary => ({
      "Nama Instansi": beneficiary.nama_instansi,
      "Nama Kontak": beneficiary.nama_kontak || "",
      "Alamat": beneficiary.alamat || "",
      "Telepon": beneficiary.telepon || "",
      "Email": beneficiary.email || ""
    }));

    const columnWidths = [
      { wch: 30 },
      { wch: 25 },
      { wch: 40 },
      { wch: 20 },
      { wch: 30 }
    ];

    const worksheet = utils.json_to_sheet(data);
    worksheet['!cols'] = columnWidths;

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Penerima Manfaat");

    writeFile(workbook, "Penerima_Manfaat.xlsx");
    toast.success("Data penerima manfaat berhasil diekspor!");
  };

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Penerima Manfaat"
        Icon={HandCoins}
      />
    );
  }

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <HandCoins className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Penerima Manfaat</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 md:items-center">
          <div className="relative flex-grow items-top w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 w-3 h-3 md:w-4 md:h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari nama instansi atau kontak"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 max-md:h-8 max-md:text-[12px]"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2">
            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center justify-center gap-1"
              onClick={exportXlsx}
            >
              <Download className="h-4 w-4" />
              Unduh Penerima Manfaat
            </Button>

            <Button
              className="bg-[#3A786D] text-[14px] text-white w-full md:w-auto flex items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              Tambah Penerima Manfaat
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
          </div>
        ) : beneficiaries.length === 0 ? (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-gray-500">Tidak ada data penerima manfaat</p>
            {search && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSearch}
                >
                  Hapus Filter
                </Button>
              </div>
            )}
          </div>
        ) : (
          <BeneficiaryGrid
            beneficiaries={beneficiaries}
            onNavigate={handleNavigate}
            onShare={handleShareBeneficiary}
            onDelete={handleDeleteClick}
          />
        )}

        <ConfirmDeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          selectedItem={selectedBeneficiary}
          itemName="penerima manfaat"
          itemLabelKey="nama_instansi"
          onDelete={handleDeleteBeneficiary}
          title="Hapus Penerima Manfaat"
          descriptionPrefix="Apakah Anda yakin ingin menghapus penerima manfaat"
        />

        <Pagination 
          currentPage={currentPage} 
          totalPages={pagination.totalPages} 
          onPageChange={setCurrentPage} 
        />

        <AddBeneficiary
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={refreshData}
        />
      </CardContent>
    </Card>
  );
}