"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Download, Filter, Calendar, FileBarChart } from "lucide-react";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface Program {
  id: string;
  nama_program: string;
  pilar_program: string[];
  waktu_mulai: string;
  waktu_selesai: string;
  rancangan_anggaran: number;
  aktualisasi_anggaran: number;
  status_program: "Belum Mulai" | "Berjalan" | "Selesai";
}

const API_URL = import.meta.env.VITE_HOST_NAME;
const STATUS_OPTIONS = ["Belum Mulai", "Berjalan", "Selesai"];
const STATUS_COLORS: Record<string, string> = {
  Berjalan: "#ECA72C",
  Selesai: "#3A786D",
  "Belum Mulai": "#6B7280",
};

export default function LaporanProgram() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [minPlanned, setMinPlanned] = useState("");
  const [maxPlanned, setMaxPlanned] = useState("");

  const formatRupiah = (amt: number) =>
    Math.floor(amt)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const fmtDate = (s: string) => {
    const d = new Date(s);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No auth token");
        const qs = new URLSearchParams();
        if (startDate) qs.set("waktu_mulai_gte", startDate);
        if (endDate) qs.set("waktu_selesai_lte", endDate);
        if (statusFilters.length) qs.set("status", statusFilters.join(","));
        const res = await fetch(`${API_URL}/api/program?${qs}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(res.statusText);
        const { data } = await res.json();
        setPrograms(
          (data || []).map((p: any) => ({
            ...p,
            rancangan_anggaran: Number(p.rancangan_anggaran) || 0,
            aktualisasi_anggaran: Number(p.aktualisasi_anggaran) || 0,
          }))
        );
      } catch (e: any) {
        setError(e.message);
        toast.error("Gagal memuat data program!");
      } finally {
        setLoading(false);
      }
    })();
  }, [startDate, endDate, statusFilters]);

  const toggleStatus = (s: string) =>
    setStatusFilters((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  const inDateRange = (d: string) => {
    if (!startDate && !endDate) return true;
    const dd = new Date(d);
    if (startDate && dd < new Date(startDate)) return false;
    if (endDate && dd > new Date(endDate)) return false;
    return true;
  };
  const inBudgetRange = (b: number) => {
    const min = minPlanned ? +minPlanned : 0;
    const max = maxPlanned ? +maxPlanned : Infinity;
    return b >= min && b <= max;
  };

  const filtered = programs.filter(
    (p) =>
      (statusFilters.length === 0 ||
        statusFilters.includes(p.status_program)) &&
      (inDateRange(p.waktu_mulai) || inDateRange(p.waktu_selesai)) &&
      inBudgetRange(p.rancangan_anggaran)
  );

  const summary = (() => {
    const total = filtered.length;
    const sumPlanned = filtered.reduce((s, p) => s + p.rancangan_anggaran, 0);
    const sumActual = filtered.reduce((s, p) => s + p.aktualisasi_anggaran, 0);

    const statusCounts = filtered.reduce<Record<string, number>>((a, p) => {
      a[p.status_program] = (a[p.status_program] || 0) + 1;
      return a;
    }, {});
    const pillarCounts = filtered.reduce<Record<string, number>>((a, p) => {
      p.pilar_program.forEach((pl) => {
        a[pl] = (a[pl] || 0) + 1;
      });
      return a;
    }, {});

    const durations = filtered
      .map((p) => {
        const a = new Date(p.waktu_mulai),
          b = new Date(p.waktu_selesai);
        return (b.getTime() - a.getTime()) / 86400000;
      })
      .filter((d) => !isNaN(d));
    const avgDur = durations.length
      ? durations.reduce((s, d) => s + d, 0) / durations.length
      : 0;

    const avgPlannedPer = total ? sumPlanned / total : 0;
    const avgActualPer = total ? sumActual / total : 0;
    const util = sumPlanned ? (sumActual / sumPlanned) * 100 : 0;

    const dates = filtered.map((p) => new Date(p.waktu_mulai));
    const minD = dates.length
      ? new Date(Math.min(...dates.map((d) => d.getTime())))
      : null;
    const maxD = dates.length
      ? new Date(Math.max(...dates.map((d) => d.getTime())))
      : null;

    return {
      total,
      sumPlanned,
      sumActual,
      avgPlannedPer,
      avgActualPer,
      statusCounts,
      pillarCounts,
      avgDur: avgDur.toFixed(1),
      util: util.toFixed(1),
      dateRange:
        minD && maxD
          ? {
              start: fmtDate(minD.toISOString()),
              end: fmtDate(maxD.toISOString()),
            }
          : null,
    };
  })();

  const statusChartData = {
    labels: Object.keys(summary.statusCounts),
    datasets: [
      {
        data: Object.values(summary.statusCounts),
        backgroundColor: Object.keys(summary.statusCounts).map(
          (k) => STATUS_COLORS[k]
        ),
      },
    ],
  };
  const barChartData = {
    labels: ["Rancangan", "Aktualisasi"],
    datasets: [
      {
        data: [summary.sumPlanned, summary.sumActual],
        backgroundColor: ["#3A786D", "#2C5282"],
      },
    ],
  };
  const pillarLabels = Object.keys(summary.pillarCounts);
  const pillarData = Object.values(summary.pillarCounts);

  const trendCounts: Record<string, number> = filtered.reduce((a: Record<string, number>, p) => {
    const m = p.waktu_mulai.slice(0, 7);
    a[m] = (a[m] || 0) + 1;
    return a;
  }, {});
  const trendLabels = Object.keys(trendCounts).sort();
  const trendData = trendLabels.map((l) => trendCounts[l]);
  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Program Started",
        data: trendData,
        borderColor: "#3A786D",
        backgroundColor: "#3A786D",
        fill: false,
      },
    ],
  };

  const exportExcel = () => {
    if (!filtered.length) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }
    const rows = filtered.map((p) => ({
      "Nama Program": p.nama_program,
      "W. Mulai": fmtDate(p.waktu_mulai),
      "W. Selesai": fmtDate(p.waktu_selesai),
      "Rancangan (Rp)": formatRupiah(p.rancangan_anggaran),
      "Aktualisasi (Rp)": formatRupiah(p.aktualisasi_anggaran),
      Status: p.status_program,
      Pilar: p.pilar_program.join(", "),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
      { wch: 25 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "LaporanProgram");
    let fn = "Laporan_Program";
    if (startDate || endDate) {
      const s = startDate ? fmtDate(startDate).replace(/-/g, "") : "Awal";
      const e = endDate ? fmtDate(endDate).replace(/-/g, "") : "Akhir";
      fn += `_${s}_sampai_${e}`;
    }
    fn += ".xlsx";
    XLSX.writeFile(wb, fn);
    toast.success("Diekspor ke Excel");
  };

  if (error)
    return (
      <Card className="mx-auto mt-6 max-w-[70rem] p-3">
        <CardContent className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#3A786D] text-white"
          >
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  return (
    <div className="mx-auto mt-4 max-w-[95%] md:max-w-[95%] h-[calc(100vh-6rem)] overflow-hidden">
      <Card className="p-2 md:p-6 h-full overflow-y-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileBarChart className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
            <h2 className="text-lg md:text-xl font-medium text-[var(--blue)]">Laporan Program</h2>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <Card>
              <CardContent className="pl-4 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-[#3A786D]" />
                  <h3 className="text-sm font-medium">Status</h3>
                </div>
                <div className="space-y-2">
                  {STATUS_OPTIONS.map((s) => (
                    <div key={s} className="flex items-center space-x-3">
                      <Checkbox
                        id={`status-${s}`}
                        checked={statusFilters.includes(s)}
                        onCheckedChange={() => toggleStatus(s)}
                      />
                      <Label htmlFor={`status-${s}`} className="text-sm">{s}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pl-4 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-4 w-4 text-[#3A786D]">Rp</span>
                  <h3 className="text-sm font-medium">Rancangan Anggaran</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">Minimal</Label>
                    <Input
                      type="number"
                      value={minPlanned}
                      onChange={(e) => setMinPlanned(e.target.value)}
                      placeholder="Rp 0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Maksimal</Label>
                    <Input
                      type="number"
                      value={maxPlanned}
                      onChange={(e) => setMaxPlanned(e.target.value)}
                      placeholder="Rp 100000000"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
  
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
                  {[
                    {
                      label: "Total Program",
                      value: summary.total,
                      gradient: "bg-gradient-to-br from-[#f8f9fa] to-[#e9f5f3]",
                      border: "border-[#e0e7e5]"
                    },
                    {
                      label: "Total Rancangan",
                      value: `Rp${formatRupiah(summary.sumPlanned)}`,
                      gradient: "bg-gradient-to-br from-[#f8f9fa] to-[#eef3f8]",
                      border: "border-[#e0e5e7]"
                    },
                    {
                      label: "Total Aktualisasi",
                      value: `Rp${formatRupiah(summary.sumActual)}`,
                      gradient: "bg-gradient-to-br from-[#f8f9fa] to-[#e9f5f3]",
                      border: "border-[#e0e7e5]"
                    },
                    {
                      label: "Pemanfaatan Anggaran",
                      value: `${summary.util}%`,
                      gradient: "bg-gradient-to-br from-[#f8f9fa] to-[#f0e9f5]",
                      border: "border-[#e5e0e7]"
                    },
                  ].map(({ label, value, gradient, border }) => (
                    <Card
                      key={label}
                      className={`${gradient} rounded-xl shadow-sm border ${border} overflow-hidden`}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                            <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
  
          {/* Luaran Card */}
          <Card className="mb-6">
            <CardContent className="pl-4 pr-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium">Luaran</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  {
                    label: "Avg Rancangan/Prog",
                    value: `Rp${formatRupiah(summary.avgPlannedPer)}`,
                    gradient: "bg-gradient-to-br from-[#f8f9fa] to-[#eef3f8]",
                    border: "border-[#e0e5e7]"
                  },
                  {
                    label: "Avg Aktualisasi/Prog",
                    value: `Rp${formatRupiah(summary.avgActualPer)}`,
                    gradient: "bg-gradient-to-br from-[#f8f9fa] to-[#f5f0e9]",
                    border: "border-[#e7e5e0]"
                  },
                  {
                    label: "Durasi Rata-rata",
                    value: `${summary.avgDur} hari`,
                    gradient: "bg-gradient-to-br from-[#f8f9fa] to-[#f0e9f5]",
                    border: "border-[#e5e0e7]"
                  },
                ].map(({ label, value, gradient, border }) => (
                  <Card
                    key={label}
                    className={`${gradient} rounded-xl shadow-sm border ${border} overflow-hidden`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                          <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
  
          {/* Visualisasi */}
          <Card className="mb-6">
            <CardContent className="pl-4 pr-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium">Visualisasi</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm ring-1 ring-gray-200">
                  <CardHeader>
                    <h3 className="font-semibold">Distribusi Status</h3>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-64 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      <Pie data={statusChartData} />
                    )}
                  </CardContent>
                </Card>
                <Card className="shadow-sm ring-1 ring-gray-200">
                  <CardHeader>
                    <h3 className="font-semibold">Rancangan vs Aktualisasi</h3>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-64 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      <Bar
                        data={barChartData}
                        options={{
                          scales: { y: { beginAtZero: true } },
                          plugins: { legend: { display: false } },
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
                <Card className="shadow-sm ring-1 ring-gray-200">
                  <CardHeader>
                    <h3 className="font-semibold">Distribusi Pilar</h3>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-64 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      <Bar
                        data={{
                          labels: pillarLabels,
                          datasets: [
                            {
                              label: "Program",
                              data: pillarData,
                              backgroundColor: "#3A786D",
                            },
                          ],
                        }}
                        options={{
                          indexAxis: "y",
                          scales: { x: { beginAtZero: true } },
                          plugins: { legend: { display: false } },
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
                <Card className="shadow-sm ring-1 ring-gray-200">
                  <CardHeader>
                    <h3 className="font-semibold">Program per Bulan</h3>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="h-64 bg-gray-200 animate-pulse rounded" />
                    ) : (
                      <Line
                        data={trendChartData}
                        options={{
                          scales: { y: { beginAtZero: true } },
                          plugins: { legend: { display: false } },
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
  
          {/* Export Section */}
          <div className="flex justify-center">
            <Button
              onClick={exportExcel}
              disabled={loading || summary.total === 0}
              className="bg-[#3A786D] text-white px-8 py-3 gap-2"
            >
              <Download className="h-5 w-5" />
              Export ke Excel ({summary.total})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
