import { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "@/components/dashboard/dashboardheader";
import Overview from "@/components/dashboard/overview";
import BudgetTopPrograms from "@/components/dashboard/budgettopprograms";
import NewsPublication from "@/components/dashboard/newspublication";
import mapImage from "@/assets/map.svg";
import TrainingInsights from "@/components/dashboard/traininginsights";
import { toast } from "react-toastify";

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [, setCurrentMasjidId] = useState<string | null>(null);
    
    useEffect(() => {
        if (localStorage.getItem("showSuccessLoginToast") === "true") {
            setTimeout(() => {
                localStorage.removeItem("showSuccessLoginToast");
                toast.success("Login berhasil!");
            }, 100);
        }
        
        const masjidId = localStorage.getItem("currentMasjidId");
        if (masjidId) {
            setCurrentMasjidId(masjidId);
            
            axios.get(`/api/access/check/viewer/${masjidId}`)
                .then(response => {
                    if (!response.data.hasAccess) {
                        setErrorMessage("Anda tidak memiliki akses ke dashboard ini");
                        toast.error("Akses ditolak");
                    }
                })
                .catch(error => {
                    console.error("Error checking access:", error);
                    toast.error("Terjadi kesalahan saat memeriksa akses");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{errorMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative p-3 md:p-6 bg-gradient-to-b from-[#96D4E7] to-[#EEEEEE] min-h-screen">
            <div
                className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-top bg-cover z-0"
                style={{
                    backgroundImage: `url(${mapImage})`,
                    WebkitMaskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                    maskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                }}
            ></div>

            <div className="relative z-1 w-full max-w-[95%] md:max-w-[95%] mx-auto">
                <div className="w-full">
                    <DashboardHeader />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-4 md:gap-6 mt-4 md:mt-6 w-full">
                    <div className="w-full lg:max-w-[500px]">
                        <Overview />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
                        <div className="w-full">
                            <div className="max-w-[500px] mx-auto lg:mx-0 h-full">
                                <BudgetTopPrograms className="h-full" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                            <div className="w-full">
                                <NewsPublication />
                            </div>
                            <div className="w-full">
                                <TrainingInsights />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;