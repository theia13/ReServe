import { LuHeart } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuTrendingUp } from "react-icons/lu";
import NGOStatCard from "./NGOStatCard";

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NGOStatCard
        icon={<LuHeart className="text-[#F07167]" size={28} />}
        title="Donations claimed"
        value="165"
        className="bg-white shadow-sm"
      />
      <NGOStatCard
        icon={<LuUsers className="text-[#F07167]" size={28} />}
        title="Restaurant Partners"
        value="17"
        className="bg-white shadow-sm"
      />
      <NGOStatCard
        icon={<LuTrendingUp className="text-[#F07167]" size={28} />}
        title="Meals Served"
        value="1287"
        className="bg-white shadow-sm"
      />
    </div>
  );
}
