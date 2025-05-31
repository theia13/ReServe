import { LuBell } from "react-icons/lu";

import { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants/";

import NGOStats from "./NGOStats";
import NGODonations from "./NGODonations";

import { useToast } from "../../hooks/use-toast";

export default function NGOMainContent() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [pastDonations, setPastDonations] = useState([]);

  const { toast } = useToast();

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const accessToken = sessionStorage.getItem(ACCESS_TOKEN);
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
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();

    const fetchInterval = setInterval(() => {
      fetchDonations();
    }, 60000);

    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  const claimDonation = async (donationId) => {
    setClaimingId(donationId);
    try {
      const token = sessionStorage.getItem(ACCESS_TOKEN);

      if (!token) throw new Error("Access token not found");

      const res = await fetch(
        `http://127.0.0.1:8000/api/donations/${donationId}/claim/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to claim");

      toast({
        variant: "default",
        title: "Donation Claimed!",
        description: "Donation has been claimed successfully!",
      });

      const claimedDonation = donations.find(
        (donation) => donation.id === donationId
      );

      setDonations((prevDonations) => {
        return prevDonations.filter((donation) => donation.id !== donationId);
      });

      if (claimedDonation) {
        const updatedDonation = { ...claimedDonation, status: "claimed" };
        setPastDonations((prev) => [...prev, updatedDonation]);
      }

      await fetchDonations();
    } catch (err) {
      console.log("Error claiming donation:", err);
      toast({
        variant: "destructive",
        title: "Failed to claim",
        description: "Donation can't be claimed!",
      });
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="md:pl-72 w-full min-h-screen bg-[#f5f8fb] animate-slide-up ">
      <header className="h-16 bg-white  flex justify-end items-center pr-14 shadow-sm sticky top-0 ">
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
        <NGODonations
          donations={donations}
          loading={loading}
          onClaim={claimDonation}
          claimingId={claimingId}
          pastDonations={[]}
        />
      </div>
    </div>
  );
}
