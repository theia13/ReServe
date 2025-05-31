import { createContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // refresh token

  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    if (!refresh) throw new Error("No refresh token available!");

    const response = await fetch(
      "https://127.0.0.0.1:8000/api/token/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }
    );

    const data = await response.json();

    if ((!response.ok || !data, access)) {
      logout();
      throw new Error("Session expired. Please log in again.");
    }

    localStorage.setItem(ACCESS_TOKEN, data.access);
    setUser((prev) => (prev ? { ...prev, token: data.access } : null));
    return data.access;
  };

  const authFetch = async (URL, options = {}) => {
    let accessToken = localStorage.getItem(ACCESS_TOKEN);

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    const config = {
      ...options,
      headers,
    };

    let response = await fetch(URL, config);

    if (response.status === 401) {
      try {
        accessToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(URL, config);
      } catch (error) {
        console.error("Token refresh failed:", error);
        throw error;
      }
    }

    return response;
  };

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

      if (!response.ok) {
        if (data.non_field_errors) {
          throw new Error(data.non_field_errors[0]);
        } else if (data.email) {
          throw new Error(data.email[0]);
        } else if (data.password) {
          throw new Error(data.password[0]);
        } else {
          throw new Error("Login failed. Please try again.");
        }
      }

      if (!data.user || !data.user.user_type || !data.access) {
        throw new Error("User type not found in response!");
      }

      sessionStorage.setItem(ACCESS_TOKEN, data.access);
      sessionStorage.setItem(REFRESH_TOKEN, data.refresh);
      sessionStorage.setItem("role", data.user.user_type);

      setUser({ token: data.access, user_type: data.user.user_type });

      const dashboardRoute =
        data.user.user_type === "ngo"
          ? "/ngo-dashboard"
          : "/restaurant-dashboard";
      navigate(dashboardRoute, { replace: true });

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);

      return { success: false, error: error.message };
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const formattedData = {
        user_type: userData.user_type,
        organization_name: userData.organization_name,
        contact_person: userData.contact_person,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
        address: {
          street_address: userData.address.street_address,
          area: userData.address.area,
          landmark: userData.address.landmark,
          city: userData.address.city,
          pin_code: userData.address.pin_code,
        },
      };

      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        const formattedErrors = {};
        Object.keys(data).forEach((key) => {
          const error = data[key];
          formattedErrors[key] = Array.isArray(error) ? error : [error];
        });
        return { success: false, errors: data };
      }

      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);
      setUser({ token: data.access, role: data.user_type });

      navigate(
        data.user_type === "ngo" ? "/ngo-dashboard" : "/restaurant-dashboard",
        { replace: true }
      );

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);

      return {
        success: false,
        errors: {
          non_field_errors: ["An unexpected error occured. Please try again."],
        },
      };
    }
  };

  // Logout
  const logout = useCallback(async () => {
    try {
      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) throw new Error("No refresh token found");

      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem(ACCESS_TOKEN)}`,
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      sessionStorage.removeItem(ACCESS_TOKEN);
      sessionStorage.removeItem(REFRESH_TOKEN);
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
