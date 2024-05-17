import React from 'react'
import Paymentsuccess from '../assets/animations/successanimation.webm'

export default function successpopup(props) {
    const handleOkButtonClick = () => {
        props.onClose(); // Call the function passed from the main page
      };
    
  return (
    <div className=" z-50 fixed top-0 left-0 w-full h-screen flex justify-center bg-black bg-opacity-80 items-center">
          <div className=" flex flex-col justify-center items-center w-[28%] border-2 border-[#39E75F] border-opacity-50 rounded-lg bg-[#1B1E20]">
            <div className="mt-6">
              <video autoPlay loop className="w-[300px] h-auto">
                <source src={Paymentsuccess} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
            <h1 className=" text-[#39E75F] text-[32px] font-bold">
              {props.type} Successfully!
            </h1>
            <p className=" text-[#ffffff90] mt-5 text-center text-base">
              {props.item} {props.type}ed successfully from<br/> the Pinnacle Database.
            </p>
            <div className=" w-full mt-12 mb-5 flex justify-end px-8">
              <button
                onClick={handleOkButtonClick}
                className=" bg-transparent text-[#3ab755] border-2 border-[#3ab755] hover:bg-[#3ab755] hover:text-white rounded-lg py-2 px-5 mr-4"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
  )
}
