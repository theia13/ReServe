import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import RestaurantHistory from "./RestaurantHistory";
import RestaurantSettings from "./RestaurantSettings";

export default function RestaurantDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/history" element={<RestaurantHistory />} />
        <Route path="/settings" element={<RestaurantSettings />} />
      </Routes>
    </div>
  );
}
