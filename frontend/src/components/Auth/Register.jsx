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
      street_address: "",
      area: "",
      landmark: "",
      city: "",
      pin_code: "",
    },
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: ["Passwords do not match!"] });
      setLoading(false);
      return;
    }

    const validationErrors = {};

    if (!formData.user_type) {
      validationErrors.user_type = ["Please select a user type!"];
    }

    if (!formData.organization_name.trim()) {
      validationErrors.organization_name = ["Organization name is required!"];
    }

    if (!formData.contact_person.trim()) {
      validationErrors.contact_person = ["Contact person is required!"];
    }

    if (!formData.email.trim()) {
      validationErrors.email = ["Email is required!"];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = ["Invalid email format"];
    }

    if (!formData.address.area.trim()) {
      validationErrors.area = ["Area is required"];
    }

    if (!formData.address.city.trim()) {
      validationErrors.city = ["City is required"];
    }

    if (!formData.address.street_address.trim()) {
      validationErrors.street_address = ["Street address is required"];
    }

    if (!formData.address.pin_code.trim()) {
      validationErrors.pin_code = ["Pincode is required"];
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (!result.success) {
      setErrors(result.errors);
    }

    setLoading(false);
  };

  const ErrorMessage = ({ fieldName }) => {
    const fieldErrors =
      errors[fieldName] ||
      (fieldName.includes("address.") && errors[fieldName.split(".")[1]]);

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

        <div className=" p-6 w-full max-w-2xl">
          {errors.non_field_errors && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.non_field_errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </div>
        <div className=" shadow-lg p-6  ">
          <div className="flex gap-4 mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="option"
                value="restaurant"
                className="w-5 h-5 text-[#F07167] bg-gray-100 border-gray-300 focus:ring-[#F07167]"
                checked={formData.user_type === "restaurant"}
                onChange={(e) =>
                  setformData({ ...formData, user_type: e.target.value })
                }
              />
              <span className="text-black">As Restaurant </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="option"
                value="ngo"
                className="w-5 h-5 text-[#F07167] bg-gray-100 border-gray-300 focus:ring-[#F07167]"
                checked={formData.user_type === "ngo"}
                onChange={(e) =>
                  setformData({ ...formData, user_type: e.target.value })
                }
              />
              <span className="text-black">As NGO</span>
            </label>
            <ErrorMessage fieldName="user_type" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full">
              <input
                type="text"
                placeholder={
                  selectedOption == "restaurant"
                    ? "Restaurant/Hotel Name"
                    : "Organization Name"
                }
                value={formData.organization_name}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    organization_name: e.target.value,
                  })
                }
                className={`border-2
              ${
                errors.organization_name ? "border-red-500" : "border-gray-200"
              } rounded-sm px-4 py-2 w-full  `}
              />
              <ErrorMessage fieldName="organization_name" />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  placeholder="Contact person"
                  value={formData.contact_person}
                  onChange={(e) =>
                    setformData({ ...formData, contact_person: e.target.value })
                  }
                  className={`border-2 ${
                    errors.contact_person ? "border-red-500" : "border-gray-200"
                  } rounded-sm px-4 py-2 w-full`}
                />
                <ErrorMessage fieldName="contact_person" />
              </div>
              <div className="flex flex-col w-full">
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) =>
                    setformData({ ...formData, email: e.target.value })
                  }
                  className={`border-2 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-sm px-4 py-2 w-full`}
                />
                <ErrorMessage fieldName="email" />
              </div>
            </div>

            <div className="bg-gray-50 flex flex-col p-4 gap-4 rounded-md mt-2 ">
              <div className="flex items-center gap-4 ">
                {" "}
                <TfiLocationPin className="h-5 w-5" />
                <p>Address Details</p>
              </div>
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  placeholder="Street address"
                  value={formData.address.street_address}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      address: {
                        ...formData.address,
                        street_address: e.target.value,
                      },
                    })
                  }
                  className={`border-2 ${
                    errors.street_address ? "border-red-500" : "border-gray-200"
                  } rounded-sm px-4 py-2 w-full`}
                />
                <ErrorMessage fieldName="street_address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col w-full">
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
                    className={`border-2 ${
                      errors.area ? "border-red-500" : "border-gray-200"
                    } rounded-sm px-4 py-2 w-full`}
                  />
                  <ErrorMessage fieldName="area" />
                </div>
                <div className="flex flex-col w-full">
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
                    className="border-2 border-gray-200 rounded-sm px-4 py-2 w-full"
                  />
                </div>
                <div className="flex flex-col w-full">
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
                    className={`border-2 ${
                      errors.city ? "border-red-500" : "border-gray-200"
                    } rounded-sm px-4 py-2 w-full`}
                  />
                  <ErrorMessage fieldName="city" />
                </div>
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    placeholder="PIN code"
                    value={formData.address.pin_code}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        address: {
                          ...formData.address,
                          pin_code: e.target.value,
                        },
                      })
                    }
                    className={`border-2 ${
                      errors.pin_code ? "border-red-500" : "border-gray-200"
                    } rounded-sm px-4 py-2 lg:w-96  `}
                  />
                  <ErrorMessage fieldName="pin_code" />
                </div>
              </div>
            </div>
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              value={formData.password}
              onChange={(e) =>
                setformData({ ...formData, password: e.target.value })
              }
              className={`border-2 ${
                errors.password ? "border-red-500" : "border-gray-200"
              } rounded-sm px-4 py-2 w-full`}
            />
            <ErrorMessage fieldName="password" />
            <input
              type="password"
              placeholder="Confirm password"
              autoComplete="off"
              value={formData.confirm_password}
              onChange={(e) =>
                setformData({ ...formData, confirm_password: e.target.value })
              }
              className={`border-2 ${
                errors.confirm_password ? "border-red-500" : "border-gray-200"
              } rounded-sm px-4 py-2 w-full`}
            />
            <ErrorMessage fieldName="confirm_password" />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white transition-all duration-300 relative group overflow-hidden"
              disabled={loading}
            >
              <span className="absolute inset-0 bg-[#1F1F1F] translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
              <span className="relative z-10">
                {" "}
                {loading ? "Processing..." : "Register"}{" "}
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
