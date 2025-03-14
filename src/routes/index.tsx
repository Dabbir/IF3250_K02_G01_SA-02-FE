import Login from "@/pages/login";
import Register from "@/pages/register";
import { BrowserRouter, Route, Routes } from "react-router-dom";


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
