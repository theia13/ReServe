import { Link } from "react-router-dom";
import { LuClock7 } from "react-icons/lu";
import { LuPencilLine } from "react-icons/lu";
import { FaArrowRightLong } from "react-icons/fa6";

import { useMemo } from "react";

import {
  formatDateTime,
  timeLeft,
  timePast,
  isExpired,
} from "../../utils/dateTimeUtils";

export default function Donations({ donations = [], loading = false }) {
  const { activeDonations, pastDonations } = useMemo(() => {
    const active = [];
    const past = [];

    donations.forEach((donation) => {
      const isClaimed = donation.status === "claimed";
      const expired = isExpired(
        donation.expiration_date,
        donation.expiration_time
      );

      if (isClaimed || expired) {
        past.push(donation);
      } else {
        active.push(donation);
      }
    });

    return {
      activeDonations: active,
      pastDonations: past,
    };
  }, [donations]);

  if (loading) {
    return (
      <div>
        <p>Loading donations... </p>
      </div>
    );
  }

  const SectionHeader = ({ title, subtitle, viewAllLink, active = true }) => (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl text-[#020817] font-semibold">{title}</h2>
        {subtitle && <p className="text-md text-gray-500">{subtitle}</p>}
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          className={`flex items-center gap-1 hover:px-4 transition-all ease-in-out duration-100 text-sm font-medium py-1 px-3 rounded-full ${
            active ? "bg-[#F07167] text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          <span className="hidden md:block"> View All </span>
          <FaArrowRightLong size={14} className="md:ml-1" />
        </Link>
      )}
    </div>
  );

  const DonationCard = ({ donation, active = true }) => {
    const capitalizeWords = (str) =>
      str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const displayTime = active
      ? timeLeft(donation.expiration_date, donation.expiration_time)
      : donation.claimed_at
      ? timePast(donation.claimed_at)
      : timePast(donation.expiration_date, donation.expiration_time);

    return (
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden transition-all card-hover animate-slide-up ${
          !active ? "bg-gray-100" : ""
        }`}
      >
        <div
          className={`flex justify-between items-center p-4 text-md ${
            active ? "bg-[#F07167] text-white" : "bg-gray-200 text-black"
          }`}
        >
          <h3 className="font-medium">{capitalizeWords(donation.food_item)}</h3>
          {active && (
            <button className="p-2 rounded-full hover:bg-[#c35b53] transition-colors">
              <LuPencilLine size={16} />
            </button>
          )}
        </div>

        <div className="p-4 text-sm flex gap-6">
          <div className="flex justify-start flex-col">
            <span className="text-[#6b7280]">Quantity:</span>
            <span className="text-[#6b7280]">Expiration:</span>
          </div>

          <div className="flex justify-start flex-col text-sm">
            <span>
              {donation.quantity} {donation.units}
            </span>
            <span>
              {formatDateTime(
                donation.expiration_date,
                donation.expiration_time
              )}
            </span>
          </div>
        </div>

        <div>
          {active && displayTime && displayTime !== "Expired" && (
            <div className="flex items-center text-[#F07167] text-sm border-t border-gray-200 p-4">
              <LuClock7 size={20} className="mr-1" />
              <span className="pl-1">{displayTime} left</span>
            </div>
          )}

          {!active && displayTime && (
            <div className="text-gray-500 text-sm border-t border-gray-200 p-4">
              {displayTime}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <SectionHeader
          title="Active Donations"
          subtitle="Food ready for donation"
          viewAllLink="/donations"
          active={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {activeDonations.length > 0 ? (
            activeDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                active={true}
              />
            ))
          ) : (
            <p className="text-gray-500"> No active donations found.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <SectionHeader
          title="Past Donations"
          subtitle="Check donation history"
          viewAllLink="/history"
          active={false}
        />

        <div
          className="grid grid-cols-1 md:grid-cols-3
         gap-4 mt-4"
        >
          {pastDonations.length > 0 ? (
            pastDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                active={false}
              />
            ))
          ) : (
            <p> No past donations found</p>
          )}
        </div>
      </div>
    </div>
  );
}
