import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

export default function RestaurantDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <MainContent />
    </div>
  );
}
