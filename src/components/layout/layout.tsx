"use client"

import Header from "@/components/layout/header"
import AppSidebar from "@/components/layout/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 bg-gray-50 py-16">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

