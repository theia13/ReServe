import { LuBell } from "react-icons/lu";
import { IoAdd } from "react-icons/io5";
import Stats from "./Stats";
import Donations from "./Donations";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../components/ui/dialog.jsx";
import NewDonationForm from "./NewDonationForm";

export default function MainContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className="md:pl-72 w-full min-h-screen bg-[#f5f8fb]">
      <header className="h-16 bg-white  flex justify-end items-center pr-14 shadow-sm">
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative">
          <LuBell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#F07167] rounded-full"></span>
        </button>
      </header>

      <div className="flex justify-between items-center px-12 py-6">
        <div>
          <p className="text-[#6b7280]">Welcome back,</p>
          <h1 className=" text-xl lg:text-2xl text-[#020817] font-bold">
            The Brewery
          </h1>
        </div>
        <button
          className="bg-[#F07167] hover:bg-[#d26159]  text-white px-4 py-2 rounded-md transition-colors flex items-center text-md "
          onClick={() => setIsDialogOpen(true)}
        >
          <IoAdd size={20} className="mr-2" />
          New Donation
        </button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Donation</DialogTitle>
            </DialogHeader>
            <NewDonationForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-12 py-4">
        <Stats />
      </div>

      <div className="px-12 py-4">
        <Donations />
      </div>
    </div>
  );
}
