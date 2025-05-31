import { Clock } from "lucide-react";
import { DateTime } from "luxon";

import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants";

import { timePast } from "../../utils/dateTimeUtils";

export default function NGOHistory() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem(ACCESS_TOKEN);
      const res = await fetch("http://127.0.0.1:8000/api/donations/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("Fetched data:", data);

      setDonations(data);
    } catch (error) {
      console.error("Failed to fetch donations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Filter only claimed donations
  const claimedDonations = donations.filter(
    (donation) => donation.status?.toLowerCase() === "claimed"
  );

  const formatDateTime = (isoString) => {
    if (!isoString) return "Invalid Date";

    const dt = DateTime.fromISO(isoString, { zone: "Asia/Kolkata" });

    if (!dt.isValid) return "Invalid Date";

    return dt.toLocaleString(DateTime.DATETIME_MED);
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
            {claimedDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex flex-col md:flex-row md:items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-2"
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

                <div className="md:text-right md:mr-6">
                  <p className="text-md text-gray-900">
                    {formatDateTime(donation.claimed_at).split(",")[0]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(donation.claimed_at)
                      .split(",")
                      .slice(1)
                      .join(",")
                      .trim()}
                  </p>
                </div>

                <div className="text-md text-gray-500 w-24 md:text-right md:mr-4">
                  {timePast(donation.claimed_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
