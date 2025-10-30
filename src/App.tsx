import Dashboard from "./pages/DashboardPage/Dashboard";
import Login from "./pages/Login Page/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path ="/dashboard" element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
