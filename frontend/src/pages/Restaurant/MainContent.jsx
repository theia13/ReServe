import { LuBell } from "react-icons/lu";
import { IoAdd } from "react-icons/io5";
import Stats from "./Stats";
import { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog.jsx";
import { useDonations } from "../../hooks/useDonations";
import { AuthContext } from "../../context/AuthContext";
import Donations from "./Donations";
import NewDonationForm from "./NewDonationForm";

export default function MainContent() {
  const { user } = useContext(AuthContext);
  const { donations, loading, error, fetchDonations } = useDonations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEditClick = (donation) => {
    setEditData(donation);
    setIsEditing(true);
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    setEditData(null);
    fetchDonations();
  };
  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 60000);
    return () => clearInterval(interval);
  }, [fetchDonations]);

  const handleDonationSuccess = () => {
    fetchDonations();
    setIsDialogOpen(false);
  };

  return (
    <div className="md:pl-72 w-full min-h-screen bg-[#f5f8fb]">
      <header className="h-16 bg-white flex justify-end items-center pr-14 shadow-sm">
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative">
          <LuBell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#F07167] rounded-full"></span>
        </button>
      </header>
      <div className="flex justify-between items-center px-12 py-6">
        <div>
          <p className="text-[#6b7280]">Welcome back,</p>
          <h1 className="text-xl lg:text-2xl text-[#020817] font-bold">
            {user?.name || "The Brewery"}
          </h1>
        </div>
        <div>
          <button
            className="bg-[#F07167] hover:bg-[#d26159] text-white px-2 py-1 lg:px-4 lg:py-2 rounded-md transition-colors flex items-center text-md"
            onClick={() => setIsDialogOpen(true)}
          >
            <IoAdd size={20} className="mr-2" />
            New Donation
          </button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Donation</DialogTitle>
                <DialogDescription>
                  Create a new food donation listing.
                </DialogDescription>
              </DialogHeader>
              <NewDonationForm onSuccess={handleDonationSuccess} />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Donation</DialogTitle>
                <DialogDescription>
                  Make changes to your donation details.
                </DialogDescription>
              </DialogHeader>
              <NewDonationForm
                editData={editData}
                onSuccess={handleEditSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="px-12 py-4">
        <Stats donations={donations} />
      </div>
      <div className="px-12 py-4">
        <Donations
          donations={donations}
          loading={loading}
          onEditClick={handleEditClick}
        />
      </div>
    </div>
  );
}
