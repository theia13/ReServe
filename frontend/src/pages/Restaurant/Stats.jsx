import { LuHeart } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuTrendingUp } from "react-icons/lu";
import StatCard from "./StatCard";

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={<LuHeart className="text-[#F07167]" size={28} />}
        title="Total Donations"
        value="258"
        className="bg-white shadow-sm"
      />
      <StatCard
        icon={<LuUsers className="text-[#F07167]" size={28} />}
        title="NGO Partners"
        value="24"
        className="bg-white shadow-sm"
      />
      <StatCard
        icon={<LuTrendingUp className="text-[#F07167]" size={28} />}
        title="Impact Score"
        value="94.6"
        className="bg-white shadow-sm"
      />
    </div>
  );
}
