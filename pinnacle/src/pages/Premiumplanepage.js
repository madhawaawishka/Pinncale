import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Square_rounded_corner_btn from "../components/Square_rounded_corner_btn";
import Footer from "../components/Footer";
import "./styles/External.css";
import { Link } from "react-router-dom";

export default function Premiumplanepage() {
  var pageid = 'premiumplan'
  const [premiumPlan, setPremiumPlan] = useState([]);
  const [silverPlan, setSilverPlan] = useState([]);
  const [goldPlan, setGoldPlan] = useState([]);
  const [platinumPlan, setPlatinumPlan] = useState([]);

  // get premium plan details
  useEffect(() => {
    axios
      .get(`http://localhost:3001/${pageid}`)
      .then((result) => setPremiumPlan(result.data))

      .catch((err) => console.log(err));
  }, [pageid]);

  // set plan details to the variables
  useEffect(() => {
    premiumPlan.forEach((plan, index) => {
      if (index === 0) {
        setSilverPlan(plan);
      } else if (index === 1) {
        setGoldPlan(plan);
      } else if (index === 2) {
        setPlatinumPlan(plan);
      }
    });
  }, [premiumPlan]);

  return (
    <div>
      <Header navid="home" />
      <div className=" w-11/12 mt-6 mx-auto">
        <h1 className="text-white text-[30px] font-bold">Premium Plan Page</h1>
        <div className=" flex py-12 justify-around">
          <div className="bg-[#000000] text-white py-11 px-5 w-[26%] rounded-3xl relative h-[70vh]">
            <div className=" flex flex-col items-center ">
              <h1 className="text-[36px] font-bold mb-5 gradient-text-silvet">
                {silverPlan.planType}
              </h1>
              <span className="text-[32px] font-bold text-[#FE7804]">
                $ {typeof silverPlan.price === 'number' ? silverPlan.price.toFixed(2) : ''}
              </span>
              <p className="text-[15px] mt-[-10px] text-[#ffffff93]">
                {silverPlan.timePeriod}
              </p>
            </div>
            <div className="w-11/12 mx-auto my-9">
              <ul className="text-[#ffffff53] leading-8">
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Can stream videos up to 30 minuts.
                </li>
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Can stream only 3 videos.
                </li>
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Can redeem crystals.
                </li>
              </ul>
            </div>
            <div className="flex justify-center items-center w-full absolute bottom-10 left-0">
              <Link to={`/payment?planId=${silverPlan._id}&page=P`}>
                <Square_rounded_corner_btn value="Upgrade Plan" />
              </Link>
            </div>
          </div>
          <div className="bg-[#000000] text-white py-11 px-5 w-[26%] rounded-3xl relative">
            <div className=" flex flex-col items-center ">
              <h1 className="text-[36px] font-bold mb-5 text-gra gradient-text-gold">
                {goldPlan.planType}
              </h1>
              <span className="text-[32px] font-bold text-[#FE7804]">
                 $ {typeof goldPlan.price === 'number' ? goldPlan.price.toFixed(2) : ''}
              </span>
              <p className="ttext-[15px] mt-[-10px] text-[#ffffff93]">
                {goldPlan.timePeriod}
              </p>
            </div>
            <div className="w-11/12 mx-auto my-9">
              <ul className="text-[#ffffff53] leading-8 ">
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Can stream videos up to 1 hour.
                </li>
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Can stream only 10 videos per season.
                </li>
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Can redeem crystals.
                </li>
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Obtain 10 XP weekly.
                </li>
              </ul>
            </div>
            <div className="flex justify-center items-center w-full absolute bottom-10 left-0">
              <Link to={`/payment?planId=${goldPlan._id}&page=P`}>
                <Square_rounded_corner_btn value="Upgrade Plan" />
              </Link>
            </div>
          </div>
          <div className="bg-[#000000] text-white py-11 px-5 w-[26%] rounded-3xl relative">
            <div className=" flex flex-col items-center ">
              <h1 className="text-[36px] font-bold mb-5 gradient-text-platinum">
                {platinumPlan.planType}
              </h1>
              <span className="text-[32px] font-bold text-[#FE7804]">
              $ {typeof platinumPlan.price === 'number' ? platinumPlan.price.toFixed(2) : ''}
              </span>
              <p className="text-[15px] mt-[-10px] text-[#ffffff93]">
                {platinumPlan.timePeriod}
              </p>
            </div>
            <div className="w-11/12 mx-auto my-9">
              <ul className="text-[#ffffff53] leading-8">
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Can stream videos up to 30 minuts.
                </li>
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Can stream unlimitedvideos.
                </li>
                <li>
                  <img
                    className=" inline-block mr-3"
                    width="12"
                    height="12"
                    src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png"
                    alt="checkmark"
                  />
                  Can redeem crystals.
                </li>
                <li>
                  <img className=" inline-block mr-3" width="12" height="12" src="https://img.icons8.com/tiny-glyph/32/FD7E14/checkmark.png" alt="checkmark"/>
                  Obtain 10 XP daily.
                </li>
              </ul>
            </div>
            <div className="flex justify-center items-center w-full absolute bottom-10 left-0">
              <Link to={`/payment?planId=${platinumPlan._id}&page=P`}>
                <Square_rounded_corner_btn value="Upgrade Plan" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
