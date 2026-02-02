import api from "../lib/axios";
import { useMutation } from "@tanstack/react-query";

const unclaimDonation = (donationId) => {
  return api.post(`/donations/${donationId}/unclaim/`);
};

export const useUnClaimDonation = (onSuccess, onError) =>
  useMutation({
    mutationFn: unclaimDonation,
    onSuccess,
    onError,
  });
