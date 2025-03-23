import { createContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Login
  const login = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.user || !data.user.user_type || !data.access) {
        throw new Error("User type not found in response!");
      }

      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);

      setUser({ token: data.access, user_type: data.user.user_type });

      const dashboardRoute =
        data.user.user_type === "ngo"
          ? "/ngo-dashboard"
          : "/restaurant-dashboard";
      navigate(dashboardRoute, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      console.log("Sending data:", JSON.stringify(userData, null, 2));

      const formattedData = {
        user_type: userData.user_type,
        organization_name: userData.organization_name,
        contact_person: userData.contact_person,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
        street_address: userData.address.street,
        area: userData.address.area,
        landmark: userData.address.landmark,
        city: userData.address.city,
        pin_code: userData.address.pincode,
      };

      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const responseText = await response.text();
      console.log("Raw Response:", responseText);
      const data = JSON.parse(responseText);

      if (!response.ok) {
        console.error("Backend Response Error:", data);
        throw new Error("Registration failed!");
      }

      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);
      setUser({ token: data.access, role: data.user_type });

      navigate(
        data.user_type === "ngo" ? "/ngo-dashboard" : "/restaurant-dashboard",
        { replace: true }
      );
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Logout
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) throw new Error("No refresh token found");

      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      const responseText = await response.text();
      console.log("Logout response", responseText);

      if (!response.ok) throw new Error("Logout failed");

      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      setUser(null);

      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
