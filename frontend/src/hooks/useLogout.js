import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../services/authService";

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};
