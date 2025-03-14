import DashboardHeader from "@/components/dashboardheader";
import Overview from "@/components/overview";
import BudgetTopPrograms from "@/components/budgettopprograms";
import NewsPublication from "@/components/newspublication";
import Awards from "@/components/awards";
import mapImage from "@/assets/map.svg";

const Dashboard = () => {
    return (
        <div
            className="relative p-6 min-h-screen w-full bg-gradient-to-b from-[#96D4E7] to-[#EEEEEE]"
            >
            <div
                className="absolute top-0 left-0 w-full h-[80vh] max-h-[680px] bg-no-repeat bg-top bg-cover"
                style={{
                    backgroundImage: `url(${mapImage})`,
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
                }}
            ></div>

            <div className="relative z-10">
            <DashboardHeader />
    
            <div className="max-w-full grid grid-cols-[auto,1fr] gap-6 mt-6 items-start">
                <div>
                <Overview />
                </div>

                <div className="grid grid-cols-2 gap-[180px] items-start">
                <div className="col-span-1.5 w-[750px]">
                    <BudgetTopPrograms />
                </div>

                <div className="flex flex-col gap-4 w-[600px] items-end">
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