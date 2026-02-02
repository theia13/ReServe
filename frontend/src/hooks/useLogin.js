import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/authService";

export const useLogin = (options = {}) => {
  return useMutation({
    mutationFn: loginUser,
    ...options,
  });
};
