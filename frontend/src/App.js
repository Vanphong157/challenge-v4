import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLogin } from "./pages/AdminLogin";
import UserLogin from "./pages/UserLogin";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<AdminLogin />}></Route>
          <Route path="/login" element={<UserLogin />}></Route>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
