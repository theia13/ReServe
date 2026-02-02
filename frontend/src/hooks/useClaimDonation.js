import api from "../lib/axios";
import { useMutation } from "@tanstack/react-query";

const claimDonation = (donationId) => {
  return api.post(`/donations/${donationId}/claim/`);
};

export const useClaimDonation = (onSuccess, onError) =>
  useMutation({
    mutationFn: claimDonation,
    onSuccess,
    onError,
  });
