"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"
import { EditorApprovalTab } from "@/components/admin/editor-approval-tab"
import { MasjidManagementTab } from "@/components/admin/masjid-management-tab"

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("approval")
  const [pendingCount, setPendingCount] = useState(0)
  const [masjidCount, setMasjidCount] = useState(0)

  return (
    <Card className="mx-auto mt-6 max-w-[95%] p-6">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl font-medium text-[var(--blue)]">Admin Dashboard</h2>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="approval" value={currentTab} onValueChange={setCurrentTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="approval" className="relative">
              Persetujuan Editor
              <Badge className="ml-2 bg-amber-500" id="pending-count">
                {pendingCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="masjid">
              Manajemen Masjid
              <Badge className="ml-2 bg-blue-500" id="masjid-count">
                {masjidCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Editor Approval Tab Content */}
          <TabsContent value="approval" className="space-y-4">
            <EditorApprovalTab onCountChange={setPendingCount} />
          </TabsContent>

          {/* Masjid Management Tab Content */}
          <TabsContent value="masjid" className="space-y-4">
            <MasjidManagementTab onCountChange={setMasjidCount} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
