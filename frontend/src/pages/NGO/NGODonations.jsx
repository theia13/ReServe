import { Link } from "react-router-dom";
import { LuClock7 } from "react-icons/lu";
import { FaArrowRightLong } from "react-icons/fa6";

import { timeLeft, timePast, isExpired } from "../../utils/dateTimeUtils";

import { useMemo } from "react";

export default function NGODonations({
  donations = [],
  loading = false,
  onClaim,
  claimingId = null,
  pastDonations = [],
}) {
  const { availableDonations, claimedDonations } = useMemo(() => {
    const available = [];
    const claimed = [];

    donations.forEach((donation) => {
      if (!donation) return;

      const isClaimed = donation.status?.toLowerCase() === "claimed";
      const expired = isExpired(
        donation.expiration_date,
        donation.expiration_time
      );

      if (isClaimed) {
        claimed.push(donation);
      } else if (!expired) {
        available.push(donation);
      }
    });

    return { availableDonations: available, claimedDonations: claimed };
  }, [donations]);

  const SectionHeader = ({ title, subtitle, viewAllLink, active = true }) => {
    return (
      <div className="flex justify-between items-center">
        <div>
          <h2 className="lg:text-xl text-[#020817] font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-sm lg:text-md text-gray-500">{subtitle}</p>
          )}
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className={`flex items-center gap-1 hover:px-4 transition-all ease-in-out duration-100 text-sm font-medium py-3 md:py-1 px-3 rounded-full ${
              active ? "bg-[#F07167] text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            <span className="hidden md:block"> View All </span>
            <FaArrowRightLong size={14} className="md:ml-1" />
          </Link>
        )}
      </div>
    );
  };

  const DonationCard = ({ donation, active = true, onClaim, claimingId }) => {
    // Capitalize each word in the food item
    const capitalizeWords = (str) =>
      str
        ? str
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "";

    // Determine which time display to show
    const displayTime = active
      ? timeLeft(donation.expiration_date, donation.expiration_time)
      : donation.claimed_at
      ? timePast(donation.claimed_at)
      : timePast(donation.expiration_date, donation.expiration_time);

    return (
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden animate-slide-up ${
          !active ? "bg-gray-100" : ""
        }`}
      >
        <div
          className={`flex justify-between items-center p-4 text-md ${
            active ? "bg-[#F07167] text-white" : "bg-gray-200 text-black"
          }`}
        >
          <h3 className="font-medium">{capitalizeWords(donation.food_item)}</h3>
        </div>
        <div className="p-4 text-sm flex gap-6">
          <div className="flex flex-col">
            <span className="text-[#6b7280]">Quantity:</span>
            <span className="text-[#6b7280]">Expiration:</span>
            <span className="text-[#6b7280]">Restaurant:</span>
          </div>
          <div className="flex flex-col">
            <span>
              {donation.quantity} {donation.units}
            </span>
            <span>
              {donation.expiration_date} {donation.expiration_time}
            </span>
            <span>{donation.restaurantName}</span>
          </div>
        </div>

        <div>
          {active ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center text-[#F07167] text-sm border-t border-gray-200 p-4">
                <LuClock7 size={18} className="mr-1" />
                <span>{displayTime}</span>
              </div>
              <div className="p-4">
                <button
                  onClick={() => onClaim && onClaim(donation.id)}
                  className="bg-[#f07167] text-white rounded-md px-4 py-1 text-sm hover:bg-[#e1665d]"
                  disabled={claimingId === donation.id}
                >
                  {claimingId === donation.id ? "Processing..." : "Claim"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div className="text-gray-500 text-sm mt-2 border-t border-gray-200 p-4">
                {displayTime}
              </div>
              <div className="p-4">
                <div className="bg-[#dcdee1] rounded-md px-4 py-1 text-sm text-gray-500">
                  Claimed
                </div>
              </div>
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
          title="Available Donations"
          subtitle="Nearby Available Donations"
          viewAllLink="/donations"
          active={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {loading ? (
            <p className="text-center text-gray-500 py-10">
              {" "}
              Loading donations...
            </p>
          ) : availableDonations.length > 0 ? (
            availableDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                active={true}
                onClaim={onClaim}
                claimingId={claimingId}
              />
            ))
          ) : (
            <p className="text-gray-500"> No active donations found.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <SectionHeader
          title="Claimed Donations"
          subtitle="Donations you've claimed"
          viewAllLink="/ngo-dashboard/history"
          active={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {loading ? (
            <p className="text-center text-gray-500 py-10">
              {" "}
              Loading past donations...
            </p>
          ) : claimedDonations.length > 0 ? (
            claimedDonations.map((donation) => (
              <DonationCard
                key={donation.id}
                donation={donation}
                active={false}
              />
            ))
          ) : (
            <p className="text-gray-500"> No claimed donations found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
