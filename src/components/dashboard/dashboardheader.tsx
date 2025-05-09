import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, Filter, ChevronDown } from "lucide-react";

interface DashboardHeaderProps {
  masjidId?: string | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ masjidId }) => {
  const [masjidName, setMasjidName] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleString("id-ID"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  
  useEffect(() => {
    if (masjidId) {
      axios.get(`/api/masjid/${masjidId}`)
        .then(response => {
          setMasjidName(response.data.name);
        })
        .catch(error => {
          console.error("Error fetching masjid details:", error);
        });
    }
    
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.get(`/api/users/${userId}`)
        .then(response => {
          const registrationDate = new Date(response.data.registrationDate);
          setStartDate(registrationDate);
          
          updateDateRangeDisplay(registrationDate, new Date());
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          setStartDate(oneYearAgo);
          updateDateRangeDisplay(oneYearAgo, new Date());
        });
    } else {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      setStartDate(oneYearAgo);
      updateDateRangeDisplay(oneYearAgo, new Date());
    }
    
    setLastRefresh(new Date().toLocaleString("id-ID"));
  }, [masjidId]);

  const formatDateToMonthYear = (date: Date): string => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const updateDateRangeDisplay = (start: Date, end: Date) => {
    const formattedStart = formatDateToMonthYear(start);
    const formattedEnd = formatDateToMonthYear(end);
    setDateRange(`${formattedStart} - ${formattedEnd}`);
  };

  const handleFilterClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const applyDateFilter = (newStartDate: Date, newEndDate: Date) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    updateDateRangeDisplay(newStartDate, newEndDate);
    setShowDatePicker(false);
  };


  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-3 md:p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-grow">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
              Dashboard {masjidName && `- ${masjidName}`}
            </h2>
            <div className="flex items-center mt-1 text-xs md:text-sm">
              <span className="text-gray-500">Home</span>
              <ChevronDown className="w-3 h-3 mx-1 rotate-[-90deg] text-gray-400" />
              <span className="text-[#3A786D] font-medium">Dashboard</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 flex-grow sm:flex-grow-0">
              <div className="flex items-center gap-2 text-[#3A786D] font-medium">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{dateRange}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500 mt-0.5">
                <RefreshCw className="w-3 h-3" />
                <span>Terakhir diperbarui: {lastRefresh}</span>
              </div>
            </div>

            <div className="relative">
              <Button
                className="bg-[#3A786D] hover:bg-[#2f6258] text-white flex items-center gap-2 text-xs md:text-sm py-2 px-3 w-full sm:w-auto"
                onClick={handleFilterClick}
              >
                <Filter className="w-4 h-4" />
                <span>Filter Data</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  showDatePicker ? 'rotate-180' : ''
                }`} />
              </Button>
              
              {showDatePicker && (
                <div className="absolute right-0 mt-2 p-4 bg-white shadow-lg rounded-lg border border-gray-200 z-50 w-full sm:w-80">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Pilih Rentang Tanggal</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Tanggal Mulai
                    </label>
                    <input 
                      type="month" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A786D] focus:border-transparent"
                      value={startDate ? format(startDate, "yyyy-MM") : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          const newDate = new Date(e.target.value);
                          setStartDate(newDate);
                        }
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Tanggal Akhir
                    </label>
                    <input 
                      type="month" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A786D] focus:border-transparent"
                      value={endDate ? format(endDate, "yyyy-MM") : ""}
                      onChange={(e) => {
                        if (e.target.value) {
                          const newDate = new Date(e.target.value);
                          setEndDate(newDate);
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      className="text-sm px-4 py-2"
                      onClick={() => setShowDatePicker(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      className="bg-[#3A786D] hover:bg-[#2f6258] text-white text-sm px-4 py-2"
                      onClick={() => {
                        if (startDate && endDate) {
                          applyDateFilter(startDate, endDate);
                        }
                      }}
                    >
                      Terapkan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardHeader;