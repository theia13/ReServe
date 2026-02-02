import { LuBell } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useUnClaimDonation } from "../../hooks/useUnclaimDonation";
import NGOStats from "./NGOStats";
import NGODonations from "./NGODonations";
import { useDonations } from "../../hooks/useDonations";
import { useToast } from "../../hooks/use-toast";
import { useClaimDonation } from "../../hooks/useClaimDonation";

export default function NGOMainContent() {
  const [claimingId, setClaimingId] = useState(null);
  const [unclaimingId, setUnclaimingId] = useState(null);
  const [pastDonations, setPastDonations] = useState([]);

  const {
    donations,
    loading,
    error,
    fetchDonations,
    setLoading,
    setDonations,
  } = useDonations();

  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();

    const fetchInterval = setInterval(() => {
      fetchDonations();
    }, 60000);

    return () => {
      clearInterval(fetchInterval);
    };
  }, [fetchDonations]);

  // Claim donation mutation
  const { mutate: claimDonation, isPending: isClaiming } = useClaimDonation(
    async (data) => {
      toast({
        title: "Donation claimed!",
        description: "Successfully claimed.",
      });
      // Refresh donations to get updated status
      await fetchDonations();
      setClaimingId(null);
    },
    (error) => {
      console.error("Claim error:", error);
      toast({
        variant: "destructive",
        title: "Failed to claim",
        description: error?.response?.data?.message || "Something went wrong",
      });
      setClaimingId(null);
    },
  );

  // Unclaim donation mutation
  const { mutate: unclaimDonation, isPending: isUnclaiming } =
    useUnClaimDonation(
      async (data) => {
        toast({
          title: "Donation unclaimed!",
          description: "Successfully unclaimed.",
        });
        // Refresh donations to get updated status
        await fetchDonations();
        setUnclaimingId(null);
      },
      (error) => {
        console.error("Unclaim error:", error);
        toast({
          variant: "destructive",
          title: "Failed to unclaim",
          description: error?.response?.data?.message || "Something went wrong",
        });
        setUnclaimingId(null);
      },
    );

  const handleClaim = (donationId) => {
    setClaimingId(donationId);
    claimDonation(donationId);
  };

  const handleUnclaim = (donationId) => {
    setUnclaimingId(donationId);
    unclaimDonation(donationId);
  };

  return (
    <div className="md:pl-72 w-full min-h-screen bg-[#f5f8fb] animate-slide-up">
      <header className="h-16 bg-white flex justify-end items-center pr-14 shadow-sm sticky top-0">
        <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors relative">
          <LuBell size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#F07167] rounded-full"></span>
        </button>
      </header>

      <div className="flex justify-between items-center px-12 py-6">
        <div>
          <p className="text-[#6b7280]">Welcome back,</p>
          <h1 className="text-xl lg:text-2xl text-[#020817] font-bold">
            FeedingHands NGO
          </h1>
        </div>
      </div>

      <div className="px-12 py-4">
        <NGOStats />
      </div>

      <div className="px-12 py-4">
        <NGODonations
          donations={donations}
          loading={loading}
          onClaim={handleClaim}
          onUnclaim={handleUnclaim}
          claimingId={claimingId}
          unclaimingId={unclaimingId}
          pastDonations={pastDonations}
        />
      </div>
    </div>
  );
}
