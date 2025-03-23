import NGOSidebar from "./NGOSidebar";
import NGOMainContent from "./NGOMainContent";

export default function NGODashboard() {
  return (
    <div className="flex">
      <NGOSidebar />
      <NGOMainContent />
    </div>
  );
}
