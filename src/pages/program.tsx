"use client"

import { Button } from "@/components/ui/button";
import CardProgram from "@/components/ui/card-program";
import {
  Database,
  Loader2,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ChooseMethodProgram from "@/components/program/chooseMethodProgram";
import ProgramSortControls from "@/components/program/programsortcontrol";
import { getStatusBadge } from "@/components/program/programstatusbadge";
import { STATUS_OPTIONS } from "@/types/program";
import useProgram from "@/hooks/use-program";

const Program = () => {
  const {
    search,
    setSearch,
    isOpen, 
    setIsOpen,
    loading,
    setSortBy,
    setSortOrder,
    fetchPrograms,
    filterOpen,
    setFilterOpen,
    sortBy,
    currentPage,
    setCurrentPage,
    totalPrograms,
    sortOrder,
    totalPages,
    programList,
    statusFilters,
    setStatusFilters,
    handleDeleteProgram,
    toggleStatusFilter,
    handleNavigate
  } = useProgram()

  return (
    <Card className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] p-2 md:p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Program</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center space-x-2 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-8 w-64"
            />
          </div>

          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <button
                className="h-8 px-2 flex items-center space-x-1 text-sm border rounded text-gray-700 hover:bg-gray-100"
                aria-label="Filter status"
              >
                <Filter className="w-4 h-4" />
                <span>Filter Status</span>
                <ChevronDown className="w-4 h-4" />
                {statusFilters.length > 0 && (
                  <Badge className="ml-1">{statusFilters.length}</Badge>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-4">
              <h4 className="text-sm mb-2">Pilih Status</h4>
              {STATUS_OPTIONS.map((s) => (
                <div key={s} className="flex items-center mb-1">
                  <Checkbox
                    id={`status-${s}`}
                    checked={statusFilters.includes(s)}
                    onCheckedChange={() => toggleStatusFilter(s)}
                    className="checked:bg-[#3A786D] checked:border-[#3A786D]"
                  />
                  <Label htmlFor={`status-${s}`} className="ml-2">
                    {getStatusBadge(s)}
                  </Label>
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStatusFilters([])}
                  disabled={statusFilters.length === 0}
                  className="border-[#3A786D] text-[#3A786D] hover:bg-[#3A786D] hover:text-white"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={() => setFilterOpen(false)}
                  className="bg-[#3A786D] text-white hover:bg-[var(--blue)]"
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <ProgramSortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={setSortBy}
            onSortOrderToggle={() =>
              setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"))
            }
          />

          <div className="ml-auto flex items-center gap-2">
            <Button
              className="bg-[#3A786D] text-white h-8 px-4 text-sm"
              onClick={() => setIsOpen(true)}
            >
              Tambah Program
            </Button>
            <ChooseMethodProgram
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              onRefresh={() =>
                fetchPrograms(
                  currentPage,
                  search.trim(),
                  sortBy,
                  sortOrder,
                  statusFilters
                )
              }
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
          </div>
        ) : programList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programList.map((program) => (
              <CardProgram
                key={program.id}
                program={program}
                onClick={() =>  handleNavigate(program.id)}
                onDelete={handleDeleteProgram}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-500 mb-2">
              Tidak ada program yang ditemukan
            </p>
            <p className="text-gray-400 text-sm">
              Silakan coba kata kunci pencarian lain atau tambahkan program baru
            </p>
          </div>
        )}

        {!loading && totalPrograms > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-[#3A786D] text-white"
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`${
                  currentPage === i + 1
                    ? "bg-[#3A786D] text-white"
                    : "bg-white text-black border-[#3A786D] border hover:bg-[#3A786D] hover:text-white"
                }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-[#3A786D] text-white"
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Program;
