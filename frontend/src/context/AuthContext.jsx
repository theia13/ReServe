import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";
import { useLogout } from "../hooks/useLogout";
import api from "../lib/axios";

export const AuthContext = createContext();

// In AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/check-auth/")
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        console.log("Auth check failed:", error);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  //Login
  const { mutateAsync: loginMutation } = useLogin({
    onSuccess: (data) => {
      if (data.user) setUser(data.user);
    },
  });

  const login = async (email, password) => {
    try {
      const data = await loginMutation({ email, password });
      if (!data.user || !data.user.user_type) {
        console.log("Invalid login response structure");
        return { success: false, error: "Invalid login response" };
      }

      try {
        const userRes = await api.get("/check-auth/");
        setUser(userRes.data);
      } catch (userError) {
        console.error("Failed to fetch user after login:", userError);
        setUser(data.user);
      }

      const dashboardRoute =
        data.user.user_type === "ngo"
          ? "/ngo-dashboard"
          : "/restaurant-dashboard";
      navigate(dashboardRoute, { replace: true });
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      const errMsg =
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.detail ||
        error?.message ||
        "Login failed. Please try again.";
      return { success: false, error: errMsg };
    }
  };

  const { mutateAsync: registerMutation } = useRegister({
    onSuccess: (data) => {
      console.log("Register onSuccess triggered:", data);
      if (data.user) setUser(data.user);
    },
    onError: (error) => {
      console.error("Register onError triggered:", error);
    },
  });

  const register = async (FormData) => {
    try {
      const data = await registerMutation(FormData);
      if (!data.user || !data.user.user_type) {
        console.log("❌ Invalid registration response structure:", data);
        return {
          success: false,
          errors: { non_field_errors: ["Invalid registration response"] },
        };
      }
      try {
        const userRes = await api.get("/check-auth/");
        setUser(userRes.data);
      } catch (userError) {
        console.error("⚠️ Check-auth failed, using register data:", userError);
        setUser(data.user);
      }

      const dashboardRoute =
        data.user.user_type === "ngo"
          ? "/ngo-dashboard"
          : "/restaurant-dashboard";
      navigate(dashboardRoute, { replace: true });
      return { success: true };
    } catch (error) {
      const errData = error?.response?.data || {};
      const formattedErrors = {};
      Object.keys(errData).forEach((key) => {
        const val = errData[key];
        formattedErrors[key] = Array.isArray(val) ? val : [val];
      });
      if (!Object.keys(formattedErrors).length) {
        formattedErrors.non_field_errors = [
          error?.message || "Registration failed. Please try again.",
        ];
      }
      return { success: false, errors: formattedErrors };
    }
  };

  // Logout

  const { mutateAsync: logoutMutation } = useLogout({
    onSuccess: () => {
      setUser(null);
      navigate("/auth/login");
    },
    onError: () => {
      setUser(null);
      navigate("/auth/login");
    },
  });

  const logout = async () => {
    try {
      await logoutMutation();
      setUser(null);
      navigate("/auth/login");
      return { success: true };
    } catch (error) {
      setUser(null);
      navigate("/auth/login");
      const errData = error?.response?.data || {};
      const formattedErrors = {};
      Object.keys(errData).forEach((key) => {
        const val = errData[key];
        formattedErrors[key] = Array.isArray(val) ? val : [val];
      });
      if (!Object.keys(formattedErrors).length) {
        formattedErrors.non_field_errors = [
          error?.message || "Logout failed. Please try again.",
        ];
      }
      return { success: false, errors: formattedErrors };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
