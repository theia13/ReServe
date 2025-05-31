import { Routes, Route } from "react-router-dom";
import NGOSidebar from "./NGOSidebar";
import NGOMainContent from "./NGOMainContent";
import NGOHistory from "./NGOHistory";
import NGOSettings from "./NGOSettings";

export default function NGODashboard() {
  return (
    <div className="flex">
      <NGOSidebar />
      <Routes>
        <Route path="/" element={<NGOMainContent />} />
        <Route path="/history" element={<NGOHistory />} />
        <Route path="/settings" element={<NGOSettings />} />
      </Routes>
    </div>
  );
}
