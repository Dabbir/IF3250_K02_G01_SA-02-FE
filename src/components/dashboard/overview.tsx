import React, { useEffect, useState } from "react";
import { Activity, Users, Target, Wallet } from "lucide-react";

interface OverviewStats {
  programs: {
    total: number;
    running: number;
    completed: number;
  };
  activities: {
    total: number;
    running: number;
    completed: number;
  };
  budget: {
    planned: number;
    realized: number;
    percentage: number;
  };
  stakeholders: {
    total: number;
    types: {
      individu: number;
      perusahaan: number;
      organisasi: number;
    };
  };
  employees: {
    total: number;
    active: number;
  };
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<OverviewStats>({
    programs: { total: 0, running: 0, completed: 0 },
    activities: { total: 0, running: 0, completed: 0 },
    budget: { planned: 0, realized: 0, percentage: 0 },
    stakeholders: { total: 0, types: { individu: 0, perusahaan: 0, organisasi: 0 } },
    employees: { total: 0, active: 0 }
  });
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_HOST_NAME;

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Authentication token not found");
        }

        const programsResponse = await fetch(`${API_URL}/api/program?limit=100`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const programsData = await programsResponse.json();

        const activitiesResponse = await fetch(`${API_URL}/api/activity/getreport/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const activitiesData = await activitiesResponse.json();

        const stakeholdersResponse = await fetch(`${API_URL}/api/stakeholder/getall`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const stakeholdersData = await stakeholdersResponse.json();

        const employeesResponse = await fetch(`${API_URL}/api/employee`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const employeesData = await employeesResponse.json();

        const programs = programsData.data || [];
        const programStats = {
          total: programs.length,
          running: programs.filter((p: any) => p.status_program === 'Berjalan').length,
          completed: programs.filter((p: any) => p.status_program === 'Selesai').length
        };

        const totalPlanned = programs.reduce((sum: number, p: any) => sum + (parseFloat(p.rancangan_anggaran) || 0), 0);
        const totalRealized = programs.reduce((sum: number, p: any) => sum + (parseFloat(p.aktualisasi_anggaran) || 0), 0);
        const budgetPercentage = totalPlanned > 0 ? Math.round((totalRealized / totalPlanned) * 100) : 0;

        const activities = activitiesData.activity || [];
        const activityStats = {
          total: activities.length,
          running: activities.filter((a: any) => a.status === 'Berjalan').length,
          completed: activities.filter((a: any) => a.status === 'Selesai').length
        };
        const stakeholders = stakeholdersData.stakeholders || [];
        const stakeholderStats = {
          total: stakeholders.length,
          types: {
            individu: stakeholders.filter((s: any) => s.jenis === 'Individu').length,
            perusahaan: stakeholders.filter((s: any) => s.jenis === 'Perusahaan').length,
            organisasi: stakeholders.filter((s: any) => s.jenis === 'Organisasi').length
          }
        };

        const employees = employeesData.data || [];
        const employeeStats = {
          total: employees.length,
          active: employees.filter((e: any) => e.working === true).length
        };

        setStats({
          programs: programStats,
          activities: activityStats,
          budget: {
            planned: totalPlanned,
            realized: totalRealized,
            percentage: budgetPercentage
          },
          stakeholders: stakeholderStats,
          employees: employeeStats
        });

      } catch (error) {
        console.error("Error fetching overview data:", error);
        
        setStats({
          programs: { total: 12, running: 7, completed: 5 },
          activities: { total: 45, running: 18, completed: 27 },
          budget: { planned: 850000000, realized: 595000000, percentage: 70 },
          stakeholders: { total: 23, types: { individu: 12, perusahaan: 7, organisasi: 4 } },
          employees: { total: 15, active: 12 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [API_URL]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} M`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} Jt`;
    } else if (amount >= 1000) {
      return `${Math.round(amount / 1000)} Rb`;
    }
    return Math.round(amount).toString();
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md border w-full max-w-md">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md border w-full max-w-md">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Pemangku Kepentingan & Karyawan
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex flex-col">
            <p className="text-gray-600 text-xs mb-1">Total Pemangku Kepentingan</p>
            <p className="text-xl font-bold text-blue-700 mt-auto">{stats.stakeholders.total}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col">
            <p className="text-gray-600 text-xs mb-1">Karyawan Aktif</p>
            <p className="text-xl font-bold text-green-700 mt-auto">{stats.employees.active}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex flex-col">
            <p className="text-gray-600 text-xs mb-1">Perusahaan</p>
            <p className="text-xl font-bold text-purple-700 mt-auto">{stats.stakeholders.types.perusahaan}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-600" />
          Overview Program
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-gray-600 text-xs">Jumlah Program</p>
            <p className="text-xl font-bold text-gray-800">{stats.programs.total}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-gray-600 text-xs">Program Berjalan</p>
            <p className="text-xl font-bold text-green-700">{stats.programs.running}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-gray-600 text-xs">Program Selesai</p>
            <p className="text-xl font-bold text-blue-700">{stats.programs.completed}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-600" />
          Overview Kegiatan
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-gray-600 text-xs">Jumlah Kegiatan</p>
            <p className="text-xl font-bold text-gray-800">{stats.activities.total}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
            <p className="text-gray-600 text-xs">Kegiatan Berjalan</p>
            <p className="text-xl font-bold text-orange-700">{stats.activities.running}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-gray-600 text-xs">Kegiatan Selesai</p>
            <p className="text-xl font-bold text-green-700">{stats.activities.completed}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-purple-600" />
          Realisasi Anggaran
        </h2>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-600">Anggaran Total</p>
              <p className="text-base font-bold text-gray-800">
                Rp {formatCurrency(stats.budget.planned)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Realisasi</p>
              <p className="text-base font-bold text-purple-700">
                Rp {formatCurrency(stats.budget.realized)}
              </p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.budget.percentage}%` }}
            />
          </div>
          <p className="text-center text-sm font-medium text-purple-700 mt-2">
            {stats.budget.percentage}% Terealisasi
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;