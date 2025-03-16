import { Menu, Search, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";

const API_URL = import.meta.env.VITE_HOST_NAME;

export default function Header() {
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
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
            <header className="fixed z-100 flex h-16 w-full items-center justify-between border-b px-4 bg-white">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="text-slate-600">
                        <Menu className="h-5 w-5" />
                    </SidebarTrigger>
                    <div className="relative w-64 md:w-80">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Search" className="pl-9 h-9 bg-gray-100 border-0 rounded-md text-sm" />
                    </div>
                </div>
                <div className="fixed right-9 flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-slate-600 hover:bg-gray-100"
                        onClick={handleLogout}
                    >
                        <span className="text-sm">Keluar</span>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>
        </>
    );
}
