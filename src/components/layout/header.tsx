import { Menu, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function Header() {
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            localStorage.setItem("showSuccessLogoutToast", "true");
            if (!token) {
                console.error("Token tidak ditemukan");
                return;
            }

            const response = await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error(`Logout gagal: ${response.statusText}`);
            }

            localStorage.removeItem("token");
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout gagal:", error);
        }
    };

    return (
        <>
            <header className="fixed z-10 flex h-16 w-full items-center justify-between border-b px-4 bg-white">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="text-slate-600">
                        <Menu className="h-5 w-5" />
                    </SidebarTrigger>
                </div>
                <div className="fixed right-9 flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-slate-600 hover:bg-gray-100"
                        onClick={handleLogout}
                    >
                        <span className="text-text-xs md:text-sm hidden sm:inline">Keluar</span>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>
        </>
    );
}
