import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";

import { BrowserRouter, Route, Routes } from "react-router-dom";


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;