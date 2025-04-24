import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/login";
import Register from "@/pages/register";
import RegisterDataDiri from "@/pages/register-datadiri";
import WaitVerification from "@/pages/menunggu-verifikasi";
import ManajemenAkun from "@/pages/manajemenakun";
import Layout from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard.tsx";
import AuthCallback from "@/pages/AuthCallback";
import GoogleCallback from "@/pages/googlecallback.tsx";
import Publikasi from "@/pages/publikasi.tsx";
import Kegiatan from "@/pages/activity.tsx";
import { UnauthenticatedProtectedRoute, AuthenticatedProtectedRoute } from "../utils/auth.tsx"
import DetailKegiatan from "@/pages/detailactivity.tsx";
import Program from "@/pages/program.tsx";
import DetailProgram from "@/pages/detailprogram.tsx";
import DetailPublikasi from "@/pages/detailpublikasi.tsx";
import AdminDashboard from "@/pages/admin-dashboard.tsx";
import ViewerAccessManagement from "@/pages/viewer-access.tsx";
import Beneficiary from "@/pages/beneficiary";
import DetailBeneficiary from "@/pages/detailbeneficiary";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route 
        path="/register-datadiri" 
        element={ 
          <RegisterDataDiri />} 
      />

      <Route 
        path="/wait-verification" 
        element={ 
          <WaitVerification />}
      />

      <Route 
        path="/login" 
        element={ 
        <AuthenticatedProtectedRoute>
          <Login />
        </AuthenticatedProtectedRoute>} 
      />

      <Route 
        path="/register" 
        element={
        <AuthenticatedProtectedRoute>
          <Register />
        </AuthenticatedProtectedRoute>} 
      />


      <Route path="/auth/callback" element={<GoogleCallback />} />
      
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      <Route
        path="/"
        element={
          <UnauthenticatedProtectedRoute>
            <Layout />
          </UnauthenticatedProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-admin" element={<AdminDashboard />} />
        <Route path="/akun-manajemen" element={<ManajemenAkun />} />
        <Route path="/data-program" element={<Program/>} />
        <Route path="/data-program/:id" element={<DetailProgram />} />
        <Route path="/publikasi" element={<Publikasi />} />
        <Route path="/kegiatan" element={<Kegiatan />} />
        <Route path="/kegiatan/:id" element={<DetailKegiatan />} />
        <Route path="/stakeholder" element={<div className="p-4">Stakeholder Content</div>} />
        <Route path="/karyawan" element={<div className="p-4">Karyawan Content</div>} />
        <Route path="/galeri" element={<div className="p-4">Galeri Content</div>} />
        <Route path="/laporan-program" element={<div className="p-4">Laporan Program Content</div>} />
        <Route path="/laporan-kegiatan" element={<div className="p-4">Laporan Kegiatan Content</div>} />
        <Route path="/pelatihan" element={<div className="p-4">Pelatihan Content</div>} />
        <Route path="/viewer-access" element={<ViewerAccessManagement />} />
        <Route path="/penerima-manfaat" element={<Beneficiary />} />
        <Route path="/penerima-manfaat/:id" element={<DetailBeneficiary />} />
        <Route path="/publikasi/:id" element={<DetailPublikasi />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;