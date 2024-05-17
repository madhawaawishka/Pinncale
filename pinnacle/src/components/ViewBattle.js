import React, { useState, useEffect } from "react";
import axios from "axios";
import viewBattleimg from "../assets/commiunity/viewBattle.png";

export default function ViewBattle() {
  const userId = localStorage.getItem("userId");
  const [allViews, setAllViews] = useState([]);
  const [btn, setBtn] = useState(true);
  const [channelName, setChannelName] = useState("");
  const [channelDp, setChannelDp] = useState(null);
  const [channelViewCount, setChannelViewCount] = useState(0);
  const [channelName1, setChannelName1] = useState("");
  const [channelDp1, setChannelDp1] = useState(null);
  const [channelViewCount1, setChannelViewCount1] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/views`)
      .then((result) => setAllViews(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Fetch channel details using localStorage userId
    if (userId) {
      axios
        .get(`http://localhost:3001/getChannelByMemberID/${userId}`)
        .then((result) => {
          console.log(result);
          const channelData = result.data;
          setChannelName(channelData.channelName);
          setChannelDp(channelData.channelDp);
          setChannelViewCount(channelData.viewCount);
        })
        .catch((err) => console.log(err));
    }
  }, [userId]);

  useEffect(() => {
    // Fetch channel details using userId from the first item in allViews
    if (allViews.length > 0 && allViews[0].userId) {
      axios
        .get(`http://localhost:3001/getChannelByMemberID/${allViews[0].userId}`)
        .then((result) => {
          console.log(result);
          const channelData = result.data;
          setChannelName1(channelData.channelName);
          setChannelDp1(channelData.channelDp);
          setChannelViewCount1(channelData.viewCount);
        })
        .catch((err) => console.log(err));
    }
  }, [allViews]);

  return (
    <div className=" w-11/12">
      <div className="mt-10 relative w-full">
        <img className="mx-auto" src={viewBattleimg} alt="View Battle" />
        <div className=" flex justify-around absolute top-14 left-0 w-full">
        <div className=" flex flex-col justify-center w-[50%] mt-14">
          <img className=" w-[150px] h-[150px] rounded-full mt-9" src={channelDp} alt="Channel DP" />
          <p className=" text-white font-bold text-[30px] mt-5">{channelName}</p>
        </div>
        <div className=" mt-14">
          <p className=" text-white font-bold text-[30px] mt-9">{channelName1}</p>
          <img  className=" w-[150px] h-[150px] rounded-full mt-5" src={channelDp1} alt="Channel DP 1" />
        </div>
        </div>
          <p className=" text-white font-bold text-[20px] absolute bottom-[90px] left-[120px]">{channelViewCount} Views</p>
          <p className=" text-white font-bold text-[20px] absolute bottom-[90px] right-[120px]">{channelViewCount1} Views</p>
      </div>
    </div>
  );
}
