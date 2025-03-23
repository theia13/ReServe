import share from "../../assets/share.png";
import signup from "../../assets/signup.png";
import link from "../../assets/link.png";

export default function HowItWorksSection() {
  return (
    <>
      <div className="container flex flex-col justify-start items-center min-h-screen pt-16 text-center">
        <div className="mb-14">
          <h1 className="text-5xl lg:text-6xl font-bold mb-2">How It Works</h1>

          <p className="text-gray-500 text-xl">
            {" "}
            Three simple steps to make a difference
          </p>
        </div>
        <div className="grid grid-rows-3 lg:grid-rows-1 lg:grid-cols-3 gap-16 mx-auto">
          <div className="bg-white p-4 shadow-lg rounded-3xl h-[28rem] relative">
            <div className="absolute flex flex-col justify-center items-start bg-[#F07167] h-48 w-[22rem] rounded-3xl left-0 bottom-0 pl-8">
              <div className="rounded-full bg-[#ffa6a0] h-12 w-12 mb-4 flex justify-center items-center">
                <img src={signup} alt="" className="h-6 " />
              </div>
              <h3 className="font-bold text-3xl text-white">Sign Up</h3>
              <p className="text-red-200 w-64 text-start">
                Join our platform and become part of the change
              </p>
            </div>
          </div>

          <div className="bg-white p-4 shadow-lg rounded-3xl h-[28rem] relative">
            <div className="absolute bg-[#F07167] h-48 w-[22rem] rounded-3xl left-0 bottom-0">
              <div className="absolute flex flex-col justify-center items-start bg-[#F07167] h-48 w-[22rem] rounded-3xl left-0 bottom-0 pl-8">
                <div className="rounded-full bg-[#ffa6a0] h-12 w-12 mb-4 flex justify-center items-center">
                  <img src={link} alt="" className="h-6 " />
                </div>
                <h3 className="font-bold text-3xl text-white">Connect</h3>
                <p className="text-red-200 w-64 text-start">
                  Build meaningful connections that drive action{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 shadow-lg rounded-3xl h-[28rem] w-[22rem] relative">
            <div className="absolute bg-[#F07167] h-48 w-[22rem] rounded-3xl left-0 bottom-0">
              <div className="absolute flex flex-col justify-center items-start bg-[#F07167] h-48 w-[22rem] rounded-3xl left-0 bottom-0 pl-8">
                <div className="rounded-full bg-[#ffa6a0] h-12 w-12 mb-4 flex justify-center items-center">
                  <img src={share} alt="" className="h-6 " />
                </div>
                <h3 className="font-bold text-3xl text-white">Share</h3>
                <p className="text-red-200 w-64 text-start">
                  Coordinate and track the journey of surplus food
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
