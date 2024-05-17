import React, { useState, useEffect } from "react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Wallpaper from "../assets/home/homewallpaper.jpeg";
import Welcomeimage from "../assets/home/welcome.jpg";
import Underimage from "../assets/home/welcome.jpg";
import Game_Block_Card from "../components/Game_Block_Card";
import Stream_Display_Card from "../components/Stream_Display_Card";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Homepage() {
  const [gameDetails, setGameDetails] = useState([]);
  const [streamDetailsCard, setStreamDetailsCard] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/${"game"}`)
      .then((result) => setGameDetails(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/${"stream"}`)
      .then((result) => setStreamDetailsCard(result.data))
      .catch((err) => console.log(err));
  }, []);

  const latestGameDetails = [...gameDetails];
  latestGameDetails.sort(
    (a, b) => new Date(b.releasdate) - new Date(a.releasdate)
  );

  const [typeEffect] = useTypewriter({
    words: ["GAMES", "STREAMS", "EXCLUSIVE EVENTS", "MINI GAMES"],
    loop: {},
    typeSpeed: 150,
    deleteSpeed: 50,
  });
  return (
    <div className=" text-white">
      <img src={Underimage} className=" w-full fixed top-0 left-0 z-10" />
      <div className="relative z-20">
        <Header navid="home" />
      </div>
      <div className="relative z-20">
        <img src={Wallpaper} className="h-full" alt="Wallpaper"></img>
        <div className="absolute top-0 left-0 h-full flex flex-col justify-center p-[5%]">
          <h1 className=" text-white">
            <span className=" text-[48px] font-bold">
              Welcome to <span className="text-[#FE7804]">Pinnacle</span>
            </span>
            <br />
            <span className=" text-[25px] font-medium">
              Ultimate Destination for Gaming Entertainment! Discover, <br />
            </span>
            <span className="text-[#FF451D] font-bold text-[70px]">
              {typeEffect}
            </span>
            <br />
            <span className=" text-[22px] font-normal">
              All in one place like no other.
            </span>
          </h1>
        </div>
      </div>
      <div className="py-9 z-20 relative bg-[#2A2B2F]">
        <h1 className="text-[#FE7804] text-[48px] text-center font-semibold mb-3">
          Welcome
        </h1>
        <p className=" text-[#969595] text-center mb-6">
          From discovery to purchase to gameplay - Pinnacle delivers a seamless
          <br />
          gaming experience every step of the way!
        </p>
        <div className=" border-b-2 border-dashed border-[#616060] w-[60%] mx-auto"></div>
        <div className=" w-full mt-[4%] relative">
          <img
            className=" w-[45%] ml-[15%]"
            src={Welcomeimage}
            alt="Wallpaper"
          ></img>
          <div className=" border-2 border-white p-10 absolute top-[17%] w-[30%] right-[20%]">
            <div className=" bg-gradient-to-tr from-[#FF451D] to-[#FE7804]  py-5 px-8">
              <h1 className=" text-center text-[32px] text-[#383737] font-semibold mb-3">
                About Us
              </h1>
              <p className=" text-justify text-[#ffffffcd]">
                Welcome to our Pinnacle, where you can immerse yourself
                in endless entertainment! Join our community to stream your
                gameplay and connect with fellow gamers, or explore our curated
                collection of games available for purchase. Begin Today!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" w-full bg-black bg-opacity-50 py-7 relative z-20">
        <div className="w-11/12 mx-auto">
          <h1 className=" text-[25px] text-white font-bold">
            TOP GAMES
            <Link to="/game">
              <span className=" ml-5 border-2 border-[#FE7804] rounded-md font-normal py-2 px-7 text-[#FE7804] cursor-pointer text-[18px] hover:text-white hover:bg-[#FE7804]">
                View all
              </span>
            </Link>
          </h1>
          <div className="flex justify-between mt-7">
            {latestGameDetails.slice(0, 3).map((item) => {
              return (
                <div className="p-0 m-0 w-[30%] rounded-lg">
                  <Link to={`/gamedetail?gameid=${item._id}`}>
                    <Game_Block_Card
                      price={item.price}
                      image={item.gameImageUrl}
                      imgsize="30"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="py-9 z-20 relative bg-[#2A2B2F]">
        <div className="w-11/12 mx-auto">
          <h1 className=" text-[25px] text-white font-bold">
            TOP STREAMS
            <Link to="/stream">
              <span className=" ml-5 border-2 border-[#FE7804] rounded-md font-normal py-2 px-7 text-[#FE7804] cursor-pointer text-[18px] hover:text-white hover:bg-[#FE7804]">
                View all
              </span>
            </Link>
          </h1>

          <div className="flex flex-wrap justify-between mt-8">
            {streamDetailsCard.slice(0, 3).map((item) => {
              return (
                <div className="w-[30%] ">
                  <Link
                    to={`/streamdetail?streamid=${item._id}&channel=${item.channel_ID}`}
                  >
                    <Stream_Display_Card
                      name={item.name}
                      videoUrl={item.videoUrl}
                      thumbnailUrl={item.thumbnailUrl}
                      description={item.description}
                      viewCount={item.viewCount}
                      type={item.type}
                      channel_ID={item.channel_ID}
                      secretVideoCode={item.secretVideoCode}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative z-20 bg-[#2A2B2F]">
        <Footer />
      </div>
    </div>
  );
}
