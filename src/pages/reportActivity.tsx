"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, FileBarChart, Filter, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";

interface Activity {
  id: string;
  nama_aktivitas: string;
  nama_program: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  biaya_implementasi: number;
  status: string;
  deskripsi: string;
}

const API_URL = import.meta.env.VITE_HOST_NAME;
const STATUS_OPTIONS = ["Belum Mulai", "Berjalan", "Selesai"];

export default function LaporanAktivitas() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [programList, setProgramList] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  const formatRupiah = (amount: number): string => {
    const roundedAmount = Math.floor(amount);
    return roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${API_URL}/api/activity/getactivity/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch activities: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setActivities(data.activity || []);
        } else {
          throw new Error(data.message || "Failed to fetch activities");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Gagal memuat data aktivitas!");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      const uniquePrograms = Array.from(new Set(activities.map(a => a.nama_program))).filter(Boolean);
      setProgramList(uniquePrograms.sort());
    }
  }, [activities]);

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const isDateInRange = (dateString: string) => {
    if (!startDate && !endDate) return true;
    
    const date = new Date(dateString);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && date < start) return false;
    if (end && date > end) return false;
    
    return true;
  };

  const isBudgetInRange = (budget: number) => {
    const min = minBudget ? parseInt(minBudget) : 0;
    const max = maxBudget ? parseInt(maxBudget) : Infinity;
    
    return budget >= min && budget <= max;
  };

  const toggleProgramFilter = (program: string) => {
    setSelectedPrograms(prev => {
      if (prev.includes(program)) {
        return prev.filter(p => p !== program);
      } else {
        return [...prev, program];
      }
    });
  };

  const filteredActivities = activities.filter(activity => {
    const matchesStatus = statusFilters.length === 0 ||
      statusFilters.includes(activity.status);
  
    const matchesDateRange = isDateInRange(activity.tanggal_mulai) || isDateInRange(activity.tanggal_selesai);
    
    const matchesBudget = isBudgetInRange(activity.biaya_implementasi);
    
    const matchesProgram = selectedPrograms.length === 0 || 
      selectedPrograms.includes(activity.nama_program);
  
    return matchesStatus && matchesDateRange && matchesBudget && matchesProgram;
  });

  const getSummary = () => {
    if (filteredActivities.length === 0) return {
      totalActivities: 0,
      totalBudget: 0,
      statusCounts: {},
      dateRange: null
    };

    const totalBudget = filteredActivities.reduce((sum, activity) => 
      sum + Number(activity.biaya_implementasi || 0), 0);

    const statusCounts = filteredActivities.reduce((acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dates = filteredActivities.map(a => new Date(a.tanggal_mulai));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    return {
      totalActivities: filteredActivities.length,
      totalBudget,
      statusCounts,
      dateRange: {
        start: formatDisplayDate(minDate.toISOString()),
        end: formatDisplayDate(maxDate.toISOString())
      }
    };
  };

  const summary = getSummary();

  const exportToExcel = () => {
    if (filteredActivities.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const exportData = filteredActivities.map(activity => ({
      "Nama Aktivitas": activity.nama_aktivitas,
      "Nama Program": activity.nama_program,
      "Tanggal Mulai": formatDisplayDate(activity.tanggal_mulai),
      "Tanggal Selesai": formatDisplayDate(activity.tanggal_selesai),
      "Biaya Implementasi": formatRupiah(Number(activity.biaya_implementasi || 0)),
      "Status": activity.status,
      "Deskripsi": activity.deskripsi
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    const columnWidths = [
      { wch: 30 }, // Nama Aktivitas
      { wch: 25 }, // Nama Program
      { wch: 15 }, // Tanggal Mulai
      { wch: 15 }, // Tanggal Selesai
      { wch: 20 }, // Biaya Implementasi
      { wch: 15 }, // Status
      { wch: 50 }  // Deskripsi
    ];
    
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Aktivitas");

    // Set file name with date range if applied
    let fileName = "Laporan_Aktivitas";
    if (startDate || endDate) {
      const start = startDate ? formatDisplayDate(startDate).replace(/-/g, "") : "Awal";
      const end = endDate ? formatDisplayDate(endDate).replace(/-/g, "") : "Akhir";
      fileName += `_${start}_sampai_${end}`;
    }
    fileName += ".xlsx";

    XLSX.writeFile(workbook, fileName);
    
    toast.success("Data berhasil diekspor ke Excel");
  };

  const handleFilterReset = () => {
    setStatusFilters([]);
    setStartDate("");
    setEndDate("");
    setMinBudget("");
    setMaxBudget("");
    setSelectedPrograms([]);
  };

  if (error) {
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3 md:p-6">
        <CardContent className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#3A786D] text-white"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] h-[calc(100vh-6rem)] overflow-hidden">
      <Card className="p-2 md:p-6 h-full overflow-y-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileBarChart className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
            <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Laporan Aktivitas</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-end">
            <Button
              variant="outline"
              onClick={handleFilterReset}
              className="text-sm"
            >
              Reset Filter
            </Button>
          </div>

          {/* Filter Section*/}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pl-4 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-[#3A786D]" />
                  <h3 className="text-sm font-medium">Rentang Tanggal</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">Tanggal Mulai</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Tanggal Selesai</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Filter */}
            <Card>
              <CardContent className="pl-4 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-[#3A786D]" />
                  <h3 className="text-sm font-medium">Filter Status</h3>
                </div>
                <div className="space-y-2">
                  {STATUS_OPTIONS.map((status) => (
                    <div key={status} className="flex items-center space-x-3">
                      <Checkbox
                        id={`status-${status}`}
                        checked={statusFilters.includes(status)}
                        onCheckedChange={() => toggleStatusFilter(status)}
                      />
                      <Label 
                        htmlFor={`status-${status}`} 
                        className="text-sm"
                      >
                        {status}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Filter */}
            <Card>
              <CardContent className="pl-4 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-4 w-4 text-[#3A786D]">Rp</span>
                  <h3 className="text-sm font-medium">Filter Biaya</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">Minimal</Label>
                    <Input
                      type="number"
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      placeholder="Rp 0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Maksimal</Label>
                    <Input
                      type="number"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      placeholder="Rp 100.000.000"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="pl-4 pr-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-[#3A786D]" />
                <h3 className="text-sm font-medium">Filter Program</h3>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {programList.length > 0 ? (
                  programList.map((program) => (
                    <div key={program} className="flex items-center space-x-3">
                      <Checkbox
                        id={`program-${program}`}
                        checked={selectedPrograms.includes(program)}
                        onCheckedChange={() => toggleProgramFilter(program)}
                      />
                      <Label 
                        htmlFor={`program-${program}`} 
                        className="text-sm truncate"
                      >
                        {program}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Tidak ada program tersedia</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Summary Preview */}
          <Card className="mb-6">
            <CardContent className="pl-4 pr-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium">Ringkasan</h3>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3A786D]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Activities Card */}
                  <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9f5f3] rounded-xl shadow-sm border border-[#e0e7e5] overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Total Aktivitas</p>
                          <h4 className="text-2xl font-bold text-gray-800">{summary.totalActivities}</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Budget Card */}
                  <div className="bg-gradient-to-br from-[#f8f9fa] to-[#eef3f8] rounded-xl shadow-sm border border-[#e0e5e7] overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <p className="text-sm font-medium text-gray-500 mb-1">Total Biaya</p>
                          <h4 className="text-2xl font-bold text-gray-800 break-words">
                            <span className="text-2xl sm:text-xl md:text-2xl">
                              Rp{formatRupiah(summary.totalBudget)}
                            </span>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="bg-gradient-to-br from-[#f8f9fa] to-[#f5f0e9] rounded-xl shadow-sm border border-[#e7e5e0] overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-sm font-medium text-gray-500">Status</p>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(summary.statusCounts).map(([status, count]) => (
                          <div key={status} className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600">{status}</span>
                            <div className="flex items-center">
                              <div
                                className="h-2 rounded-full mr-2"
                                style={{
                                  width: `${Math.min(100, (count / summary.totalActivities) * 100)}px`,
                                  backgroundColor:
                                    status === "Selesai"
                                      ? "#3A786D"
                                      : status === "Dalam Proses"
                                        ? "#2c5282"
                                        : status === "Tertunda"
                                          ? "#825a2c"
                                          : "#718096",
                                }}
                              ></div>
                              <span className="text-xs font-semibold">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Date Range Card */}
                  <div className="bg-gradient-to-br from-[#f8f9fa] to-[#f0e9f5] rounded-xl shadow-sm border border-[#e5e0e7] overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Rentang Tanggal</p>
                          <div className="mt-2">
                            {summary.dateRange ? (
                              <div className="space-y-1">
                                <div className="flex items-center text-xs text-gray-600">
                                  <Calendar className="h-3 w-3 mr-1 text-[#5a2c82]" />
                                  <span>Mulai: {summary.dateRange.start}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-600">
                                  <Calendar className="h-3 w-3 mr-1 text-[#5a2c82]" />
                                  <span>Selesai: {summary.dateRange.end}</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm font-medium text-gray-700">Semua periode</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Section */}
          <div className="flex justify-center">
            <Button
              onClick={exportToExcel}
              disabled={filteredActivities.length === 0 || loading}
              className="bg-[#3A786D] text-white px-8 py-3 gap-2"
            >
              <Download className="h-5 w-5" />
              Export ke Excel ({summary.totalActivities} aktivitas)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}