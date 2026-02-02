import { Clock } from "lucide-react";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import { useDonations } from "../../hooks/useDonations";
import { formatDateTime, timePast, isExpired } from "../../utils/dateTimeUtils";

export default function RestaurantHistory() {
  const { donations, loading, error, fetchDonations } = useDonations();

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const formatDate = (isoString) => {
    if (!isoString) return "Invalid Date";

    const dt = DateTime.fromISO(isoString, { zone: "Asia/Kolkata" });

    if (!dt.isValid) return "Invalid Date";

    return dt.toLocaleString(DateTime.DATETIME_MED);
  };

  const getDisplayDate = (donation) => {
    if (donation.claimed_at) return formatDate(donation.claimed_at);
    if (donation.expiration_date)
      return formatDateTime(donation.expiration_date); // just date
    return "No date";
  };

  return (
    <div className="md:pl-72 w-full min-h-screen bg-[#f5f8fb] animate-slide-up">
      <header className="h-16 bg-white flex justify-end items-center pr-14 shadow-sm sticky top-0"></header>

      <div className="flex flex-col justify-between px-12 py-6">
        <div>
          <h1 className="text-xl lg:text-2xl text-[#020817] font-bold">
            History
          </h1>
          <p className="text-[#6b7280]">Review all your past donations</p>
        </div>

        <div className="bg-white w-full md:h-[30rem] mt-10 rounded-sm p-4 overflow-y-auto">
          <div className="grid gap-4">
            {donations
              .filter(
                (donation) =>
                  donation.status === "claimed" ||
                  (donation.status === "claim" &&
                    isExpired(
                      donation.expiration_date,
                      donation.expiration_time,
                    )),
              )
              .map((donation) => {
                const statusLabel =
                  donation.status === "claimed"
                    ? "Claimed"
                    : donation.status === "claim" &&
                        isExpired(
                          donation.expiration_date,
                          donation.expiration_time,
                        )
                      ? "Expired"
                      : "";

                const displayDate = donation.claimed_at
                  ? formatDate(donation.claimed_at)
                  : formatDateTime(donation.expiration_date);

                const timeAgo = donation.claimed_at
                  ? timePast(donation.claimed_at)
                  : "";

                return (
                  <div
                    key={donation.id}
                    className={`flex flex-col md:flex-row md:items-center p-4 border border-gray-100 rounded-lg transition-colors gap-2
    ${statusLabel === "Claimed" ? "bg-green-50" : ""}
    ${statusLabel === "Expired" ? "bg-red-50" : ""}
    hover:bg-opacity-80`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F07167]/10 flex items-center justify-center mr-4">
                      <Clock size={18} className="text-[#F07167]" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{donation.food_item}</h3>
                      <p className="text-sm text-gray-500">
                        {donation.quantity} {donation.units}
                      </p>
                    </div>

                    {donation.claimed_at && (
                      <div className="md:text-right md:mr-6">
                        <p className="text-md text-gray-900">
                          {displayDate.split(",")[0]}
                        </p>
                        <p className="text-sm text-gray-500">
                          {displayDate.split(",").slice(1).join(",").trim()}
                        </p>
                      </div>
                    )}

                    {donation.claimed_at && (
                      <div className="text-md text-gray-500 w-24 md:text-right md:mr-4">
                        {timeAgo}
                      </div>
                    )}

                    <div>{statusLabel}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
