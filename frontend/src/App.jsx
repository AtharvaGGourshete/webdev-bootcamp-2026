import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import LogIn from "./pages/LogIn";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/staff/dashboard" element={<StaffDashboard />} />
    </Routes>
  );
}

function App() {
  return(
    <Router>
      <AppContent/>
    </Router>
  )
}

export default App;
