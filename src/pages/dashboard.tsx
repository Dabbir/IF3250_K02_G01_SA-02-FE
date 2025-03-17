import DashboardHeader from "@/components/dashboard/dashboardheader";
import Overview from "@/components/dashboard/overview";
import BudgetTopPrograms from "@/components/dashboard/budgettopprograms";
import NewsPublication from "@/components/dashboard/newspublication";
import Awards from "@/components/dashboard/awards";
import mapImage from "@/assets/map.svg";
import { useEffect } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
    useEffect(() => {
        if (localStorage.getItem("showSuccessToast") === "true") {
            setTimeout(() => {
                localStorage.removeItem("showSuccessToast");
                toast.success("Login berhasil!");
            }, 100);
        }
    }, []);
    return (
        
        <div
            className="relative p-6 bg-gradient-to-b from-[#96D4E7] to-[#EEEEEE]"
        >
            <div
                className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-top bg-cover"
                style={{
                    backgroundImage: `url(${mapImage})`,
                    WebkitMaskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                    maskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                }}
            ></div>

            <div className="relative z-10 max-w-screen-xl mx-auto">
                <DashboardHeader />

                <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-6 mt-6 items-start w-full">
                    <div>
                        <Overview />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start w-full">
                        <div className="w-full max-w-[500px]">
                            <BudgetTopPrograms />
                        </div>

                        <div className="flex flex-col gap-4 w-full max-w-[600px]">
                            <NewsPublication />
                            <Awards />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Dashboard;  