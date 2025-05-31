import { Link, useLocation } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiClockCounterClockwise } from "react-icons/pi";

import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";

import { useContext, useState } from "react";
import { CgMenu, CgClose } from "react-icons/cg";
import logo3 from "../../assets/logo3.png";
import { AuthContext } from "../../context/AuthContext";

export default function NGOSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/ngo-dashboard",
      icon: <LuLayoutDashboard size={24} />,
    },
    {
      title: "History",
      path: "/ngo-dashboard/history",
      icon: <PiClockCounterClockwise size={25} />,
    },
    {
      title: "Settings",
      path: "/ngo-dashboard/settings",
      icon: <IoSettingsOutline size={24} />,
    },
  ];

  const NavigationLinks = () => (
    <>
      <nav className="flex-1 px-6 animate-slide-right">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.title}>
              <Link
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-md tmdransition ${
                  location.pathname === item.path
                    ? "bg-[#F07167]/10 text-[#F07167] font-medium"
                    : "text-[#6b7280] hover:bg-gray-100 hover:text-black"
                }`}
              >
                {item.icon} {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300   ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 md:hidden"
      >
        {isOpen ? <CgClose size={24} /> : <CgMenu size={24} />}
      </button>

      {/* Sidebar */}

      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white z-50 
  flex flex-col shadow-lg border-r border-gray-200 
  transition-transform duration-300 md:transform-none 
  ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between animate-slide-right">
          <Link to="/ngo-dashboard" className="px-6 pt-4 pb-6">
            <div className="flex items-center gap-2">
              <img src={logo3} alt="logo" className="w-[180px]" />
            </div>
          </Link>
          <div className="px-8 pb-2 md:hidden">
            <button onClick={toggleSidebar}>
              <CgClose className="text-2xl hover:rotate-90 transform transition-transform duration-300" />
            </button>
          </div>
        </div>

        <NavigationLinks />

        <div className="mt-auto border-t border-gray-200 p-4 animate-slide-right">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 text-md text-[#6b7280]
            hover:bg-gray-100  hover:text-black rounded-lg transition"
          >
            <IoLogOutOutline size={25} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
