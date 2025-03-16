import Login from "@/pages/login";
import Register from "@/pages/register";
import RegisterDataDiri from "@/pages/register-datadiri";
import WaitVerification from "@/pages/menunggu-verifikasi";
import { BrowserRouter, Route, Routes } from "react-router-dom";


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/register-datadiri" element={<RegisterDataDiri />}></Route>
      <Route path="/wait-verification" element={<WaitVerification />}/>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
