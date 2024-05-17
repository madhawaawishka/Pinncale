import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="bg-[#000000] w-full pt-7 pb-1">
      <div className="flex w-10/12 justify-between mx-auto text-white">
        <div className="w-[30%] ">
          <h1 className=" font-bold text-[22px] mb-4 text-[#ffffffaa]">GAMES BY GENRE</h1>
          <ul className="font-semibold leading-7 text-[#ffffffaa]">
            <Link to="/game"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Action</li></Link>
            <Link to="/game"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Adventure</li></Link>
            <Link to="/game"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Racing</li></Link>
            <Link to="/game"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Shooter</li></Link>
            <Link to="/game"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Sports</li></Link>
          </ul>
        </div>
        <div className="w-[30%]">
          <h1 className=" font-bold text-[22px] mb-4 text-[#ffffffaa]">QUICK NAVIGATION</h1>
          <ul className="font-semibold leading-7 text-[#ffffffaa]">
            <Link to="/"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Home</li></Link>
            <Link to="/stream"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Stream</li></Link>
            <Link to="/game"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Game</li></Link>
            <Link to="/community"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Community</li></Link>
            <Link to="/support"><li className=" hover:text-[#FF451D]"><img className="mr-2 inline-block" width="15" height="14" src="https://img.icons8.com/fluency-systems-regular/48/FF451D/circled-record.png" alt="circled-record"/>Support</li></Link>
          </ul>
        </div>
        <div className="w-[30%]">
          <h1 className=" font-bold text-[22px] mb-4 text-[#ffffffaa]">CONNECT WITH US</h1>
          <div className="flex">
          <div className="flxe items-center justify-center mr-5"><img width="50" height="50" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/facebook.png" alt="facebook"/></div>
          <div className="flxe items-center justify-center mr-5 pt-1"><img width="40" height="40" src="https://img.icons8.com/ios/50/FFFFFF/x.png" alt="x"/></div>
          <div className="flxe items-center justify-center mr-5 pt-1"><img width="40" height="40" src="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/24/FFFFFF/external-instagram-photo-and-video-sharing-social-networking-service-owned-by-facebook-logo-bold-tal-revivo.png" alt="external-instagram-photo-and-video-sharing-social-networking-service-owned-by-facebook-logo-bold-tal-revivo"/></div>
          <div className="flxe items-center justify-center mr-5 "><img width="50" height="50" src="https://img.icons8.com/ios-filled/50/FFFFFF/discord-logo.png" alt="discord-logo"/></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center text-white items-center mt-6 py-5">
        <p className=" text-[#ffffffb7] text-base mb-1">Designed by</p>
        <h1 className=" text-[#ffffffaa] text-3xl font-bold mb-7">PINNACLE</h1>
      </div>
        <p className=" text-[#ffffffaa] pl-3">Copyright @ 2024 Pinnalce. - All rights reserved</p>
    </div>
  );
}

