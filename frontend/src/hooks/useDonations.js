import { useState, useCallback } from "react";
import api from "../lib/axios";

export function useDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/donations");
      setDonations(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDonation = useCallback(async (donationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/donations/", donationData);
      setDonations((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDonation = useCallback(async (donationId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/donations/${donationId}/`);
      setDonations((prev) =>
        prev.filter((donation) => donation.id !== donationId),
      );
      return true;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDonation = useCallback(async (donationId, donationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/donations/${donationId}/`, donationData);
      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === donationId ? response.data : donation,
        ),
      );
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    donations,
    loading,
    error,
    fetchDonations,
    createDonation,
    deleteDonation,
    updateDonation,
    setLoading,
    setDonations,
  };
}
