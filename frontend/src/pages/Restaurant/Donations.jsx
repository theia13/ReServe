import { Link } from "react-router-dom";
import { LuClock7 } from "react-icons/lu";
import { LuPencilLine } from "react-icons/lu";
import { FaArrowRightLong } from "react-icons/fa6";

export default function Donations() {
  const activeDonations = [
    {
      id: 1,
      title: "Cooked Rice & Curry",
      quantity: "5 liters",
      expiration: "March 4, 2025, 8:00 PM",
      timeLeft: "12 hours left",
    },
    {
      id: 2,
      title: "Cooked Rice & Curry",
      quantity: "5 liters",
      expiration: "March 4, 2025, 8:00 PM",
      timeLeft: "12 hours left",
    },
    {
      id: 3,
      title: "Cooked Rice & Curry",
      quantity: "5 liters",
      expiration: "March 4, 2025, 8:00 PM",
      timeLeft: "12 hours left",
    },
  ];

  const pastDonations = [
    {
      id: 1,
      title: "Cooked Rice & Curry",
      quantity: "5 liters",
      expiration: "March 4, 2025, 8:00 PM",
      timePast: "1 week ago",
    },
    {
      id: 2,
      title: "Cooked Rice & Curry",
      quantity: "5 liters",
      expiration: "March 4, 2025, 8:00 PM",
      timePast: "2 days ago",
    },
  ];

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
    title,
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
          <h3 className="font-medium">{title}</h3>
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

          <div className="flex justify-start flex-col  ">
            <span>{quantity}</span>
            <span>{expiration}</span>
          </div>
        </div>
        <div>
          {timeLeft && (
            <div className="flex items-center text-[#F07167] text-sm border-t border-gray-200 p-4">
              <LuClock7 size={18} className="mr-1" />
              <span>{timeLeft}</span>
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
          {activeDonations.map((donation) => (
            <DonationCard
              key={donation.id}
              title={donation.title}
              quantity={donation.quantity}
              expiration={donation.expiration}
              timeLeft={donation.timeLeft}
              active={true}
            />
          ))}
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
          {pastDonations.map((donation) => (
            <DonationCard
              key={donation.id}
              title={donation.title}
              quantity={donation.quantity}
              expiration={donation.expiration}
              timePast={donation.timePast}
              active={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
