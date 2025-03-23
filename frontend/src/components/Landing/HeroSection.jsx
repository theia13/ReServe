import logo from "../../assets/logo.png";
import user from "../../assets/user.png";
import more from "../../assets/more.png";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";
import { CgClose } from "react-icons/cg";
import { Link } from "react-router-dom";

// Icons
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/** Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-80 z-40 transition-opacity duration-700 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg  w-96 z-50 flex flex-col px-6  justify-start items-start transform transition-transform duration-500 ease-in-out  ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } `}
      >
        <div className="p-8">
          <button onClick={toggleSidebar}>
            <CgClose className="text-2xl hover:rotate-90 transform transition-transform duration-300" />
          </button>
        </div>

        <div className=" flex flex-col justify-between  p-8">
          <ul className="space-y-8 text-lg">
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a href="">About</a>
            </li>
            <li>
              <a href="">Features</a>
            </li>
            <li>
              <a href="">Contact</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center p-6 h-20 shadow-md ">
        {/* Sidebar */}

        <button
          onClick={(e) => {
            e.preventDefault();

            toggleSidebar();
          }}
          className="lg:hidden"
        >
          <img src={more} alt="more icon" className="w-6 mr-4 " />
        </button>

        <div className="lg:flex-1 flex justify-between lg:justify-start items-center ">
          <Link to="/">
            <img src={logo} alt="logo" className="w-20 lg:w-24" />
          </Link>
        </div>

        <div className="flex-[1] flex justify-center hidden lg:block ">
          <ul className="flex gap-20 text-lg">
            <li>Home</li>
            <li>Features</li>
            <li>About</li>
            <li>Blog</li>
          </ul>
        </div>
        <div className="lg:flex-1 flex justify-end ">
          <ul className="flex gap-8">
            <li>
              <Link to="/auth/login">
                <img src={user} alt="user" className="w-6 mr-4" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {/* End Navbar */}

      {/* Hero */}

      <div className="main relative flex flex-col lg:flex-row lg:p-0">
        <div className="left flex-1 flex flex-col justify-center items-center  p-8">
          <div className="space-y-4 text-center lg:text-start">
            <h1 className="text-5xl lg:text-7xl font-bold">
              Bridge the Gap <br /> Between{" "}
              <span className="text-[#F07167]"> Plenty </span>
              <br /> and <span className="text-[#F07167]"> Need. </span>
            </h1>
            <p className="lg:w-[30rem] text-[#828282] text-center lg:text-start text-lg">
              Join Us in Fighting Food Waste, One Meal at a Time. Together, We
              Can Nourish Communities and Create a Sustainable Future.
            </p>
            <button className="flex justify-center items-center gap-2 bg-[#F07167] rounded-md px-4 py-3 text-white text-lg mx-auto lg:mx-0">
              Learn more <FaArrowRightLong />
            </button>
          </div>
        </div>
        <div className="right flex-1">
          <div className="right-section flex justify-center items-center">
            <div className="bg-[#F07167] w-full lg:w-[536px] h-[calc(100vh-5rem)] ">
              <img
                src={image1}
                alt="food-donation-image"
                className="w-full lg:w-[25rem] absolute lg:bottom-16 lg:right-16 "
              />
              <img
                src={image2}
                alt="food-donation-image"
                className="w-[25rem] absolute bottom-0  lg:top-32 lg:right-[22rem] hidden lg:block "
              />
            </div>
          </div>
        </div>
        <div className="absolute lg:top-[36rem] bottom-0 left-1/2 text-4xl">
          <a href="">
            <IoIosArrowDown className="animate-pulseMove" />
          </a>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}
