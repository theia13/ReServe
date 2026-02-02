import api from "../lib/axios";

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/login/", { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/register/", userData);
  return response.data;
};

export const logoutUser = async () => {
  return api.post("/logout/");
};
