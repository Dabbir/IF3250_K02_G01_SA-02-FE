import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/login";
import Register from "@/pages/register";
import RegisterDataDiri from "@/pages/register-datadiri";
import WaitVerification from "@/pages/menunggu-verifikasi";
import ManajemenAkun from "@/pages/manajemenakun";
import Layout from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard.tsx";
import AuthCallback from "@/pages/AuthCallback";
import Publikasi from "@/pages/publikasi.tsx";
import Kegiatan from "@/pages/activity.tsx";
import {UnauthenticatedProtectedRoute, AuthenticatedProtectedRoute} from "../utils/auth.tsx"
import DetailKegiatan from "@/pages/detailactivity.tsx";
import Program from "@/pages/program.tsx";
import DetailProgram from "@/pages/detail-program.tsx";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route 
        path="/register-datadiri" 
        element={ 
        <AuthenticatedProtectedRoute>
          <RegisterDataDiri />
        </AuthenticatedProtectedRoute>} 
      />

      <Route 
        path="/wait-verification" 
        element={ 
        <AuthenticatedProtectedRoute>
          <WaitVerification />
        </AuthenticatedProtectedRoute>}
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
        <Route path="/akun-manajemen" element={<ManajemenAkun />} />
        <Route path="/data-program" element={<Program/>} />
        <Route path="/data-program/:id" element={<DetailProgram />} />
        <Route path="/publikasi" element={<Publikasi />} />
        <Route path="/kegiatan" element={<Kegiatan />} />
        <Route path="/kegiatan/:id" element={<DetailKegiatan />} />
        <Route path="/stakeholder" element={<div className="p-4">Stakeholder Content</div>} />
        <Route path="/penerima-manfaat" element={<div className="p-4">Penerima Manfaat Content</div>} />
        <Route path="/karyawan" element={<div className="p-4">Karyawan Content</div>} />
        <Route path="/galeri" element={<div className="p-4">Galeri Content</div>} />
        <Route path="/laporan-program" element={<div className="p-4">Laporan Program Content</div>} />
        <Route path="/laporan-kegiatan" element={<div className="p-4">Laporan Kegiatan Content</div>} />
        <Route path="/pelatihan" element={<div className="p-4">Pelatihan Content</div>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;