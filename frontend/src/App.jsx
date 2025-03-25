import "./App.css";
import { Routes, Route } from "react-router-dom";

// components
import LandingPage from "./components/Landing/LandingPage";
import LoginPage from "./components/Auth/LoginPage";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import NGODashboard from "./pages/NGO/NGODashboard";
import RestaurantDashboard from "./pages/Restaurant/RestaurantDashboard";

import { Toaster } from "./components/ui/toaster";
import { ToastProvider } from "./components/ui/toast";
function App() {
  return (
    <>
      <ToastProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/ngo-dashboard" element={<NGODashboard />} />
            <Route
              path="/restaurant-dashboard"
              element={<RestaurantDashboard />}
            />
          </Route>
        </Routes>
      </ToastProvider>
    </>
  );
}

export default App;
