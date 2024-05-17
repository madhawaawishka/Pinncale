import React from "react";
// import cod from "../assets/games/cod2.jpg";
import { useState, useEffect } from "react";
import axios from "axios";
// import streamDetailPage from "../pages/StreamDetailsPage";

export default function Stream_Display_Card(props) {
  const [channelName, setChannelName] = useState([]);
  const [channelDp, setChannelDp] = useState([]);
  const [channelSubscriberCount, setchannelSubscriberCount] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getChannelByStreamID/${props.channel_ID}`)
      .then((result) => {
        console.log(result.channel_ID);
        setChannelName(result.data.channelName);
        setChannelDp(result.data.channelDp);
        setchannelSubscriberCount(result.data.subscribercount);
      })
      .catch((err) => console.log(err));
  }, [props.channel_ID]);
  
  return (
    <div className="w-full mb-10 bg-black ">
      <div className="relative bg-transparent ">
        <div className="relative w-full h-full overflow-hidden group">
          <img
            src={props.thumbnailUrl}
            alt="Thumbnail"
            className="w-full transition-opacity duration-300 group-hover:opacity-0"
          />
          <video
            autoPlay
            muted
            className="absolute top-0 left-0 object-cover w-full h-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          >
            <source src={props.videoUrl} type="video/mp4" />
          </video>
        </div>
        <img
          className=" absolute top-[43%] left-[45%]"
          width="50"
          height="50"
          src="https://img.icons8.com/ios-filled/50/FD7E14/circled-play.png"
          alt="circled-play"
        />
      </div>
      <div className="relative flex items-center ">
        <div className="px-3 py-3 bg-transparent ">
          <img
            className="rounded-full"
            style={{ width: "40px", height: "40px" }}
            src={channelDp}
            alt="user-male-circle"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-semibold ">{props.name}</p>
          <p className=" text-[16px] text-[#ffffff9a]">{channelName}</p>
        </div>
        <div className="absolute right-0 px-3 ">
          <div className=" text-[#FE7804] font-semibold text-[15px]">
            {props.viewCount} views
          </div>
          <div className="flex text-[15px]">
            <div className="mr-4 ">
              <img
                className="inline-block "
                width="19"
                height="19"
                src="https://img.icons8.com/ios-glyphs/30/FD7E14/conference-call--v1.png"
                alt="conference-call--v1"
              />{" "}
              {channelSubscriberCount}
            </div>
            {/* <div>
              <img
                className="inline-block "
                width="19"
                height="19"
                src="https://img.icons8.com/windows/32/FD7E14/chat-messages--v2.png"
                alt="chat-messages--v2"
              />{" "}
              53
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
