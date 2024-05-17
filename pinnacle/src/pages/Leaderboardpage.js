import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import levinho from "../assets/leaderBoard/levinho.png";
import FirstPlaseMedel from "../assets/leaderBoard/firstplace.png";
import SecondPlaseMedel from "../assets/leaderBoard/scondplace.png";
import ThirdPlaseMedel from "../assets/leaderBoard/thirdplace.png";
import Footer from "../components/Footer";
import Leaderboard_rank_card from "../components/Leaderboard_rank_card";
import { Link } from "react-router-dom";
import TicTacToe from "../minigames/TicTacToe"

export default function Leaderboardpage() {
  var pageid = "LeaderBoard";
  const [leaderBoardDetails, setLeaderBoardDetails] = useState([]);
  const [ticTacToeGameChecked, setTicTacToeGameChecked] = useState(false);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/getChannelbyViewCount`)
  //     .then((result) => setLeaderBoardDetails(result.data))
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/${pageid}`)
      .then((result) => setLeaderBoardDetails(result.data))
      .catch((err) => console.log(err));

    axios
      .delete("http://localhost:3001/deleteAllLeaderboardRecords/")
      .then((res) => {
        console.log(res);
        leaderBoardDetails.forEach((detail) => {
          axios
            .post("http://localhost:3001/createLeaderboard", {
              ChannelID: detail._id,
              viewcount: detail.viewCount,
              channelname: detail.channelName,
              subscribercount: detail.subscribercount,
            })
            .then((result) => {
              console.log(result);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((errr) => console.log(errr));  
  }, [pageid, leaderBoardDetails]);



  return (
    <div>
      <Header navid="home" />
      <div className="w-11/12 mt-5 mx-auto h-1/2">
      
        <h1 className="text-white text-[32px] font-bold ">
          Streamers Leaderboard
          <span onClick={() => setTicTacToeGameChecked(true)} className=" text-[16px] text-[#FE7804] rounded-xl px-6 py-2 font-semibold float-right border-2 border-[#FE7804] hover:text-white hover:bg-[#FE7804]">
              Fun Game
            </span>
        </h1>
        
        
  
        <h1 className="text-[#FE7804] text-[20px] font-bold text-center mt-5">
          Last month's Standout Stars
        </h1>
        <div className=" flex justify-around h-full mt-10 px-10">
          <div
            className="bg-cover bg-center w-[20%] h-full flex-col justify-center py-5 mt-4"
            style={{
              backgroundImage: `url(${require("../assets/leaderBoard/leaderboardsecondplase.png")})`,
            }}
          >
            <div className=" bg-gradient-to-t from-[#876415] to-[#C9AA64] p-1 mx-auto w-[102px] rounded-full my-10">
              <img
                src={leaderBoardDetails[1]?.channelDp}
                alt="trash--v1"
                className="rounded-full w-[100px] h-[95px] "
              />
            </div>
            <h1 className=" text-white text-[25px] text-center font-bold">
              {leaderBoardDetails[1]?.channelName}
            </h1>
            <h1 className="text-[85px] text-[#F1CA71] font-extrabold text-center">
              2
            </h1>
            <img
              src={SecondPlaseMedel}
              alt="trash--v1"
              width="150"
              height="150"
              className="mb-14 mx-auto mt-[-30px]"
            />
          </div>

          <div
            className="bg-cover bg-center w-[22%] h-full flex-col justify-center py-5"
            style={{
              backgroundImage: `url(${require("../assets/leaderBoard/leaderboardfirstplase.png")})`,
            }}
          >
            <div className=" bg-gradient-to-t from-[#876415] to-[#C9AA64] p-1 mx-auto w-[102px] rounded-full my-10">
              <img
                src={leaderBoardDetails[0]?.channelDp}
                alt="trash--v1"
                className="rounded-full w-[100px] h-[95px] "
              />
            </div>
            <h1 className=" text-white text-[25px] text-center font-bold">
              {leaderBoardDetails[0]?.channelName}
            </h1>
            <h1 className="text-[96px] text-[#F1CA71] font-extrabold text-center">
              1
            </h1>
            <img
              src={FirstPlaseMedel}
              alt="trash--v1"
              width="200"
              height="200"
              className="mb-14 mx-auto mt-[-50px]"
            />
          </div>

          <div
            className="bg-cover bg-center w-[20%] h-full flex-col justify-center py-5 mt-4"
            style={{
              backgroundImage: `url(${require("../assets/leaderBoard/leaderboardsecondplase.png")})`,
            }}
          >
            <div className=" bg-gradient-to-t from-[#876415] to-[#C9AA64] p-1 mx-auto w-[102px] rounded-full my-10">
              <img
                src={leaderBoardDetails[2]?.channelDp}
                alt="trash--v1"
                className="rounded-full w-[100px] h-[95px] "
              />
            </div>
            <h1 className=" text-white text-[25px] text-center font-bold">
              {leaderBoardDetails[2]?.channelName}
            </h1>
            <h1 className="text-[81px] text-[#F1CA71] font-extrabold text-center">
              3
            </h1>
            <img
              src={ThirdPlaseMedel}
              alt="trash--v1"
              width="150"
              height="150"
              className="mb-14 mx-auto mt-[-10px]"
            />
          </div>
        </div>

        <div className="my-10">
          <div className="my-4">
            <h1>
              <span className=" text-[23px] text-white font-bold ">
                Top Streames
              </span>
              <span className="text-[18px] text-white float-right">
                Current Season
              </span>
            </h1>
          </div>
          <div className=" bg-gradient-to-b from-[#FE7804] to-[#FF451D] text-[#D9D9D9] text-[20px] font-semibold py-2 px-7 flex justify-between">
            <div className="w-[15%]">Rank</div>
            <div className="w-[65%]">Streamer</div>
            <div className="w-[15%]">Total Views</div>
            <div className="w-[15%]">Subscribers</div>
          </div>
          {leaderBoardDetails.map((item, index) => {
            return (
              <Leaderboard_rank_card
                rank={index + 1}
                streamer={item.channelName}
                views={item.viewCount}
                subscribers={item.subscribercount}
              />
            );
          })}
        </div>
      </div>
      <Footer />

      {ticTacToeGameChecked && (<div className=" fixed bg-black bg-opacity-90 top-0 left-0 z-50 w-full h-screen">
            <div className=' absolute top-[50px] left-[50px]' >
            <img onClick={() => setTicTacToeGameChecked(false)} className=' inline-block cursor-pointer' width="35" height="35" src="https://img.icons8.com/pulsar-line/48/FAB005/chevron-left.png" alt="chevron-left"/>
            <span onClick={() => setTicTacToeGameChecked(false)} className=' className=" text-[#FAB005] w-[30%]" ml-2 text-[18px] cursor-pointer'>Back</span>
            </div>
            <TicTacToe/>

            </div>)}
    </div>
  );
}
