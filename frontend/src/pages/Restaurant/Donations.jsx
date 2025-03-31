import { Link } from "react-router-dom";
import { LuClock7 } from "react-icons/lu";
import { LuPencilLine } from "react-icons/lu";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../../constants/";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [pastDonations, setPastDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDateTime = (dateStr, timeStr) => {
    const dateIST = new Date(`${dateStr}T${timeStr}`);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(dateIST);

    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(dateIST);

    return `${formattedDate}, ${formattedTime}`;
  };

  const timeLeft = (expirationDate, expirationTime) => {
    if (!expirationDate || !expirationTime) return "Invalid Date";

    const expiration = new Date(`${expirationDate}T${expirationTime}+05:30`);

    const now = new Date();
    const diffMs = expiration - now;

    if (diffMs <= 0) return "Expired";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

    let timeLeftStr = "";
    if (days > 0) timeLeftStr += `${days} days `;
    if (hours > 0) timeLeftStr += `${hours} hours `;
    if (minutes > 0) timeLeftStr += `${minutes} mins `;

    return timeLeftStr.trim() || "Less than 1m";
  };

  const timePast = (dateStr, timeStr) => {
    console.log("Date:", dateStr);
    console.log("Time:", timeStr);

    if (!dateStr || !timeStr) return "Invalid Date";

    const pastDate = new Date(`${dateStr}T${timeStr}+05:30`);
    const now = new Date();

    const diffMs = now - pastDate;

    if (diffMs < 0) return "Future date";

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return years === 1 ? "1 year ago" : `${years} years ago`;
    } else if (months > 0) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return "Just now";
    }
  };

  const isExpired = (expirationDate, expirationTime) => {
    if (!expirationDate || !expirationTime) return true;

    const expiration = new Date(`${expirationDate}T${expirationTime}+05:30`);
    const now = new Date();

    return expiration <= now;
  };

  useEffect(() => {
    setLoading(true);

    const fetchDonations = async () => {
      try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken) throw new Error("Access token not found");

        const response = await fetch("http://127.0.0.1:8000/api/donations/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch donations");

        const data = await response.json();
        console.log("Fetched donations:", data);

        const activeDonations = [];
        const inactiveDonations = [];

        data.forEach((donation) => {
          const isClaimed = donation.status?.toLowerCase() === "claimed";
          const expired = isExpired(
            donation.expiration_date,
            donation.expiration_time
          );

          if (isClaimed || expired) {
            inactiveDonations.push(donation);
          } else {
            activeDonations.push(donation);
          }
        });

        setDonations(activeDonations);
        setPastDonations(inactiveDonations);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();

    const checkExpirations = () => {
      setDonations((prevDonations) => {
        const stillActive = prevDonations.filter(
          (donation) =>
            !isExpired(donation.expiration_date, donation.expiration_time)
        );

        const newlyExpired = prevDonations.filter((donation) =>
          isExpired(donation.expiration_date, donation.expiration_time)
        );

        setPastDonations((prevPastDonations) => {
          const uniqueExpired = newlyExpired.filter(
            (newExpired) =>
              !prevPastDonations.some((past) => past.id === newExpired.id)
          );
          return [...prevPastDonations, ...uniqueExpired];
        });

        return stillActive;
      });
    };

    checkExpirations();
    const intervalid = setInterval(checkExpirations, 60000);

    return () => clearInterval(intervalid);
  }, []);

  if (loading) return <p>Loading donations....</p>;

  const SectionHeader = ({ title, subtitle, viewAllLink, active = true }) => {
    return (
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
            View All <FaArrowRightLong size={14} className="ml-1" />
          </Link>
        )}
      </div>
    );
  };

  const DonationCard = ({
    food_item,
    quantity,
    expiration,
    timeLeft,
    timePast,
    active = true,
  }) => {
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
          <h3 className="font-medium">{food_item}</h3>
          {active && (
            <button className="p-2 rounded-full hover:bg-[#c35b53] transition-colors">
              <LuPencilLine size={16} />
            </button>
          )}
        </div>

        <div className="p-4  text-sm flex gap-6">
          <div className="flex justify-start flex-col ">
            <span className="text-[#6b7280]">Quantity:</span>
            <span className="text-[#6b7280]">Expiration:</span>
          </div>

          <div className="flex justify-start flex-col text-sm  ">
            <span>{quantity}</span>
            <span>{expiration}</span>
          </div>
        </div>
        <div>
          {timeLeft && (
            <div className="flex items-center text-[#F07167] text-sm border-t border-gray-200 p-4">
              <LuClock7 size={20} className="mr-1" />
              <span className="pl-1">{timeLeft} left </span>
            </div>
          )}

          {timePast && (
            <div className="text-gray-500 text-sm mt-2 border-t border-gray-200 p-4">
              {timePast}
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
          {donations.length > 0 ? (
            donations.map((donation) => (
              <DonationCard
                key={donation.id}
                food_item={donation.food_item
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                quantity={`${donation.quantity} ${donation.units}`}
                expiration={formatDateTime(
                  donation.expiration_date,
                  donation.expiration_time
                )}
                timeLeft={timeLeft(
                  donation.expiration_date,
                  donation.expiration_time
                )}
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
                food_item={donation.food_item
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                quantity={`${donation.quantity} ${donation.units}`}
                expiration={formatDateTime(
                  donation.expiration_date,
                  donation.expiration_time
                )}
                timePast={timePast(
                  donation.expiration_date,
                  donation.expiration_time
                )}
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
