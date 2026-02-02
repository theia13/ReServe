import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useUserProfile } from "../../hooks/useUserProfile"; // Import the hook

export default function NGOSettings() {
  // Use the user profile hook
  const {
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
  } = useUserProfile();

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    fetchUserProfile().catch(console.error);
  }, [fetchUserProfile]);

  // Handle input change for both user and address fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Address fields
    if (
      ["street_address", "area", "landmark", "city", "pin_code"].includes(name)
    ) {
      setUserData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(userData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle password change submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError("");
    setPwSuccess(false);

    // Basic frontend validation
    if (
      !passwordData.current_password ||
      !passwordData.new_password ||
      !passwordData.confirm_new_password
    ) {
      setPwError("All fields are required.");
      setPwLoading(false);
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_new_password) {
      setPwError("New passwords do not match.");
      setPwLoading(false);
      return;
    }

    try {
      await changePassword(passwordData);
      setPwSuccess(true);
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
      });
    } catch (error) {
      setPwError(error.message);
    } finally {
      setPwLoading(false);
    }
  };

  // Error message component
  const ErrorMessage = ({ fieldName }) => {
    const fieldErrors = errors[fieldName];
    if (!fieldErrors) return null;
    const errorsArray = Array.isArray(fieldErrors)
      ? fieldErrors
      : [fieldErrors];
    return (
      <div className="text-red-500 text-sm mt-1">
        {errorsArray.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="md:pl-72 w-full min-h-screen bg-[#f5f8fb] animate-slide-up">
      <header className="h-16 bg-white flex justify-end items-center pr-14 shadow-sm sticky top-0"></header>

      <div className="flex flex-col justify-between px-12 py-6">
        <div>
          <h1 className="text-xl lg:text-2xl text-[#020817] font-bold">
            Settings
          </h1>
          <p className="text-[#6b7280]">Manage your account preferences</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mt-10">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6 bg-[#F0F5FA]">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="animate-slide-up">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {errors.non_field_errors && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errors.non_field_errors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Profile updated successfully!
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Name</Label>
                  <Input
                    id="organization"
                    name="organization_name"
                    value={userData.organization_name}
                    onChange={handleInputChange}
                    className="bg-[#F0F5FA]"
                  />
                  <ErrorMessage fieldName="organization_name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    className="bg-[#F0F5FA]"
                  />
                  <ErrorMessage fieldName="email" />
                </div>

                <div className="space-y-2">
                  <p>Address</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street_address">Street Address</Label>
                      <Input
                        id="street_address"
                        name="street_address"
                        value={userData.address.street_address}
                        onChange={handleInputChange}
                        className="bg-[#F0F5FA]"
                      />
                      <ErrorMessage fieldName="street_address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        name="area"
                        value={userData.address.area}
                        onChange={handleInputChange}
                        className="bg-[#F0F5FA]"
                      />
                      <ErrorMessage fieldName="area" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        name="landmark"
                        value={userData.address.landmark}
                        onChange={handleInputChange}
                        className="bg-[#F0F5FA]"
                      />
                      <ErrorMessage fieldName="landmark" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={userData.address.city}
                        onChange={handleInputChange}
                        className="bg-[#F0F5FA]"
                      />
                      <ErrorMessage fieldName="city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pin_code">Pin code</Label>
                      <Input
                        id="pin_code"
                        name="pin_code"
                        value={userData.address.pin_code}
                        onChange={handleInputChange}
                        className="bg-[#F0F5FA]"
                      />
                      <ErrorMessage fieldName="pin_code" />
                    </div>
                  </div>
                </div>
                <Button
                  className="bg-[#F07167] hover:bg-[#F07167] text-white"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="notifications" className="animate-slide-up">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive notifications about donation activities
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      className="rounded text-coral"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Expiration Alerts</h3>
                    <p className="text-sm text-gray-500">
                      Get alerts when donations are about to expire
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="expiration-alerts"
                      className="rounded text-coral"
                      defaultChecked
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Reports</h3>
                    <p className="text-sm text-gray-500">
                      Receive weekly summary of donation activities
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="weekly-reports"
                      className="rounded text-coral"
                    />
                  </div>
                </div>

                <Button className="bg-[#F07167] hover:bg-[#F07167] text-white">
                  Save Preferences
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="animate-slide-up">
              <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                {pwError && <div className="text-red-500">{pwError}</div>}
                {pwSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Password updated successfully!
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    name="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="bg-[#F0F5FA]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    name="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="bg-[#F0F5FA]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    name="confirm_new_password"
                    type="password"
                    value={passwordData.confirm_new_password}
                    onChange={handlePasswordChange}
                    className="bg-[#F0F5FA]"
                  />
                </div>
                <Button
                  className="bg-[#F07167] hover:bg-[#F07167] text-white"
                  disabled={pwLoading}
                >
                  {pwLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
