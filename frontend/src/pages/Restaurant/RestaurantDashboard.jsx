import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import NewDonationForm from "./NewDonationForm";

export default function RestaurantDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <MainContent />
      <NewDonationForm />
    </div>
  );
}
