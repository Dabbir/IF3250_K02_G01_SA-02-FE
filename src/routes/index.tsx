import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "@/pages/login";
import Register from "@/pages/register";
import RegisterDataDiri from "@/pages/register-datadiri";
import WaitVerification from "@/pages/menunggu-verifikasi";
import ManajemenAkun from "@/pages/manajemenakun";
import Layout from "@/components/layout/layout";
import Dashboard from "@/pages/dashboard.tsx";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/register-datadiri" element={<RegisterDataDiri />}></Route>
      <Route path="/wait-verification" element={<WaitVerification />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/akun-manajemen" element={<ManajemenAkun />} />
        <Route path="/data-program" element={<div className="p-4">Data Program Content</div>} />
        <Route path="/publikasi" element={<div className="p-4">Publikasi Content</div>} />
        <Route path="/kegiatan" element={<div className="p-4">Kegiatan Content</div>} />
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