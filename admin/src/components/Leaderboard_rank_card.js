import React from "react";

export default function Leaderboard_rank_card(props) {
  return (
    <div className=" bg-gradient-to-b from-[#2A2B2F] to-[#00000094] text-[#D9D9D9] text-[20px] font-semibold py-2 px-7 flex justify-between">
      {props.rank <= 3 && (
        <div className="w-[15%] text-[#FE7804] font-bold text-[25px]">
          {props.rank}
        </div>
      )}
      {props.rank > 3 && (
        <div className="w-[15%] font-bold text-[25px]">{props.rank}</div>
      )}
      <div className="w-[65%]">{props.streamer}</div>
      <div className="w-[15%]">
        <img
          className=" inline-block mr-1"
          width="35"
          height="35"
          src="https://img.icons8.com/external-solid-style-bomsymbols-/65/FD7E14/external-design-web-design-device-solid-style-set-2-solid-style-bomsymbols-.png"
          alt="external-design-web-design-device-solid-style-set-2-solid-style-bomsymbols-"
        />
        {props.views}
      </div>
      <div className="w-[15%]">
        <img
          className=" inline-block mr-2"
          width="25"
          height="25"
          src="https://img.icons8.com/ios-filled/50/FD7E14/conference-call.png"
          alt="conference-call"
        />
        {props.subscribers < 1000 && <span>{props.subscribers}</span>}
        {props.subscribers >= 1000 && (
          <span>{(props.subscribers / 1000).toFixed(2)} K</span>
        )}
      </div>
    </div>
  );
}
