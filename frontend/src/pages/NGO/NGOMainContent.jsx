import { LuBell } from "react-icons/lu";

import { IoAdd } from "react-icons/io5";
import NGOStats from "./NGOStats";
import NGODonations from "./NGODonations";

export default function NGOMainContent() {
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
            FeedingHands NGO
          </h1>
        </div>
      </div>

      <div className="px-12 py-4">
        <NGOStats />
      </div>

      <div className="px-12 py-4">
        <NGODonations />
      </div>
    </div>
  );
}
