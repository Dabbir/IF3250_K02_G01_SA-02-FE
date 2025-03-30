import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"

import Logo from "@/assets/logo.svg"
import LogoTitle from "@/assets/logo-title.svg"
import { dashboard, programs, reportItems, training, viewerAccess } from "@/components/layout/sidebardata.tsx"
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Eye, Home } from "lucide-react";

interface CustomJwtPayload {
    email: string;
    id: number;
    masjid_id: number;
    peran: string;
}

export default function AppSidebar() {
    const { state } = useSidebar();
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token") || "";
        if (token) {
            const userData = jwtDecode<CustomJwtPayload>(token);
            setRole(userData.peran);
        }
    }, []);

    return (
        <Sidebar className="border-r">
            <SidebarHeader className="flex h-16 items-center px-4 bg-white">
                <div className="flex items-center gap-2 pt-3">
                    <div className="flex-shrink-0">
                        <a href="/dashboard" className="block transition-all duration-300 transform hover:scale-110">
                            <img
                                src={state === "collapsed" ? Logo : LogoTitle}
                                alt="Logo"
                                className="h-14 w-auto"
                            />
                        </a>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-white px-3 overflow-hidden">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="pt-5">
                            {role === "Admin" && (
                                <SidebarMenuItem key={dashboard[1].title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === dashboard[1].url}
                                        className={`text-slate-600 hover:bg-gray-100 hover:text-slate-800 ${location.pathname === dashboard[1].url ? "bg-blue-50 text-blue-600" : ""
                                        }`}
                                    >
                                        <a href={dashboard[1].url}>
                                            <Home className="h-5 w-5" />
                                            <span>{dashboard[1].title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {role === "Editor" && (
                                <SidebarMenuItem key={dashboard[0].title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === dashboard[0].url}
                                        className={`text-slate-600 hover:bg-gray-100 hover:text-slate-800 ${location.pathname === dashboard[1].url ? "bg-blue-50 text-blue-600" : ""
                                        }`}
                                    >
                                        <a href={dashboard[0].url}>
                                            <Home className="h-5 w-5" />
                                            <span>{dashboard[0].title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {[...programs].map((item) => {
                                const isActive = location.pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={`text-slate-600 hover:bg-gray-100 hover:text-slate-800 ${isActive ? "bg-blue-50 text-blue-600" : ""
                                                }`}
                                        >
                                            <a href={item.url}>
                                                <item.icon className="h-" />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {[...reportItems].map((item) => {
                                const isActive = location.pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={`text-slate-600 hover:bg-gray-100 hover:text-slate-800 ${isActive ? "bg-blue-50 text-blue-600" : ""
                                                }`}
                                        >
                                            <a href={item.url}>
                                                <item.icon className="h-" />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {[...training].map((item) => {
                                const isActive = location.pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={`text-slate-600 hover:bg-gray-100 hover:text-slate-800 ${isActive ? "bg-blue-50 text-blue-600" : ""
                                                }`}
                                        >
                                            <a href={item.url}>
                                                <item.icon className="h-" />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {[...viewerAccess].map((item) => {
                                const isActive = location.pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={`text-slate-600 hover:bg-gray-100 hover:text-slate-800 ${isActive ? "bg-blue-50 text-blue-600" : ""
                                                }`}
                                        >
                                            <a href={item.url}>
                                                <item.icon className="h-" />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}