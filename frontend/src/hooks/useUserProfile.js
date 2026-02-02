import { useState, useCallback } from "react";
import api from "../lib/axios";

export function useUserProfile() {
  const [userData, setUserData] = useState({
    organization_name: "",
    email: "",
    address: {
      street_address: "",
      area: "",
      landmark: "",
      city: "",
      pin_code: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setErrors({});
    try {
      const response = await api.get("/user/user-profile/");
      const data = response.data;
      setUserData({
        ...data,
        address: {
          street_address: data.address?.street_address || "",
          area: data.address?.area || "",
          landmark: data.address?.landmark || "",
          city: data.address?.city || "",
          pin_code: data.address?.pin_code || "",
        },
      });
    } catch (err) {
      setErrors({ non_field_errors: ["Failed to load user data"] });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (profileData) => {
    setLoading(true);
    setErrors({});
    setSuccess(false);
    try {
      const response = await api.patch("/user/user-profile/", profileData);
      setUserData(profileData);
      setSuccess(true);
      return response.data;
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ["Failed to update profile"] });
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setErrors({});
    try {
      const response = await api.patch("/user/change-password/", passwordData);
      return response.data;
    } catch (err) {
      if (err.response?.data) {
        throw new Error(err.response.data.error || "Failed to change password");
      } else {
        throw new Error("Network error. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    userData,
    setUserData,
    loading,
    errors,
    success,
    setErrors,
    setSuccess,
    fetchUserProfile,
    updateUserProfile,
    changePassword,
  };
}
