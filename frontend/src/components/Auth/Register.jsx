import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import { TfiLocationPin } from "react-icons/tfi";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const [formData, setformData] = useState({
    user_type: null,
    organization_name: "",
    contact_person: "",
    email: "",
    password: "",
    confirm_password: "",
    address: {
      street: "",
      area: "",
      landmark: "",
      city: "",
      pincode: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    await register(formData);
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col w-full  justify-center items-center overflow-hidden  ">
        <div className="flex flex-col justify-center items-center">
          <h1 className=" text-4xl lg:text-5xl font-bold mt-8">Register</h1>
          <p className="mt-2">
            Already have an account?
            <span className="text-[#F07167] relative cursor-pointer group">
              {" "}
              <Link to="/auth/login">
                Sign in here.
                <span className="absolute left-1/2 bottom-0 w-0 h-[0.5px] bg-[#F07167] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
            </span>
          </p>
        </div>
        <div className=" shadow-lg p-6  ">
          <div className="flex gap-4 mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="option"
                value="restaurant"
                className="w-5 h-5 text-[#F07167] bg-gray-100 border-gray-300 focus:ring-[#F07167]"
                checked={selectedOption === "restaurant"}
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  setformData({ ...formData, user_type: e.target.value });
                }}
              />
              <span className="text-black">As Restaurant </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="option"
                value="ngo"
                className="w-5 h-5 text-[#F07167] bg-gray-100 border-gray-300 focus:ring-[#F07167]"
                checked={selectedOption === "ngo"}
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  setformData({ ...formData, user_type: e.target.value });
                }}
              />
              <span className="text-black">As NGO</span>
            </label>
          </div>

          <form
            action=""
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder={
                selectedOption == "restaurant"
                  ? "Restaurant/Hotel Name"
                  : "Organization Name"
              }
              value={formData.organization_name}
              onChange={(e) =>
                setformData({ ...formData, organization_name: e.target.value })
              }
              className="border-2 border-gray-200 rounded-sm px-4 py-2 w-full  "
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Contact person"
                value={formData.contact_person}
                onChange={(e) =>
                  setformData({ ...formData, contact_person: e.target.value })
                }
                className="border-2 border-gray-200 rounded-sm px-4 py-2 flex-1 "
              />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) =>
                  setformData({ ...formData, email: e.target.value })
                }
                className="border-2 border-gray-200 rounded-sm px-4 py-2 flex-1  "
              />
            </div>

            <div className="bg-gray-50 flex flex-col p-4 gap-4 rounded-md mt-2 ">
              <div className="flex items-center gap-4 ">
                {" "}
                <TfiLocationPin className="h-5 w-5" />
                <p>Address Details</p>
              </div>

              <input
                type="text"
                placeholder="Street address"
                value={formData.address.street}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                className=" rounded-sm px-4 py-2 w-full "
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Area/Locality"
                  value={formData.address.area}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      address: { ...formData.address, area: e.target.value },
                    })
                  }
                  className=" rounded-sm px-4 py-2 lg:w-96 "
                />
                <input
                  type="text"
                  placeholder="Landmark"
                  value={formData.address.landmark}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      address: {
                        ...formData.address,
                        landmark: e.target.value,
                      },
                    })
                  }
                  className=" rounded-sm px-4 py-2 lg:w-96 "
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  className=" rounded-sm px-4 py-2 lg:w-96 "
                />
                <input
                  type="text"
                  placeholder="PIN code"
                  value={formData.address.pincode}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      address: { ...formData.address, pincode: e.target.value },
                    })
                  }
                  className=" rounded-sm px-4 py-2 lg:w-96 "
                />
              </div>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setformData({ ...formData, password: e.target.value })
              }
              className="border-2 border-gray-200 rounded-sm px-4 py-2 w-full "
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={formData.confirm_password}
              onChange={(e) =>
                setformData({ ...formData, confirm_password: e.target.value })
              }
              className="border-2 border-gray-200 rounded-sm px-4 py-2 w-full "
            />
            <button
              className="px-6 py-3 bg-black text-white transition-all duration-300 relative group overflow-hidden"
              disabled={loading}
            >
              <span className="absolute inset-0 bg-[#1F1F1F] translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
              <span className="relative z-10"> Register </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
