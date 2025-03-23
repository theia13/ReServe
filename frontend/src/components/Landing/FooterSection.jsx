import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";

import logo2 from "../../assets/logo 2.png";

export default function FooterSection() {
  return (
    <>
      {" "}
      <div className="flex flex-col h-[64rem] lg:h-auto lg:min-h-screen relative">
        <div className=" h-1/3 flex-grow flex justify-center items-center pt-12 ">
          <h1 className="text-5xl lg:text-6xl font-bold w-[48rem] text-center ">
            Your Support Can Change Lives -{" "}
            <span className="text-[#F07167]"> Get Involved!</span>
          </h1>
        </div>
        <hr className="border-t-2 border-gray-300 w-[90%] self-center" />
        <div className=" h-2/3 flex-grow flex justify-center items-start">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16  pt-28">
            <div className="flex flex-col px-8 lg:px-0  items-center  lg:items-start">
              <img src={logo2} alt="" className=" w-32 lg:w-40" />
              <h1 className="text-5xl font-ysabeau font-bold text-white">
                Re<span className="text-black">Serve</span>
              </h1>
            </div>
            <div>
              <ul className="text-white lg:text-xl space-y-4">
                <li>About</li>
                <li>Contact</li>
                <li>How It Works </li>
                <li>Blog</li>
              </ul>
            </div>
            <div className="px-8 lg:px-0">
              <p className="text-white lg:text-xl mb-4 ">Follow Us</p>
              <div className="flex gap-4">
                <div className="bg-white w-12 h-12 flex justify-center items-center rounded-full p-3">
                  <FaInstagram className="text-4xl" />
                </div>
                <div>
                  <div className="bg-white w-12 h-12 flex justify-center items-center rounded-full p-4">
                    <FaFacebookF className="text-4xl" />
                  </div>
                </div>
                <div>
                  <div className="bg-white w-12 h-12 flex justify-center items-center rounded-full p-3">
                    <FaXTwitter className="text-4xl " />
                  </div>
                </div>
              </div>
            </div>
            <div className="subs flex flex-col items-start text-white lg:text-xl space-y-8 ">
              <p>Subscribe to our newsletter</p>
              <input
                type="email"
                placeholder="Email address"
                className="border-b-2 border-[#f4f4f4]
                 bg-transparent outline-none focus:border-white transition-colors duration-300 ease-in-out placeholder:lg:text-sm placeholder:text-[#f4f4f4]"
              />
              <button className="bg-white py-2 px-3 lg:px-6 lg:py-3 rounded-full text-black self-center text-md lg:text-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[40rem] lg:h-[24rem] bg-[#F07167] rounded-t-[60px] lg:rounded-t-[90px] -z-10"></div>
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 text-[#ffcac7]">
          <div>
            <ul className="flex justify-between gap-8 lg:ml-32">
              <li>Terms of Service</li>
              <li>Privacy</li>
              <li>Cookies</li>
            </ul>
          </div>

          <div className="lg:mr-40">
            <p>© 2025 ReServe. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}
