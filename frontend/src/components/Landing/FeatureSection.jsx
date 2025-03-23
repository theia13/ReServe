export default function FeatureSection() {
  return (
    <>
      <div className="container flex flex-col justify-start items-center min-h-screen pt-16 text-center">
        <div>
          <h1 className=" text-5xl lg:text-6xl font-bold mb-2 px-4">
            Impact Made Simple
          </h1>

          <p className="text-gray-500 text-xl">
            {" "}
            The Feature that Fuel Progress
          </p>
        </div>

        <div className="flex flex-col lg:flex-row mt-8 lg:mt-24 relative h-[36rem] lg:h-96  w-full items-center justify-between ">
          {/* Text Section */}
          <div className="space-y-2 text-start pl-20 lg:pl-44">
            <h1 className="text-4xl lg:text-6xl font-bold pb-4">
              For <span className="text-[#F07167] ">Restaurants</span>
              <svg
                className="absolute top-42 -left-64 w-full hidden lg:block"
                height="8"
                viewBox="0 0 500 10"
              >
                <path
                  d="M0 4C100 4 100 1 200 1C300 1 300 7 400 7"
                  stroke="#000000"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </h1>
            <p className=" text-lg w-96">
              Easily donate surplus food and track your community impact
            </p>

            <div>
              <ul className="text-start text-gray-500 list-disc ">
                <li>
                  Easily list surplus food for donation through an intuitive
                  interface.
                </li>
                <li>Track your community impact with real-time metrics.</li>
                <li>
                  Build a reputation as a socially responsible establishment.
                </li>
              </ul>
            </div>
          </div>

          {/* Div Block */}
          <div className="left w-96 lg:w-[32rem] h-72 bg-[#F07167] rounded-3xl lg:mr-40 "></div>
        </div>

        <div className="flex flex-col lg:flex-row mt-8 lg:mt-24 relative h-[34rem] lg:h-96  w-full items-center justify-between ">
          {/* Text Section */}
          <div className="space-y-2 text-start pl-16 lg:pl-44">
            <h1 className="text-4xl lg:text-6xl font-bold pb-4">
              For <span className="text-[#F07167]">NGOs</span>
              <svg
                className="absolute top-42 -left-64 w-full"
                height="8"
                viewBox="0 0 900 17"
              >
                <path
                  d="M0 4C100 4 100 1 200 1C300 1 300 7 400 7"
                  stroke="#000000"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </h1>
            <p className=" text-lg w-80 lg:w-[25rem]">
              Access quality surplus food to strengthen your community
              initiatives
            </p>

            <div>
              <ul className="text-start text-gray-500 list-disc w-96 lg:w-full">
                <li>Browse and claim surplus food from nearby restaurants.</li>
                <li>Get notified about new food listings.</li>
                <li>Provide fresh, nutritious meals to those in need.</li>
              </ul>
            </div>
          </div>

          {/* Div Block */}
          <div className="left w-96 lg:w-[32rem] h-72 bg-[#F07167] rounded-3xl lg:mr-40"></div>
        </div>
        <div className="flex flex-col lg:flex-row mt-8 lg:mt-24 relative h-[38rem] lg:h-96  w-full items-center justify-between ">
          {/* Text Section */}
          <div className="space-y-2 text-start pl-16 lg:pl-44">
            <h1 className="text-4xl lg:text-6xl font-bold pb-4">
              Real <br /> <span className="text-[#F07167] ">Time Matching</span>
              <svg
                className="absolute top-42 -left-64 w-full hidden lg:block"
                height="8"
                viewBox="0 0 1400 17"
              >
                <path
                  d="M2 6C200 4 100 1 200 1C300 1 300 4 900 9"
                  stroke="#000000"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </h1>
            <p className=" text-lg w-96 lg:w-[25rem] ">
              Bridge the gap between donors and beneficiaries efficiently
            </p>

            <div>
              <ul className="text-start text-gray-500 list-disc w-96 lg:w-full">
                <li>
                  Instantly connect restaurants with NGOs in their vicinity.
                </li>
                <li>
                  Eliminate delays with automatic pairing based on location.
                </li>
                <li>Optimize food delivery routes for faster transfers.</li>
              </ul>
            </div>
          </div>

          {/* Div Block */}
          <div className="left w-96 lg:w-[32rem] h-72 bg-[#F07167] rounded-3xl lg:mr-40 "></div>
        </div>
      </div>
    </>
  );
}
