import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";

export default function AboutSection() {
  return (
    <>
      {/* About Section  */}
      <div className="main flex min-h-screen relative flex-col lg:flex-row">
        <div className=" relative left flex-1 flex flex-col justify-start items-center  pt-16 z-30 ">
          <div className="space-y-4">
            <h1 className=" text-5xl lg:text-6xl font-bold ">
              About <span className="text-[#F07167]">ReServe</span>
            </h1>
            <p className="text-gray-500 w-[28rem] lg:w-[35rem] border-t-2 border-gray-300 pt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut,
              minus. Soluta quasi suscipit quibusdam quae consequuntur adipisci
              illum distinctio facilis. Iste beatae saepe quod ut aspernatur
              alias assumenda blanditiis repudiandae. Lorem ipsum, dolor sit
              amet consectetur adipisicing elit. eos. Lorem ipsum, dolor sit
              amet consectetur adipisicing elit. Asperiores, perspiciatis labore
              molestiae laudantium libero consequatur earum culpa est obcaecati
              eaque explicabo.
            </p>
            <div className="absolute bottom-0 w-[35rem] h-[18rem]">
              <img
                src={image1}
                alt=""
                className="w-96 h-full object-cover hidden lg:block"
              />
            </div>
          </div>
        </div>
        <div className="right flex-1 flex justify-center items-center pt-12 lg:pt-20 z-30 ">
          <div className="h-[35rem] w-[35rem]">
            <img src={image2} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[22rem] bg-[#F07167]  rounded-t-[60px] lg:rounded-t-[90px]"></div>
      </div>

      {/* End About Section  */}
    </>
  );
}
