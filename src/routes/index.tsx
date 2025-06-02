import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/login";
import Register from "@/pages/register";
import RegisterDataDiri from "@/pages/register-datadiri";
import WaitVerification from "@/pages/menunggu-verifikasi";
import ManajemenAkun from "@/pages/accountmanagement.tsx";
import Layout from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard.tsx";
import AuthCallback from "@/pages/AuthCallback";
import GoogleCallback from "@/pages/googlecallback.tsx";
import Publikasi from "@/pages/publication.tsx";
import Kegiatan from "@/pages/activity.tsx";
import { UnauthenticatedProtectedRoute, AuthenticatedProtectedRoute } from "../utils/auth.tsx"
import DetailKegiatan from "@/pages/detailactivity.tsx";
import Program from "@/pages/program.tsx";
import DetailProgram from "@/pages/detailprogram.tsx";
import DetailPublikasi from "@/pages/detailpublication.tsx";
import AdminDashboard from "@/pages/admin-dashboard.tsx";
import ViewerAccessManagement from "@/pages/viewer-access.tsx";
import StakeholderPage from "@/pages/stakeholders.tsx";
import Beneficiary from "@/pages/beneficiary";
import DetailBeneficiary from "@/pages/detailbeneficiary";
import DetailStakeholder from "@/pages/detailstakeholder.tsx";
import GalleryPage from "@/pages/galeri.tsx";
import Employee from "@/pages/employee.tsx";
import DetailEmployee from "@/pages/detailemployee.tsx";
import LaporanAktivitas from "@/pages/reportActivity.tsx";
import DetailTraining from "@/pages/detailtraining.tsx";
import PublicTraining from "@/pages/trainingpublic.tsx";
import Training from "@/pages/training.tsx";
import LaporanProgram from "@/pages/reportProgram.tsx";
import TrainingRegistrationTable from "@/pages/trainingregistrationhistory.tsx";

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


      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      
      <Route path="/auth/google/callback" element={<AuthCallback />} />
      
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
        <Route path="/stakeholder" element={<StakeholderPage />} />
        <Route path="/stakeholder/:id" element={<DetailStakeholder />} />
        <Route path="/karyawan" element={<Employee/>} />
        <Route path="/karyawan/:id" element={<DetailEmployee/>} />
        <Route path="/galeri" element={<GalleryPage />} />
        <Route path="/laporan-program" element={<LaporanProgram />} />
        <Route path="/laporan-kegiatan" element={<LaporanAktivitas/>} />
        <Route path="/viewer-access" element={<ViewerAccessManagement />} />
        <Route path="/penerima-manfaat" element={<Beneficiary />} />
        <Route path="/penerima-manfaat/:id" element={<DetailBeneficiary />} />
        <Route path="/publikasi/:id" element={<DetailPublikasi />} />
        <Route path="/pelatihan" element={<Training />} />
        <Route path="/pelatihan/:id" element={<DetailTraining />} />
        <Route path="/pelatihan-umum" element={<PublicTraining />} />
        <Route path="/riwayat-pendaftaran" element={<TrainingRegistrationTable/>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;