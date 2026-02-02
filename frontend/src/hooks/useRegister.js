import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/authService";

export const useRegister = (options = {}) => {
  return useMutation({
    mutationFn: registerUser,
    ...options,
  });
};
