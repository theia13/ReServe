import image1 from "../../assets/image1.jpg";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [formData, setformData] = useState({
    email: "email",
    password: "password",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <>
      <div className="flex w-full h-screen ">
        <div className="right lg:flex-1">
          <img
            src={image1}
            alt=""
            className="w-full h-full object-cover hidden lg:block"
          />
        </div>
        <div className="left w-full lg:flex-1 flex flex-col justify-center items-center">
          <h1 className="text-4xl lg:text-5xl font-bold">Login</h1>
          <p className="mt-4">
            Don't have an account?
            <span className="text-[#F07167] relative cursor-pointer group">
              {" "}
              <Link to="/auth/register">
                Register here.
                <span className="absolute left-1/2 bottom-0 w-0 h-[0.5px] bg-[#F07167] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </Link>
            </span>
          </p>
          <div className="mt-12">
            <form
              action=""
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setformData({ ...formData, email: e.target.value })
                }
                className="border-2 border-gray-300 rounded-sm px-4 py-2 w-96"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setformData({ ...formData, password: e.target.value })
                }
                className="border-2 border-gray-300 rounded-sm px-4 py-2"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white transition-all duration-300 relative group overflow-hidden"
              >
                <span className="absolute inset-0 bg-[#1F1F1F] translate-x-[-100%] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
                <span className="relative z-10">Sign In</span>
              </button>
            </form>
          </div>
          <div className="flex w-96 justify-between items-center mt-10">
            <p className="text-gray-500">
              <span className="relative cursor-pointer group">
                {" "}
                Forgot your password?
                <span className="absolute left-1/2 bottom-0 w-0 h-[0.5px] bg-gray-500 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
